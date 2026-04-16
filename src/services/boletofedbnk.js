import axios from 'axios';
import api from "./api"; 

// 1. Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'https://fedhub-api-local.ngrok.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, 
});

const CANCEL_PATH = '/fedbnk/cancelamento/';
const IMPRESS_PATH = '/webhook/boletofedbnk/impressao/';

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

// services/boletofedbnk.js
export const cancelarBoletoFedBNK = async (payload) => {
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    // Payload: sempre com metodo, fatura e documento (documento pode ser null)
    const requestPayload = {
      metodo: payload.metodo,      // "INDIVIDUAL" ou "TODOS"
      fatura: payload.fatura,      // número da fatura
      documento: payload.documento || null,
      motivo: payload.motivo,
      mail: payload.mail
    };
    
    const response = await axios.post(
      `http://localhost:8000/boletofedbnk/cancelar/`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar boleto:', error);
    throw error;
  }
};