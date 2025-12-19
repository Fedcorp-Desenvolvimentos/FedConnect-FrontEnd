import axios from 'axios';

// 1. Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'https://d072d7ebc3f9.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    // 2. IMPORTANTE: Esse header evita a tela de aviso do Ngrok na versão free
    'ngrok-skip-browser-warning': 'true' 
  },
  timeout: 10000, // 10 segundos de timeout
});

const CANCEL_PATH = '/webhook/edc4b608-35fd-483a-a9e8-4bfea34b6247';
const IMPRESS_PATH = '/webhook/5bb0be23-844b-47f9-9d89-ca94ce02e428';

/**
 * Envia dados para o Webhook.
 * @param {Object} payload - O objeto JSON a ser enviado no corpo da requisição.
 */
export const triggerWebhook = async (payload) => {
  try {
    const response = await apiClient.post(CANCEL_PATH, payload);
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