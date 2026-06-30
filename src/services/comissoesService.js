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
 * 🔥 BUSCA COMISSÕES - V2 (100% consistente)
 * 
 * @param {string} dataCorte - Data de corte no formato YYYY-MM-DD (OBRIGATÓRIO)
 * @param {Object} filtros - Filtros opcionais
 * @param {string} filtros.favorecido - Código do favorecido
 * @param {string} filtros.fatura - Número da fatura
 * @param {string} filtros.vencimento_inicial - Data inicial do vencimento
 * @param {string} filtros.vencimento_final - Data final do vencimento
 * @param {string} filtros.status - Status: todas, baixadas, pendentes
 * @param {string} filtros.tipo - Tipo de comissão (A, B, etc)
 * @param {string} filtros.co_estipulante - Co-estipulante
 * @param {string} filtros.apolice - Número da apólice
 * @param {string} filtros.recibo - Número do recibo/voucher
 * @param {boolean} filtros.com_voucher - true, false ou null (todos)
 * @param {number} filtros.limit - Limite de registros (default: 100)
 * @param {number} filtros.offset - Offset para paginação (default: 0)
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

    // 🔥 ROTA V2 - ÚNICA QUE DEVE SER USADA PARA COMISSÕES
    const url = `/comissoes/por-data-v2/${dataCorte}/?${params.toString()}`;
    
    console.log(`📡 Buscando comissões V2: ${url}`);
    
    const response = await api.get(url);
    const result = response.data;
    
    console.log('📦 Resposta V2:', result);

    if (result.sucesso === false) {
      throw new Error(result.erro || "Erro ao buscar comissões");
    }

    const dados = result.dados || result;
    const lista = dados.data || [];
    const total = dados.total_registros || dados.total_retornados || lista.length;
    const hasMore = dados.has_more || false;

    console.log(`✅ ${lista.length} comissões carregadas (Total: ${total})`);

    return {
      sucesso: true,
      dados: {
        data: lista,
        total_registros: total,
        has_more: hasMore,
        status: dados.status || "success",
        versao: result.versao || "v2"
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
 * 🔥 BUSCA FATURAS - Usa o endpoint de faturamento (NUNCA usa /comissoes/faturas/)
 */
export const buscarFaturas = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    // 🔥 USA FATURAMENTO - FUNCIONA
    const response = await api.get(`/consultas/faturamento/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar faturas:', error);
    throw error;
  }
};

/**
 * Busca fatura por número (detalhada)
 */
export const buscarFaturaPorNumero = async (numeroFatura) => {
  try {
    const response = await api.get(`/consultas/faturas/${numeroFatura}/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fatura:', error);
    throw error;
  }
};

/**
 * Busca faturamento (detalhado com boletos)
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

    const response = await api.get(`/consultas/faturamento/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar faturamento:', error);
    throw error;
  }
};