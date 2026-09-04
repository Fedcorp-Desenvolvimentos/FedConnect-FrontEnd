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
};

export default CursoCipaService;
