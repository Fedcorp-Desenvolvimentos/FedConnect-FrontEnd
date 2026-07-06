// src/services/arquivosService.js
import api from "./api";

// Função para fazer o download do CSV
export const downloadBoletosCSV = async (numeroFatura) => {
  try {
    const token = localStorage.getItem("accessToken");
    
    const response = await api.get(`faturamento/formato-arquivos/converter-boleto-csv/`, {
      params: { fatura: numeroFatura },
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // console.log("Resposta do servidor:", response);
    // console.log("Headers:", response.headers);
    // console.log("Tipo do dado:", typeof response.data);
    // console.log("É Blob?", response.data instanceof Blob);
    
    // Verifica se a resposta é um blob (arquivo)
    if (response.data instanceof Blob) {
      // Verifica se é um erro (quando o blob é um JSON de erro)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.erro || "Erro ao gerar arquivo");
      }
      
      // Pega o nome do arquivo do header Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let filename = `boletos_fatura_${numeroFatura}.csv`;
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      
      // Cria blob e faz download
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    }
    
    // Se não for blob, tenta parsear como JSON (erro)
    const text = await response.data.text();
    const errorData = JSON.parse(text);
    throw new Error(errorData.erro || "Erro ao gerar arquivo");
    
  } catch(error) {
    console.error('Erro ao baixar CSV:', error);
    throw error;
  }
};