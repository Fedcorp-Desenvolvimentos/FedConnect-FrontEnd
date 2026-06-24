import api from "../../../../services/api";

function mapFilters(filters) {
  const mapping = {
    favorecido: "favorecido",
    fatura: "fatura",
    vencimentoInicial: "vencimento_inicial",
    vencimentoFinal: "vencimento_final",
    status: "status",
    tipo: "tipo",
    coEstipulante: "co_estipulante",
    apolice: "apolice",
    comercial: "comercial",
    recibo: "recibo",
    vigenciaInicial: "vigencia_inicial",
    vigenciaFinal: "vigencia_final",
  };

  const params = {};
  for (const [frontKey, backKey] of Object.entries(mapping)) {
    const value = filters[frontKey];
    if (value !== "" && value !== null && value !== undefined) {
      params[backKey] = value;
    }
  }
  return params;
}

export async function buscarFaturasComissao(filters) {
  const params = mapFilters(filters);
  params.limit = 10000;
  params.offset = 0;

  const response = await api.get("/comissoes/faturas/", { params });
  return response.data;
}

export async function buscarComissoesPorFatura(faturaId) {
  try {
    const response = await api.get(`/comissoes/faturas/${faturaId}/comissoes/`);
    return response.data?.data || [];
  } catch {
    return [];
  }
}

export async function buscarPessoas(params = {}) {
  const response = await api.get("/pessoas/");
  return response.data;
}

export async function emitirDocumentoComissoes(payload) {
  try {
    const response = await api.post("/comissoes/emitir/", {
      fatura: payload.faturasIds?.[0],
      parcela: 1,
      tipo_fat: "F",
      tipo_documento: payload.tipoDocumento,
    });
    return response.data?.data || response.data;
  } catch {
    return null;
  }
}
