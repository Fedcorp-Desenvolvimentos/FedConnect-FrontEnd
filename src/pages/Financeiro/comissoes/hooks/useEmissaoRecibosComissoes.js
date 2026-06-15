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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [comissoes, setComissoes] = useState([]);
  const [selectedCommissions, setSelectedCommissions] = useState([]);
  const [selectedRetentions, setSelectedRetentions] = useState([]);
  const [documentType, setDocumentType] = useState("recibo");
  const [printPaidValue, setPrintPaidValue] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Aguardando consulta");
  const [lastEmission, setLastEmission] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);

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
      selectedCommissions: selectedCommissions.length,
      selectedTotal: formatMoney(retentionSummary.grossTotal),
      netTotal: formatMoney(retentionSummary.netTotal),
      status: statusMessage,
    }),
    [
      faturas.length,
      retentionSummary.grossTotal,
      retentionSummary.netTotal,
      selectedCommissions.length,
      statusMessage,
    ]
  );

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  async function searchInvoices() {
    setIsSearching(true);
    setStatusMessage("Consultando faturas");

    try {
      const result = await buscarFaturasComissao(filters);
      setFaturas(result);
      setSelectedInvoice(null);
      setComissoes([]);
      setSelectedCommissions([]);
      setLastEmission(null);
      setStatusMessage(result.length ? "Faturas encontradas" : "Nenhuma fatura encontrada");
    } finally {
      setIsSearching(false);
    }
  }

  async function selectInvoice(fatura) {
    setSelectedInvoice(fatura);
    setSelectedCommissions([]);
    setLastEmission(null);
    setStatusMessage(`Fatura ${fatura.numero} selecionada`);

    const result = await buscarComissoesPorFatura(fatura.id);
    setComissoes(result);
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
    if (selectedCommissions.length === comissoes.length) {
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
    setSelectedInvoice(null);
    setComissoes([]);
    setSelectedCommissions([]);
    setSelectedRetentions([]);
    setLastEmission(null);
    setStatusMessage("Aguardando consulta");
  }

  async function issueDocument() {
    if (!selectedInvoice || selectedCommissions.length === 0) return;

    setIsIssuing(true);
    setStatusMessage("Emitindo documento");

    try {
      const result = await emitirDocumentoComissoes({
        tipoDocumento: documentType,
        faturaId: selectedInvoice.id,
        comissoesIds: selectedCommissions,
        retencoes: selectedRetentions,
        imprimirValorQuitado: printPaidValue,
        totais: retentionSummary,
      });

      setLastEmission(result);
      setStatusMessage(`${documentType === "voucher" ? "Voucher" : "Recibo"} emitido`);
    } finally {
      setIsIssuing(false);
    }
  }

  function previewDocument() {
    if (!selectedInvoice || selectedCommissions.length === 0) return;
    setStatusMessage("Pre-visualizacao preparada");
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
    selectedCommissions,
    selectedInvoice,
    selectedRetentions,
    setDocumentType,
    setPrintPaidValue,
    setShowAdvancedFilters,
    showAdvancedFilters,
    selectInvoice,
    summary,
    toggleAllCommissions,
    toggleCommission,
    toggleRetention,
    updateFilter,
  };
}
