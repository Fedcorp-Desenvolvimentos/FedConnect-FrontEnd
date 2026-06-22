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

  const response = await api.get("/comissoes/search/", { params });
  return response.data;
}

export async function buscarComissoesPorFatura(faturaId) {
  return [];
}

export async function buscarPessoas(params = {}) {
  const response = await api.get("/pessoas/");
  return response.data;
}

export async function emitirDocumentoComissoes(payload) {
  return {
    id: Date.now(),
    numero: `RC-${String(Date.now()).slice(-6)}`,
    emitidoEm: new Date().toISOString(),
    ...payload,
  };
}
