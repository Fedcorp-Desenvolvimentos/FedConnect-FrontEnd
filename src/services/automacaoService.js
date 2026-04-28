// services/automacaoService.js

import api from "./api";

export const AutomacaoService = {
  // Apenas upload (salva na pasta de origem)
  upload_pdfs_bbz: async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await api.post(`automacao/upload-pdfs-bbz/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    
    return response.data;
  },
  
  // Apenas processar (move para pastas corretas)
  processar_pdfs_bbz: async (fazerBackup = true) => {
    try {
      const response = await api.post(`automacao/processar-pdfs-bbz/`, {
        fazer_backup: fazerBackup
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao processar PDFs do BBZ:", error);
      throw error;
    }
  },

  separar_pdf: async (file, nomeBase = '') => {
      const formData = new FormData();
      formData.append('file', file);
      if (nomeBase) {
          formData.append('nome_base', nomeBase);
      }
      
      const response = await api.post(`automacao/separar-pdf/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
          responseType: 'blob'
      });
      
      return response.data;
  },
};