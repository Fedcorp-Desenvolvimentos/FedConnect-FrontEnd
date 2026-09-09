// src/services/cursoCipaService.js
// Contrato definido em FedConnect-Back-End/specs/curso-cipa/design.md
// ("Modelo de Dados e Contratos"). A rota não é paginada: devolve lista.
import api from "./api";

const API_URL = "cursos-cipa/";

/** GET de um PDF: blob + nome do arquivo sugerido pelo backend no Content-Disposition. */
async function baixarPdf(url, nomePadrao) {
  const response = await api.get(url, { responseType: "blob" });
  const disposicao = response.headers?.["content-disposition"] || "";
  const casado = /filename="?([^";]+)"?/.exec(disposicao);
  return { blob: response.data, nomeArquivo: casado ? casado[1] : nomePadrao };
}

/** Campos do palestrante em FormData (a assinatura é arquivo); sem arquivo, JSON basta. */
function montarFormInstrutor(dados) {
  const { assinatura, ...campos } = dados;
  if (!(assinatura instanceof File)) return campos;
  const form = new FormData();
  Object.entries(campos).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null) form.append(chave, valor);
  });
  form.append("assinatura", assinatura);
  return form;
}

export const CursoCipaService = {
  /** Locais do curso (cadastro editável, RF-CIP-007). Só ativos, salvo `todos`. */
  listarLocais: async ({ todos = false } = {}) => {
    const response = await api.get(`${API_URL}locais/`, { params: todos ? { todos: 1 } : {} });
    return response.data;
  },
  criarLocal: async (dados) => (await api.post(`${API_URL}locais/`, dados)).data,
  atualizarLocal: async (id, dados) => (await api.patch(`${API_URL}locais/${id}/`, dados)).data,
  excluirLocal: async (id) => {
    await api.delete(`${API_URL}locais/${id}/`);
  },

  /** Turmas de um local no mês. `mes` é 1–12. */
  listarTurmas: async ({ mes, ano, local }) => {
    const response = await api.get(API_URL, { params: { mes, ano, local } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.results ?? [];
  },

  /** Palestrantes (cadastro editável, RF-CIP-006). Só ativos, salvo `todos`. */
  listarInstrutores: async ({ todos = false } = {}) => {
    const response = await api.get(`${API_URL}instrutores/`, { params: todos ? { todos: 1 } : {} });
    return response.data;
  },
  /** `dados` vira multipart quando há `assinatura` (File); o backend nunca devolve o arquivo. */
  criarInstrutor: async (dados) =>
    (await api.post(`${API_URL}instrutores/`, montarFormInstrutor(dados))).data,
  atualizarInstrutor: async (id, dados) =>
    (await api.patch(`${API_URL}instrutores/${id}/`, montarFormInstrutor(dados))).data,
  excluirInstrutor: async (id) => {
    await api.delete(`${API_URL}instrutores/${id}/`);
  },

  obterTurma: async (turmaId) => {
    const response = await api.get(`${API_URL}${turmaId}/`);
    return response.data;
  },

  /**
   * Histórico paginado por período (RF-HIS-001). Rota separada da listagem do
   * calendário, que devolve o mês inteiro sem envelope de paginação.
   */
  listarHistorico: async (params) => {
    const response = await api.get(`${API_URL}historico/`, { params });
    return response.data; // { count, next, previous, results }
  },

  /** Inscrições em todas as turmas, uma linha por inscrição (RF-HIS-002). */
  listarParticipantes: async (params) => {
    const response = await api.get(`${API_URL}participantes/`, { params });
    return response.data; // { count, next, previous, results }
  },

  criarTurma: async (turma) => {
    const response = await api.post(API_URL, turma);
    return response.data;
  },

  atualizarTurma: async (turmaId, turma) => {
    const response = await api.patch(`${API_URL}${turmaId}/`, turma);
    return response.data;
  },

  excluirTurma: async (turmaId) => {
    await api.delete(`${API_URL}${turmaId}/`);
  },

  listarInscritos: async (turmaId) => {
    const response = await api.get(`${API_URL}${turmaId}/inscricoes/`);
    return response.data;
  },

  criarInscrito: async (turmaId, inscrito) => {
    const response = await api.post(`${API_URL}${turmaId}/inscricoes/`, inscrito);
    return response.data;
  },

  /** Onde mais este CPF já está inscrito, fora da turma informada. */
  verificarCpf: async (cpf, excluirTurmaId) => {
    const response = await api.get(`${API_URL}verificar-cpf/`, {
      params: { cpf, excluir_turma: excluirTurmaId },
    });
    return response.data;
  },

  atualizarInscrito: async (turmaId, inscricaoId, inscrito) => {
    const response = await api.patch(
      `${API_URL}${turmaId}/inscricoes/${inscricaoId}/`,
      inscrito
    );
    return response.data;
  },

  excluirInscrito: async (turmaId, inscricaoId) => {
    await api.delete(`${API_URL}${turmaId}/inscricoes/${inscricaoId}/`);
  },

  /**
   * Presença em lote (RF-HIS-005): `[{inscricao_id, presente}]`. Ou grava
   * tudo, ou nada. Devolve a turma completa, já Realizada e com as contagens.
   */
  registrarPresenca: async (turmaId, presencas) => {
    const response = await api.post(`${API_URL}${turmaId}/presenca/`, { presencas });
    return response.data;
  },

  /**
   * Emite certificados para os presentes aptos (RF-HIS-006). Idempotente.
   * Devolve `{emitidos, ja_existentes, impedidos, turma}`.
   */
  emitirCertificados: async (turmaId) => {
    const response = await api.post(`${API_URL}${turmaId}/certificados/`);
    return response.data;
  },

  /** Todos os certificados emitidos da turma num PDF (frente e verso cada). */
  baixarCertificadosTurma: async (turmaId) =>
    baixarPdf(`${API_URL}${turmaId}/certificados/pdf/`, "certificados-cipa.pdf"),

  /** Um certificado pelo número — reemissão com o mesmo número. */
  baixarCertificado: async (numero) =>
    baixarPdf(`certificados/${encodeURIComponent(numero)}/pdf/`, `certificado-${numero}.pdf`),

  /**
   * Lista de presença da turma em PDF (RF-HIS-004). Devolve blob e o nome do
   * arquivo que o backend sugeriu no Content-Disposition.
   */
  baixarListaPresenca: async (turmaId) => {
    const response = await api.get(`${API_URL}${turmaId}/lista-presenca/`, {
      responseType: "blob",
    });
    const disposicao = response.headers?.["content-disposition"] || "";
    const casado = /filename="?([^";]+)"?/.exec(disposicao);
    return { blob: response.data, nomeArquivo: casado ? casado[1] : "lista-presenca-cipa.pdf" };
  },

  /** Planilha modelo dos inscritos (xlsx gerado pelo backend). */
  baixarPlanilhaModelo: async () => {
    const response = await api.get(`${API_URL}planilha-modelo/`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Cria a turma com os inscritos da planilha em uma única transação: ou
   * nasce completa, ou não nasce.
   */
  importarTurma: async ({ local, data, instrutor, observacao, inscricoes }) => {
    const response = await api.post(`${API_URL}importar/`, {
      local,
      data,
      instrutor: instrutor || "",
      observacao,
      inscricoes,
    });
    return response.data;
  },
};

export default CursoCipaService;
