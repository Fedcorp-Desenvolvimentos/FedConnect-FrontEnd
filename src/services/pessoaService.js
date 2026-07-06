// src/services/pessoaService.js

import api from "./api";

export const criarPessoa = async (payload) => {
  try {
    const response = await api.post(`pessoas/criar/`, payload);
    
    // Log para debug
    console.log("📦 Payload enviado:", payload);
    console.log("✅ Resposta da API:", response.data);
    
    // Verifica se a resposta tem a estrutura esperada
    if (response.data && response.data.sucesso) {
      return response.data;
    } else {
      throw new Error(response.data?.erro || "Erro ao criar pessoa");
    }
  } catch (error) {
    console.error("❌ Erro ao criar pessoa:", error);
    
    // Tratamento específico para erro 405
    if (error.response?.status === 405) {
      throw new Error("Método não permitido. Verifique a configuração do backend.");
    }
    
    throw error;
  }
};