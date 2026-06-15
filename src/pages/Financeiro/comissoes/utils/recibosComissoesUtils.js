import { formatCurrencyBR, formatDateBR } from "../../../../utils/formatters";
import { retentionOptions } from "../data/recibosComissoesMock";

export const initialRecibosFilters = {
  favorecido: "",
  fatura: "",
  vencimentoInicial: "",
  vencimentoFinal: "",
  status: "pendentes",
  tipo: "",
  coEstipulante: "",
  apolice: "",
  comercial: "",
  recibo: "",
  vigenciaInicial: "",
  vigenciaFinal: "",
};

export function formatMoney(value, fallback = "R$ 0,00") {
  return formatCurrencyBR(value, fallback);
}

export function formatDate(value) {
  return formatDateBR(value, "-");
}

export function getInvoiceStatusView(status) {
  if (status === "baixada") {
    return { label: "Baixada", className: "paid" };
  }

  return { label: "Pendente", className: "pending" };
}

export function getSelectedCommissions(comissoes, selectedIds) {
  return comissoes.filter((comissao) => selectedIds.includes(comissao.id));
}

export function sumCommissions(comissoes) {
  return comissoes.reduce((total, comissao) => total + Number(comissao.valor || 0), 0);
}

export function calculateRetentionSummary(comissoes, selectedIds, selectedRetentions) {
  const selectedComissoes = getSelectedCommissions(comissoes, selectedIds);
  const grossTotal = sumCommissions(selectedComissoes);
  const retentionRows = retentionOptions
    .filter((option) => selectedRetentions.includes(option.id))
    .map((option) => ({
      ...option,
      value: grossTotal * option.rate,
    }));
  const retentionTotal = retentionRows.reduce((total, item) => total + item.value, 0);

  return {
    grossTotal,
    retentionRows,
    retentionTotal,
    netTotal: grossTotal - retentionTotal,
  };
}
