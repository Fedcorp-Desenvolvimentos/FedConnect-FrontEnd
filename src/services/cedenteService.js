// src/services/pessoaService.js

import api from './api'; // Seu cliente HTTP com autenticação

export const pessoaService = {
  /**
   * Busca todos os cedentes
   */
  buscarCedentes: async () => {
    try {
      const response = await api.get('/cedentes/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cedentes:', error);
      throw error;
    }
  },

  /**
   * Busca cedente por nome (autocomplete)
   */
  buscarCedentePorNome: async (nome) => {
    try {
      const response = await api.get('/cedentes/buscar/', {
        params: { nome }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cedente por nome:', error);
      throw error;
    }
  },

  /**
   * Busca pessoa por código
   */
  buscarPessoaPorCodigo: async (codigo) => {
    try {
      const response = await api.get(`/pessoas/${codigo}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error);
      throw error;
    }
  },
};