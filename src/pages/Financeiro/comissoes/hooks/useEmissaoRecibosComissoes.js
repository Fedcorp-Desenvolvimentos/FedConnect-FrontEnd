import { useMemo, useState } from "react";
import {
  buscarComissoesPorFatura,
  buscarFaturasComissao,
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

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [selectedRetentions, setSelectedRetentions] = useState([]);

  const [documentType, setDocumentType] = useState("recibo");
  const [printPaidValue, setPrintPaidValue] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Aguardando consulta");
  const [lastEmission, setLastEmission] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

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

  async function searchInvoices() {
    setIsSearching(true);
    setStatusMessage("Consultando faturas e comissões");

    try {
      const faturasResult = await buscarFaturasComissao(filters);

      const comissoesResult = await Promise.all(
        faturasResult.map(async (fatura) => {
          const comissoesDaFatura = await buscarComissoesPorFatura(fatura.id);

          return comissoesDaFatura.map((comissao) => ({
            ...comissao,
            faturaId: fatura.id,
            faturaNumero: fatura.numero,
            favorecido: fatura.favorecido,
          }));
        })
      );

      const todasComissoes = comissoesResult.flat();

      setFaturas(faturasResult);
      setComissoes(todasComissoes);

      setSelectedInvoices([]);
      setSelectedCommissions([]);
      setSelectedRetentions([]);
      setLastEmission(null);

      if (!faturasResult.length) {
        setStatusMessage("Nenhuma fatura encontrada");
        return;
      }

      setStatusMessage(
        `${faturasResult.length} fatura(s) e ${todasComissoes.length} comissão(ões) encontrada(s)`
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