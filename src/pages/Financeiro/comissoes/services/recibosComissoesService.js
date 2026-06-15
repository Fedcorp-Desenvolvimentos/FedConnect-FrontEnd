import {
  recibosMockComissoes,
  recibosMockFaturas,
} from "../data/recibosComissoesMock";

function matchesDateRange(value, start, end) {
  if (!value) return true;
  if (start && value < start) return false;
  if (end && value > end) return false;
  return true;
}

function matchesText(value, term) {
  if (!term) return true;
  return String(value || "").toLowerCase().includes(term.toLowerCase());
}

function matchesInvoiceStatus(status, filterStatus) {
  if (!filterStatus || filterStatus === "todas") return true;
  if (filterStatus === "baixadas") return status === "baixada";
  if (filterStatus === "pendentes") return status === "pendente";
  return true;
}

export async function buscarFaturasComissao(filters) {
  return recibosMockFaturas.filter((fatura) => {
    return (
      matchesText(fatura.favorecido, filters.favorecido) &&
      matchesText(fatura.numero, filters.fatura) &&
      matchesDateRange(
        fatura.vencimento,
        filters.vencimentoInicial,
        filters.vencimentoFinal
      ) &&
      matchesDateRange(
        fatura.vigencia,
        filters.vigenciaInicial,
        filters.vigenciaFinal
      ) &&
      matchesText(fatura.coEstipulante, filters.coEstipulante) &&
      matchesText(fatura.apolice, filters.apolice) &&
      matchesText(fatura.comercial, filters.comercial) &&
      matchesText(fatura.recibo, filters.recibo) &&
      matchesInvoiceStatus(fatura.status, filters.status) &&
      (!filters.tipo || fatura.tipo === filters.tipo)
    );
  });
}

export async function buscarComissoesPorFatura(faturaId) {
  return recibosMockComissoes[faturaId] || [];
}

export async function emitirDocumentoComissoes(payload) {
  return {
    id: Date.now(),
    numero: `RC-${String(Date.now()).slice(-6)}`,
    emitidoEm: new Date().toISOString(),
    ...payload,
  };
}
