// src/services/questionarios.js
import api from './api';

export const enviarQuestionario = async (data) => {
  const response = await api.post('/questionarios/', data);
  return response.data;
};

export const listarQuestionarios = async () => {
  const response = await api.get('/questionarios/');
  return response.data;
};

export const buscarQuestionario = async (id) => {
  const response = await api.get(`/questionarios/${id}/`);
  return response.data;
};

export const atualizarQuestionario = async (id, data) => {
  const response = await api.put(`/questionarios/${id}/`, data);
  return response.data;
};

export const excluirQuestionario = async (id) => {
  const response = await api.delete(`/questionarios/${id}/`);
  return response.data;
};