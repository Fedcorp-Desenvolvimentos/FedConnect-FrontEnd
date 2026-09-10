// src/services/faturasPendentesService.js
// Relatório de faturas pendentes (spec relatorio-faturas-pendentes). Contrato do
// Django em FedConnect-Back-End/specs/relatorio-faturas-pendentes/; os nomes dos
// filtros e das colunas são os do FedHub, repassados sem tradução (RNF-FIN-001).
import api from "./api";

const BASE = "faturas/pendentes/";

/** Remove filtros vazios: o backend aplica os padrões do legado. */
const limpar = (filtros = {}) =>
  Object.fromEntries(
    Object.entries(filtros).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

const nomeDoHeader = (response, padrao) => {
  const disposicao = response.headers?.["content-disposition"] || "";
  const casado = /filename="?([^";]+)"?/.exec(disposicao);
  return casado ? casado[1] : padrao;
};

export const FaturasPendentesService = {
  /** Linhas (um documento por linha) e totais, já calculados pelo backend. */
  buscar: async (filtros) => {
    const response = await api.get(BASE, { params: limpar(filtros) });
    return response.data; // { sucesso, filtros, referencia, totais, data }
  },

  /** Planilha com os mesmos filtros; devolve blob e o nome sugerido pelo servidor. */
  baixarPlanilha: async (filtros) => {
    const response = await api.get(`${BASE}exportar-excel/`, {
      params: limpar(filtros),
      responseType: "blob",
    });
    return { blob: response.data, nomeArquivo: nomeDoHeader(response, "faturas-pendentes.xlsx") };
  },

  /** PDF no layout do legado, com os mesmos filtros. */
  baixarPdf: async (filtros) => {
    const response = await api.get(`${BASE}exportar-pdf/`, {
      params: limpar(filtros),
      responseType: "blob",
    });
    return { blob: response.data, nomeArquivo: nomeDoHeader(response, "faturas-pendentes.pdf") };
  },
};

export default FaturasPendentesService;
