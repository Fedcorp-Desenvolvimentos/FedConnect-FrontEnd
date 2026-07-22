// src/services/pessoaService.js
// src/services/pessoaService.js

import api from "./api";

/**
 * Busca pessoas com paginação
 * @param {Object} params - Parâmetros de paginação
 * @param {number} params.limit - Quantidade de registros por página (default: 50)
 * @param {number} params.offset - Offset para paginação (default: 0)
 * @param {string} params.search - Termo de busca (opcional)
 */
export const buscarPessoas = async (params = {}) => {
  try {
    const { limit = 50, offset = 0, search = '' } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit);
    queryParams.append('offset', offset);
    if (search) queryParams.append('search', search);
    
    const response = await api.get(`pessoas/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar pessoas:", error);
    throw error;
  }
};

export const buscarPessoaPorCodigo = async (codigo) => {
  try {
    const response = await api.get(`pessoas/${codigo}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar pessoa ${codigo}:`, error);
    throw error;
  }
};

export const criarPessoa = async (payload) => {
  try {
    const response = await api.post('pessoas/criar/', payload);
    
    if (response.data && response.data.sucesso) {
      return response.data;
    } else {
      throw new Error(response.data?.erro || "Erro ao criar pessoa");
    }
  } catch (error) {
    console.error("❌ Erro ao criar pessoa:", error);
    
    if (error.response?.status === 405) {
      throw new Error("Método não permitido na rota de criação.");
    }
    
    throw error;
  }
};

export const atualizarPessoa = async (codigo, payload) => {
  try {
    const response = await api.put(`pessoas/${codigo}/`, payload);
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao atualizar pessoa:", error);
    throw error;
  }
};

export const excluirPessoa = async (codigo) => {
  try {
    const response = await api.delete(`pessoas/${codigo}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao excluir pessoa ${codigo}:`, error);
    throw error;
  }
};

export const buscarProdutos = async () => {
  try {
    const response = await api.get('produtos/');
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    throw error;
  }
};

export const buscarGerentesComerciais = async () => {
  try {
    const response = await api.get('pessoas/gerentes-comerciais/');
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar gerentes comerciais:", error);
    throw error;
  }
};

