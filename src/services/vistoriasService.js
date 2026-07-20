// src/services/vistoriasService.js

import api from "./api";

/**
 * Lista estados das vistorias
 */
export const listarEstados = async () => {
  try {
    const response = await api.get('/vistorias/estados/');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar estados:', error);
    throw error;
  }
};

/**
 * Lista vistoriadores ativos
 */
export const listarVistoriadores = async () => {
  try {
    const response = await api.get('/vistorias/vistoriadores/');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar vistoriadores:', error);
    throw error;
  }
};

/**
 * Lista administradoras (pessoas ativas)
 */
export const listarAdministradoras = async () => {
  try {
    const response = await api.get('/vistorias/administradoras/');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar administradoras:', error);
    throw error;
  }
};

/**
 * Consulta vistorias com filtros
 */
export const consultarVistorias = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null') {
        params.append(key, String(value));
      }
    });

    const url = `/vistorias/?${params.toString()}`;

    const response = await api.get(url);
    const result = response.data;

    if (result.sucesso === false) {
      throw new Error(result.erro || "Erro ao consultar vistorias");
    }

    return result;
  } catch (error) {
    console.error('Erro ao consultar vistorias:', error);

    let errorMessage = error.message || "Erro ao consultar vistorias";
    if (error.response?.data) {
      const data = error.response.data;
      if (data.erro) errorMessage = data.erro;
      else if (data.message) errorMessage = data.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Exporta vistorias para Excel
 */
export const exportarExcel = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null') {
        params.append(key, String(value));
      }
    });

    const url = `/vistorias/exportar/excel/?${params.toString()}`;

    const response = await api.get(url, {
      responseType: 'blob'
    });

    // Cria link para download
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/vnd.ms-excel'
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Obtém nome do arquivo do header ou usa padrão
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'vistorias.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { sucesso: true, filename };
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    throw error;
  }
};

/**
 * Exporta vistorias para HTML (para PDF)
 */
export const exportarHTML = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null') {
        params.append(key, String(value));
      }
    });

    const url = `/vistorias/exportar/pdf/?${params.toString()}`;

    const response = await api.get(url);

    // Cria link para download
    const blob = new Blob([response.data], {
      type: 'text/html'
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = 'relatorio-vistoria.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { sucesso: true, filename: 'relatorio-vistoria.html' };
  } catch (error) {
    console.error('Erro ao exportar HTML:', error);
    throw error;
  }
};
