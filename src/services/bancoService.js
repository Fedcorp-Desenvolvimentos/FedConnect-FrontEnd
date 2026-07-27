// src/services/bancoService.js

import api from './api';

export const buscarBancos = async (params = {}) => {
  try {
    const { limit = 100, offset = 0, search = '' } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit);
    queryParams.append('offset', offset);
    if (search) queryParams.append('search', search);
    
    const response = await api.get(`bancos/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar bancos:', error);
    throw error;
  }
};

export const buscarBancoPorCodigo = async (codigo) => {
  try {
    const response = await api.get(`bancos/${codigo}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar banco ${codigo}:`, error);
    throw error;
  }
};

export const buscarBancoPorNome = async (nome) => {
  try {
    const response = await api.get(`bancos/nome/${nome}/`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar banco por nome ${nome}:`, error);
    throw error;
  }
};