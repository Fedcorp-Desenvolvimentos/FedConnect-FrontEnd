import axios from 'axios';

// 1. Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'https://fedhub-api-local.ngrok.app',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, 
});

const CANCEL_PATH = '/api/fedbnk/cancelamento';


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