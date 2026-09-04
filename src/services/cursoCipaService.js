// src/services/cursoCipaService.js
// Contrato definido em FedConnect-Back-End/specs/curso-cipa/design.md
// ("Modelo de Dados e Contratos"). A rota não é paginada: devolve lista.
import api from "./api";

const API_URL = "cursos-cipa/";

export const CursoCipaService = {
  /** Locais e capacidades (auditório 30, sala de reunião 10). */
  listarLocais: async () => {
    const response = await api.get(`${API_URL}locais/`);
    return response.data;
  },

  /** Turmas de um local no mês. `mes` é 1–12. */
  listarTurmas: async ({ mes, ano, local }) => {
    const response = await api.get(API_URL, { params: { mes, ano, local } });
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.results ?? [];
  },

  /** Instrutores que assinam o certificado — lista fixa no backend. */
  listarInstrutores: async () => {
    const response = await api.get(`${API_URL}instrutores/`);
    return response.data;
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
