// src/services/analyticsService.js
import api from "./api";

/**
 * Serviço de Analytics - Métricas e análises de negócio
 * Agora passando pelo Django (middleware de segurança, rate limiting, etc)
 */
const analyticsService = {
  /**
   * 1. Faturamento por período (agregado por mês)
   * @param {Object} params - { data_ini, data_fim }
   * @returns {Promise}
   */
  getFaturamentoPeriodo: async (params) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
        // O Django vai gerenciar a comunicação com o FastAPI internamente
        // Não precisa mais enviar X-Application (isso fica no backend)
      };
      
      const response = await api.get(`/analytics/faturamento/`, {  // Note a barra no final
        headers,
        params: {
          data_ini: params.data_ini,
          data_fim: params.data_fim
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar faturamento por período:", error);
      throw error;
    }
  },

  /**
   * 2. Top administradoras que mais faturam
   * @param {number} limit - Quantidade de registros (padrão 10)
   * @returns {Promise}
   */
  getTopAdministradoras: async (limit = 10) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await api.get(`/analytics/administradoras/top/`, {
        headers,
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar top administradoras:", error);
      throw error;
    }
  },

  /**
   * 3. Métricas de inadimplência
   * @returns {Promise}
   */
  getInadimplencia: async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await api.get(`/analytics/inadimplencia/`, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar inadimplência:", error);
      throw error;
    }
  },

  /**
   * 4. Faturamento detalhado por administradora no período
   * @param {Object} params - { data_ini, data_fim }
   * @returns {Promise}
   */
  getFaturamentoPorAdministradora: async (params) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await api.get(`/analytics/administradoras/faturamento/`, {
        headers,
        params: {
          data_ini: params.data_ini,
          data_fim: params.data_fim
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar faturamento por administradora:", error);
      throw error;
    }
  },

  /**
   * 5. Distribuição de faturas por status
   * @returns {Promise}
   */
  getStatusFaturas: async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await api.get(`/analytics/faturas/status/`, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar status das faturas:", error);
      throw error;
    }
  },

  /**
   * 6. Dashboard completo (junção de várias métricas)
   * Agora o Django chama o FastAPI que já busca em paralelo
   * @param {Object} params - { data_ini, data_fim }
   * @returns {Promise}
   */
  getDashboardCompleto: async (params) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // AGORA: O Django chama o endpoint /dashboard do FastAPI
      // O FastAPI ainda faz o Promise.all internamente
      const response = await api.get(`/analytics/dashboard/`, {
        headers,
        params: {
          data_ini: params.data_ini,
          data_fim: params.data_fim
        }
      });
      
      // O retorno já vem completo do Django (que pegou do FastAPI)
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dashboard completo:", error);
      throw error;
    }
  }
};

export default analyticsService;