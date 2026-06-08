// src/services/chatService.js

import axios from "axios";

const API_BASE_URL = "http://localhost:8080";
// const API_BASE_URL = "https://enjoyably-cranial-twistable.ngrok-free.dev";

export const getHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/chat/health`);
    return response.data;
  } catch(error) {
    console.error(`Erro ao obter status de saúde >>> ${error}`);
    return { status: "error", message: error.message };
  }
};

export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/chat/`, {
      text: message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch(error) {
    console.error(`Erro ao enviar mensagem >>> ${error}`);
    if (error.response) {
      // O servidor respondeu com um status de erro
      return {
        success: false,
        text: `Erro ${error.response.status}: ${error.response.data?.detail || error.message}`,
        metadata: { error: true }
      };
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      return {
        success: false,
        text: "Erro de conexão com o servidor. Verifique se o backend está rodando.",
        metadata: { error: true }
      };
    } else {
      // Algo aconteceu na configuração
      return {
        success: false,
        text: `Erro: ${error.message}`,
        metadata: { error: true }
      };
    }
  }
};

export const testFedhubQuery = async (fatura = null, apolice = null) => {
  try {
    const params = {};
    if (fatura) params.fatura = fatura;
    if (apolice) params.apolice = apolice;
    
    const response = await axios.get(`${API_BASE_URL}/v1/chat/teste`, {
      params: params
    });
    return response.data;
  } catch(error) {
    console.error(`Erro no teste do Fedhub >>> ${error}`);
    return {
      success: false,
      error: error.message
    };
  }
};
