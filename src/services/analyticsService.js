// src/services/analyticsService.js

import axios from "axios";

// const BASE_URL = "http://localhost:8090/api/analytics";
const BASE_URL = "https://fedhub-api-local.ngrok.app/api/analytics";

/**
 * Serviço de Analytics - Métricas e análises de negócio
 */
const analyticsService = {
  /**
   * 1. Faturamento por período (agregado por mês)
   * @param {Object} params - { data_ini, data_fim }
   * @returns {Promise}
   */
  getFaturamentoPeriodo: async (params) => {
    try {
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };
      
      const response = await axios.get(`${BASE_URL}/faturamento`, {
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
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };

      const response = await axios.get(`${BASE_URL}/administradoras/top`, {
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
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };

      const response = await axios.get(`${BASE_URL}/inadimplencia`, { headers });
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
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };

      const response = await axios.get(`${BASE_URL}/administradoras/faturamento`, {
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
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };

      const response = await axios.get(`${BASE_URL}/faturas/status`, { headers });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar status das faturas:", error);
      throw error;
    }
  },

  /**
   * 6. Dashboard completo (junção de várias métricas)
   * @param {Object} params - { data_ini, data_fim }
   * @returns {Promise}
   */
  getDashboardCompleto: async (params) => {
    try {
      const token = localStorage.getItem("accessToken", "");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const headers = {
        "Authorization": `Bearer ${token}`,
        "X-Application": "LVF5OXMUBTUT2C3SYI2IODW3P3AHFMMI"
      };


      // Busca todas as métricas em paralelo
      const [faturamento, topAdms, inadimplencia, faturamentoPorAdm, statusFaturas] = await Promise.all([
        analyticsService.getFaturamentoPeriodo(params),
        analyticsService.getTopAdministradoras(10),
        analyticsService.getInadimplencia(),
        analyticsService.getFaturamentoPorAdministradora(params),
        analyticsService.getStatusFaturas()
      ]);

      return {
        periodo: {
          data_ini: params.data_ini,
          data_fim: params.data_fim
        },
        faturamento: faturamento,
        ranking_administradoras: topAdms,
        inadimplencia: inadimplencia,
        faturamento_por_administradora: faturamentoPorAdm,
        status_faturas: statusFaturas,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Erro ao buscar dashboard completo:", error);
      throw error;
    }
  }
};

export default analyticsService;