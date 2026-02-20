// src/services/consultaAdministradora.js
import api from "./api";

function getToken() {
  return localStorage.getItem("accessToken", "");
}

function traduzirErroApi(error) {
  const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    error?.message;

  if (!msg) return "Erro inesperado. Tente novamente.";

  const text = msg.toString().toLowerCase();

  if (text.startsWith("<!doctype")) {
    return "Erro temporário de conexão com o servidor. Tente novamente em instantes.";
  }
  if (text.includes("proxy error")) {
    return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
  }
  if (text.includes("network error")) {
    return "Falha de rede. Verifique sua conexão e tente novamente.";
  }
  if (text.includes("401") || text.includes("unauthorized")) {
    return "Sessão expirada. Faça login novamente.";
  }

  return msg.toString();
}

/**
 * Ajuste os endpoints aqui ✅
 * (mantive tudo em um lugar pra ficar fácil)
 */
const ENDPOINTS = {
  // 1) Consultar por CNPJ (retornar condomínio / administradora)
  // Exemplo: GET /consultas/administradoras/cnpj/{cnpj}/
  CONSULTAR_POR_CNPJ: (cnpj) => `consultas/administradoras/cnpj/${cnpj}/`,

  // 2) Produtos ativos da administradora
  // Exemplo: GET /consultas/administradoras/{admId}/produtos-ativos/
  PRODUTOS_ATIVOS: (admId) => `consultas/administradoras/${admId}/produtos-ativos/`,

  // 3) Buscar condomínio por número da fatura
  // Exemplo: GET /consultas/faturas/{numero}/condominio/
  CONDOMINIO_POR_FATURA: (numeroFatura) => `consultas/faturas/${numeroFatura}/condominio/`,
};

export async function consultarAdministradoraPorCnpj(cnpj) {
  try {
    const token = getToken();
    const res = await api.get(ENDPOINTS.CONSULTAR_POR_CNPJ(cnpj), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Erro consultarAdministradoraPorCnpj:", error);
    throw new Error(traduzirErroApi(error));
  }
}

export async function getProdutosAtivosDaAdministradora(admId) {
  try {
    const token = getToken();
    const res = await api.get(ENDPOINTS.PRODUTOS_ATIVOS(admId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Erro getProdutosAtivosDaAdministradora:", error);
    throw new Error(traduzirErroApi(error));
  }
}

export async function buscarCondominioPorNumeroFatura(numeroFatura) {
  try {
    const token = getToken();
    const res = await api.get(ENDPOINTS.CONDOMINIO_POR_FATURA(numeroFatura), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Erro buscarCondominioPorNumeroFatura:", error);
    throw new Error(traduzirErroApi(error));
  }
}
