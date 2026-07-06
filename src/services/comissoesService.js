// src/services/comissoesService.js

import api from "./api";

/**
 * Busca pessoas (favorecidos) para filtros
 */
export const buscarPessoas = async (params = {}) => {
  try {
    const response = await api.get('/pessoas/', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    throw error;
  }
};

/**
 * Busca pessoa por código
 */
export const buscarPessoaPorCodigo = async (codigo) => {
  try {
    const response = await api.get(`/pessoas/${codigo}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoa por código:', error);
    throw error;
  }
};

/**
 * ROTA: /comissoes/por-data-v2/{data_corte}/
 * NUNCA usa /comissoes/faturas/
 */
export const buscarComissoesPorDataCorte = async (dataCorte, filtros = {}) => {
  try {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dataCorte)) {
      throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }

    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null') {
        if (key === 'com_voucher' && typeof value === 'boolean') {
          params.append(key, String(value));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const url = `/comissoes/por-data-v2/${dataCorte}/?${params.toString()}`;
    
    // console.log(`📡 Buscando comissões V2: ${url}`);
    
    const response = await api.get(url);
    const result = response.data;
    
    // console.log('📦 Resposta V2:', result);

    if (result.sucesso === false) {
      throw new Error(result.erro || "Erro ao buscar comissões");
    }

    const dados = result.dados || result;
    
    let lista = [];
    if (dados.data && Array.isArray(dados.data)) {
      lista = dados.data;
    } else if (dados.dados && dados.dados.data && Array.isArray(dados.dados.data)) {
      lista = dados.dados.data;
    } else if (Array.isArray(dados)) {
      lista = dados;
    }
    
    const total = dados.total_registros || dados.total_retornados || lista.length;
    const hasMore = dados.has_more || false;

    // console.log(`✅ ${lista.length} comissões carregadas (Total: ${total})`);

    return {
      sucesso: true,
      dados: {
        data: lista,
        total_registros: total,
        has_more: hasMore,
        status: dados.status || "success",
        versao: result.versao || "v2",
        filtros_aplicados: result.filtros_aplicados || dados.filtros_aplicados || {}
      }
    };

  } catch (error) {
    console.error('❌ Erro ao buscar comissões V2:', error);
    
    let errorMessage = error.message || "Erro ao buscar comissões";
    if (error.response?.data) {
      const data = error.response.data;
      if (data.erro) errorMessage = data.erro;
      else if (data.message) errorMessage = data.message;
      else if (data.detail) errorMessage = data.detail;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * ROTA: /consultas/faturamento/
 * NUNCA usa /comissoes/faturas/
 */
export const buscarFaturamento = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `/consultas/faturamento/?${params.toString()}`;
    // console.log(`📡 Buscando faturamento: ${url}`);
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar faturamento:', error);
    throw error;
  }
};


/**
 * Emite recibo (agrupado por favorecido)
 * @param {Object} payload - Dados para emissão
 * @returns {Promise}
 */
export const emitirRecibo = async (payload) => {
  try {
    const response = await api.post('/comissoes/emitir-recibo/', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao emitir recibo:', error);
    throw error;
  }
};

export const emitirVoucher = async (payload) => {
  try {
    const response = await api.post('/comissoes/emitir-voucher/', payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao emitir voucher:', error);
    throw error;
  }
};
