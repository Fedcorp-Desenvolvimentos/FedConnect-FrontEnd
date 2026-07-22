// src/services/produtosService.js
import api from './api';

export const buscarTodosProdutos = async () => {
  try {
    const response = await api.get('produtos/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const buscarProdutosDinamicamente = async (params) => {
    try {
        const response = await api.get('produtos/busca-dinamica', { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos dinamicamente:', error);
        throw error;
    }
};
