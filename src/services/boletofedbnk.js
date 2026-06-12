import axios from "axios";
import api from "./api";

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

    const response = await api.post(
      `boletofedbnk/cancelar/`,
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

const CANCEL_PATH = 'https://fedhub-api-local.ngrok.app/api/fedbnk/cancelamento/';
const IMPRESS_PATH = 'https://fedhub-api-local.ngrok.app/api/webhook/boletofedbnk/impressao/';

/**
 * Envia dados para o Webhook.
 * @param {Object} payload - O objeto JSON a ser enviado no corpo da requisição.
 */
export const triggerWebhook = async (payload) => {
  try {
    const response = await axios.post(CANCEL_PATH, payload);
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
    const response = await axios.post(IMPRESS_PATH, payload, {
      responseType: 'blob',
      timeout: 60000
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao chamar o webhook:', error);
    throw error;
  }
};

/**
 * Consulta dados para segunda via de boleto por número de fatura.
 * GET /api/faturamento/dados-segunda-via/{fatura}/
 * @param {string} fatura - Número da fatura
 */
export const consultarSegundaVia = async (fatura) => {
  try {
    const response = await api.get(`faturamento/dados-segunda-via-boleto/${fatura}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar segunda via:', error);
    throw error;
  }
};

/**
 * Emite segunda via de boletos para uma fatura.
 * POST /api/faturamento/emissao-segunda-via-boleto/{fatura}/
 * @param {string} fatura - Número da fatura
 * @param {Array} boletos - Array com os objetos completos dos boletos a emitir
 */
export const emitirSegundaVia = async (fatura, boletos) => {
  try {
    const response = await api.post(
      `faturamento/emissao-segunda-via-boleto/${fatura}/`,
      boletos,
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao emitir segunda via:', error);
    throw error;
  }
};