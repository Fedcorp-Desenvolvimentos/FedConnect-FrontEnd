// src/services/pessoaService.js

import api from './api';

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
    console.error('❌ Erro ao buscar pessoas:', error);
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
    const response = await api.post('pessoas/criar/', payload); // Verifique a rota
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar pessoa:', error);
    
    // 🔥 TRATAMENTO MELHORADO PARA A ESTRUTURA DO SEU ERRO
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.log('📦 Dados do erro:', errorData);
      
      // Cria um objeto de erro enriquecido
      const enhancedError = new Error();
      enhancedError.status = status;
      enhancedError.data = errorData;
      
      // 🔥 CAPTURA A MENSAGEM DE ERRO ESPECÍFICA
      if (errorData && typeof errorData === 'object') {
        // Para o formato: {'mensagem': 'Já existe uma pessoa com este CPF/CNPJ: 0000006909', 'pessoa_existente': '0000006909'}
        if (errorData.mensagem) {
          enhancedError.message = errorData.mensagem;
        } else if (errorData.detail) {
          enhancedError.message = errorData.detail;
        } else if (errorData.erro) {
          enhancedError.message = errorData.erro;
        } else if (errorData.message) {
          enhancedError.message = errorData.message;
        } else {
          enhancedError.message = 'Erro ao criar pessoa';
        }
        
        // Captura campos extras do erro
        if (errorData.pessoa_existente) {
          enhancedError.existingData = errorData.pessoa_existente;
        }
        
        // Captura erros de validação por campo se existirem
        if (errorData.errors || errorData.fields) {
          enhancedError.fieldErrors = errorData.errors || errorData.fields;
        }
      }
      
      throw enhancedError;
    }
    
    throw error;
  }
};

export const atualizarPessoa = async (codigo, payload) => {
  try {
    const response = await api.put(`pessoas/${codigo}/`, payload);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar pessoa:', error);
    
    if (error.response) {
      const errorData = error.response.data;
      const enhancedError = new Error();
      enhancedError.status = error.response.status;
      enhancedError.data = errorData;
      
      if (errorData && typeof errorData === 'object') {
        if (errorData.mensagem) {
          enhancedError.message = errorData.mensagem;
        } else if (errorData.detail) {
          enhancedError.message = errorData.detail;
        } else if (errorData.erro) {
          enhancedError.message = errorData.erro;
        } else {
          enhancedError.message = 'Erro ao atualizar pessoa';
        }
        
        if (errorData.errors || errorData.fields) {
          enhancedError.fieldErrors = errorData.errors || errorData.fields;
        }
      }
      
      throw enhancedError;
    }
    
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

export const buscarGerentesComerciais = async () => {
  try {
    const response = await api.get('pessoas/gerentes-comerciais/');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar gerentes comerciais:', error);
    throw error;
  }
};