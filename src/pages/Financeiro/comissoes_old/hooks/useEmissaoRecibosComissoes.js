import { useEffect, useMemo, useState } from "react";
import {
  buscarComissoesPorFatura,
  buscarFaturasComissao,
  buscarPessoas,
  emitirDocumentoComissoes,
} from "../services/recibosComissoesService";
import {
  calculateRetentionSummary,
  formatMoney,
  initialRecibosFilters,
} from "../utils/recibosComissoesUtils";

export function useEmissaoRecibosComissoes() {
  const [filters, setFilters] = useState(initialRecibosFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [faturas, setFaturas] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [pessoas, setPessoas] = useState([]);

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [selectedRetentions, setSelectedRetentions] = useState([]);

  const [documentType, setDocumentType] = useState("recibo");
  const [printPaidValue, setPrintPaidValue] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Aguardando consulta");
  const [lastEmission, setLastEmission] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [pessoasLoading, setPessoasLoading] = useState(true);

  const allInvoicesSelected =
    faturas.length > 0 && selectedInvoices.length === faturas.length;

  const allCommissionsSelected =
    comissoes.length > 0 && selectedCommissions.length === comissoes.length;

  const retentionSummary = useMemo(
    () =>
      calculateRetentionSummary(
        comissoes,
        selectedCommissions,
        selectedRetentions
      ),
    [comissoes, selectedCommissions, selectedRetentions]
  );

  const summary = useMemo(
    () => ({
      invoices: faturas.length,
      selectedInvoices: selectedInvoices.length,
      commissions: comissoes.length,
      selectedCommissions: selectedCommissions.length,
      selectedTotal: formatMoney(retentionSummary.grossTotal),
      netTotal: formatMoney(retentionSummary.netTotal),
      status: statusMessage,
    }),
    [
      faturas.length,
      comissoes.length,
      selectedInvoices.length,
      selectedCommissions.length,
      retentionSummary.grossTotal,
      retentionSummary.netTotal,
      statusMessage,
    ]
  );

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  useEffect(() => {
    setPessoasLoading(true);
    buscarPessoas({ status: "A", limit: 7000 })
      .then((response) => {
        const lista = Array.isArray(response)
          ? response
          : response?.data || response?.results || [];
        setPessoas(lista);
      })
      .catch(() => setPessoas([]))
      .finally(() => setPessoasLoading(false));
  }, []);

  async function searchInvoices() {
    setIsSearching(true);
    setStatusMessage("Consultando faturas e comissões");

    try {
      const data = await buscarFaturasComissao(filters);

      const rawList = Array.isArray(data)
        ? data
        : data?.results || data?.data || [];

      const linhas = rawList.map((r) => ({
        id: r.ID || r.id || `${r.FATURA}-${r.PARCELA}`,
        numero: r.FATURA || r.fatura || "",
        tipo_fat: r.TIPO_FAT || "",
        favorecido: r.NOME || r.nome || "",
        vencimento: r.VENCIMENTO || r.vencimento,
        vigencia: r.DT_INI_VIG || r.dt_ini_vig,
        parcela: r.PARCELA || r.parcela || 1,
        valorLiquido: Number(r.VALOR_LIQ ?? r.valor_liq ?? 0),
        valor: Number(r.VALOR ?? r.valor ?? 0),
        quitado: Number(r.QUITADO ?? r.quitado ?? 0),
        comissao: Number(r.COMISSAO ?? r.comissao ?? 0),
        imposto: Number(r.IMPOSTO ?? r.imposto ?? 0),
        status: r.voucher || r.VOUCHER ? "baixada" : "pendente",
        tipo: r.TIPO || r.tipo || "",
        coEstipulante: r.CO_ESTIP || r.co_estip || "",
        apolice: r.APOLICE || "",
        recibo: r.VOUCHER || r.voucher || "",
        produto: r.PRODUTO || r.produto || "",
        documento: r.DOCUMENTO || "",
        dt_baixa: r.DT_BAIXA || "",
        premio_bruto: Number(r.PREMIO_BRUTO ?? 0),
        premio_liq: Number(r.PREMIO_LIQ ?? 0),
        favor: r.FAVOR || "",
        conta: r.BC_AG_CC || "",
        chave_pix: r.CHAVE_PIX || "",
      }));

      const faturasUnicas = [];
      const faturasMap = new Map();
      for (const linha of linhas) {
        if (!faturasMap.has(linha.numero)) {
          faturasMap.set(linha.numero, {
            id: linha.numero,
            numero: linha.numero,
            tipo: linha.tipo || linha.tipo_fat,
            favorecido: linha.favorecido,
            vencimento: linha.vencimento,
            vigencia: linha.vigencia,
            parcela: linha.parcela,
            valorLiquido: linha.valorLiquido,
            status: linha.status,
            coEstipulante: linha.coEstipulante,
            apolice: linha.apolice,
            recibo: linha.recibo,
          });
        }
      }
      for (const fatura of faturasMap.values()) {
        faturasUnicas.push(fatura);
      }

      const todasComissoes = linhas.map((linha) => ({
        id: linha.id,
        competencia: linha.vencimento
          ? new Date(linha.vencimento).toLocaleString("pt-BR", {
              month: "short",
              year: "numeric",
            }).replace(/ de /, "/").toUpperCase()
          : "",
        produto: linha.produto,
        cliente: linha.coEstipulante || linha.favorecido,
        data: linha.vencimento,
        valor: linha.valor,
        faturaId: linha.numero,
        faturaNumero: linha.numero,
        favorecido: linha.favorecido,
      }));

      setFaturas(faturasUnicas);
      setComissoes(todasComissoes);

      setSelectedInvoices([]);
      setSelectedCommissions([]);
      setSelectedRetentions([]);
      setLastEmission(null);

      if (!faturasUnicas.length) {
        setStatusMessage("Nenhuma fatura encontrada");
        return;
      }

      setStatusMessage(
        `${faturasUnicas.length} fatura(s) e ${todasComissoes.length} comissão(ões) encontrada(s)`
      );
    } finally {
      setIsSearching(false);
    }
  }

  function toggleInvoice(invoiceId) {
    setSelectedInvoices((current) => {
      if (current.includes(invoiceId)) {
        return current.filter((id) => id !== invoiceId);
      }

      return [...current, invoiceId];
    });
  }

  function toggleAllInvoices() {
    if (allInvoicesSelected) {
      setSelectedInvoices([]);
      return;
    }

    setSelectedInvoices(faturas.map((fatura) => fatura.id));
  }

  function toggleCommission(comissaoId) {
    setSelectedCommissions((current) => {
      if (current.includes(comissaoId)) {
        return current.filter((id) => id !== comissaoId);
      }

      return [...current, comissaoId];
    });
  }

  function toggleAllCommissions() {
    if (allCommissionsSelected) {
      setSelectedCommissions([]);
      return;
    }

    setSelectedCommissions(comissoes.map((comissao) => comissao.id));
  }

  function toggleRetention(retentionId) {
    setSelectedRetentions((current) => {
      if (current.includes(retentionId)) {
        return current.filter((id) => id !== retentionId);
      }

      return [...current, retentionId];
    });
  }

  function clearAll() {
    setFilters(initialRecibosFilters);
    setFaturas([]);
    setComissoes([]);
    setSelectedInvoices([]);
    setSelectedCommissions([]);
    setSelectedRetentions([]);
    setLastEmission(null);
    setStatusMessage("Aguardando consulta");
  }

  async function issueDocument() {
    if (selectedInvoices.length === 0 && selectedCommissions.length === 0) {
      return;
    }

    setIsIssuing(true);
    setStatusMessage("Emitindo documento");

    try {
      const result = await emitirDocumentoComissoes({
        tipoDocumento: documentType,
        faturasIds: selectedInvoices,
        comissoesIds: selectedCommissions,
        retencoes: selectedRetentions,
        imprimirValorQuitado: printPaidValue,
        totais: retentionSummary,
      });

      setLastEmission(result);
      setStatusMessage(
        `${documentType === "voucher" ? "Voucher" : "Recibo"} emitido`
      );
    } finally {
      setIsIssuing(false);
    }
  }

  function previewDocument() {
    if (selectedInvoices.length === 0 && selectedCommissions.length === 0) {
      return;
    }

    setStatusMessage("Pré-visualização preparada");
  }

  return {
    clearAll,
    comissoes,
    documentType,
    filters,
    faturas,
    isIssuing,
    isSearching,
    issueDocument,
    lastEmission,
    pessoas,
    pessoasLoading,
    previewDocument,
    printPaidValue,
    retentionSummary,
    searchInvoices,

    selectedInvoices,
    selectedCommissions,
    selectedRetentions,

    allInvoicesSelected,
    allCommissionsSelected,

    setDocumentType,
    setPrintPaidValue,
    setShowAdvancedFilters,
    showAdvancedFilters,

    summary,

    toggleAllInvoices,
    toggleInvoice,
    toggleAllCommissions,
    toggleCommission,
    toggleRetention,
    updateFilter,
  };
}