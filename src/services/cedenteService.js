// src/services/cedenteService.js

import api from "./api";

export const buscarCedentes = async (params = {}) => {
  try {
    const response = await api.get('cedentes/', { params });
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar cedentes:", error);
    return { sucesso: false, data: [], erro: error.message };
  }
};

export const buscarCedentePorNome = async (nome) => {
  try {
    const response = await api.get('cedentes/buscar/', { 
      params: { nome: nome } 
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar cedente por nome:", error);
    return { sucesso: false, data: [], erro: error.message };
  }
};