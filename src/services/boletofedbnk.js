import axios from 'axios';
import api from "./api"; 

// 1. Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'https://nfsefedcorp-reese.ngrok-free.dev',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, 
});

const CANCEL_PATH = '/cancelar-boletofedbnk/';
const IMPRESS_PATH = '/webhook/boletofedbnk/impressao/';

/**
 * Envia dados para o Webhook.
 * @param {Object} payload - O objeto JSON a ser enviado no corpo da requisição.
 */
export const triggerWebhook = async (payload) => {
  try {
    const response = await api.post(CANCEL_PATH, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error);
    throw error; 
  }
};

/**
 * Envia dados para o Webhook.
 * @param {Object} payload - O objeto JSON a ser enviado no corpo da requisição.
 */
export const impressWebhook = async (payload) => {
  try {
    const response = await apiClient.post(IMPRESS_PATH, payload, {
      responseType: 'blob',
      timeout: 60000
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error);
    throw error; 
  }
};