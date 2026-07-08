// src/services/pessoaService.js

import api from "./api";

export const criarPessoa = async (payload) => {
  try {
    let response;

    try {
      response = await api.post('pessoas/criar/', payload);
    } catch (primaryError) {
      // Compatibilidade com backends legados que ainda usam /pessoas/criar/
      if (primaryError.response?.status === 404) {
        response = await api.post('pessoas/criar/', payload);
      } else {
        throw primaryError;
      }
    }
    
    // Log para debug
    // console.log("📦 Payload enviado:", payload);
    // console.log("✅ Resposta da API:", response.data);
    
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
      throw new Error("Método não permitido na rota de criação. Verifique se o backend aceita POST em /pessoas/.");
    }
    
    throw error;
  }
};