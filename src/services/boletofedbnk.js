import axios from 'axios';

// 1. Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'https://92ee277c34c6.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    // 2. IMPORTANTE: Esse header evita a tela de aviso do Ngrok na versão free
    'ngrok-skip-browser-warning': 'true' 
  },
  timeout: 10000, // 10 segundos de timeout
});

const WEBHOOK_PATH = '/webhook/edc4b608-35fd-483a-a9e8-4bfea34b6247';

/**
 * Envia dados para o Webhook.
 * @param {Object} payload - O objeto JSON a ser enviado no corpo da requisição.
 */
export const triggerWebhook = async (payload) => {
  try {
    const response = await apiClient.post(WEBHOOK_PATH, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error);
    throw error; 
  }
};