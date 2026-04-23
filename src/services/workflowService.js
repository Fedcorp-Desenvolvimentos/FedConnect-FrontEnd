import api from "./api";

export const workflowService = {
  // Estatísticas do dashboard
  getStats: async () => {
    const response = await api.get("/workflow/stats/");
    return response.data;
  },

  // Minhas tarefas (atribuídas a mim)
  getMinhasTarefas: async (params = {}) => {
    const response = await api.get("/workflow/minhas-tarefas/", { params });
    return response.data;
  },

  // Tarefas recentes (admin)
  getTarefasRecentes: async (params = {}) => {
    const response = await api.get("/workflow/tarefas-recentes/", { params });
    return response.data;
  },

  // Lista de tarefas com filtros
  getTarefas: async (params = {}) => {
    const response = await api.get("/workflow/tarefas/", { params });
    return response.data;
  },

  // Detalhe de uma tarefa
  getTarefa: async (id) => {
    const response = await api.get(`/workflow/tarefas/${id}/`);
    return response.data;
  },

  // Criar nova tarefa
  criarTarefa: async (data) => {
    const response = await api.post("/workflow/tarefas/", data);
    return response.data;
  },

  // Atualizar status da tarefa
  atualizarStatus: async (id, status) => {
    const response = await api.patch(`/workflow/tarefas/${id}/`, { status });
    return response.data;
  },

  // Adicionar comentário
  adicionarComentario: async (id, comentario) => {
    const response = await api.post(`/workflow/tarefas/${id}/comentarios/`, { comentario });
    return response.data;
  },

  // Setores disponíveis (para filtro)
  getSetores: async () => {
    const response = await api.get("/workflow/setores/");
    return response.data;
  }
};