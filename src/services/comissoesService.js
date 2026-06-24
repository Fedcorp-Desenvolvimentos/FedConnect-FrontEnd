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
 * Busca comissões por data de corte (Endpoint principal)
 * 
 * Este endpoint retorna faturas com comissões para emissão de recibos/vouchers.
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
    // Valida formato da data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dataCorte)) {
      throw new Error("Formato de data inválido. Use YYYY-MM-DD");
    }

    // Monta os parâmetros
    const params = new URLSearchParams();
    params.append('data_corte', dataCorte);
    
    // Adiciona os filtros (remove vazios)
    Object.keys(filtros).forEach(key => {
      const value = filtros[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'null') {
        // Converte com_voucher para string booleana
        if (key === 'com_voucher' && typeof value === 'boolean') {
          params.append(key, String(value));
        } else {
          params.append(key, String(value));
        }
      }
    });

    // 🔥 CORREÇÃO: Usa a rota correta do Django que faz proxy para o FastAPI
    // O Django tem: /comissoes/por-data/<data_corte>/
    // Que chama o FastAPI: /api/vouchers/buscar-faturas-comissoes
    const url = `/comissoes/por-data/${dataCorte}/?${params.toString()}`;
    
    console.log(`📡 Buscando comissões: ${url}`);
    
    const response = await api.get(url);
    
    // Verifica a estrutura da resposta
    const result = response.data;
    
    console.log('📦 Resposta completa:', result);

    // Normaliza a resposta para o formato esperado pelo frontend
    // O Django retorna: { sucesso: true, dados: { status: "success", data: [...], total_registros: ... } }
    // O frontend espera: { sucesso: true, dados: { data: [...], total_registros: ... } }
    
    if (result.sucesso === false) {
      throw new Error(result.erro || "Erro ao buscar comissões");
    }

    // Extrai os dados corretamente
    let dados = null;
    let totalRegistros = 0;
    
    if (result.dados) {
      // Caso 1: Resposta do Django com dados aninhados
      if (result.dados.status === "success") {
        dados = result.dados.data || [];
        totalRegistros = result.dados.total_registros || 0;
      } else {
        // Caso 2: Resposta direta do FastAPI
        dados = result.dados.data || [];
        totalRegistros = result.dados.total_registros || 0;
      }
    } else if (result.status === "success") {
      // Caso 3: Resposta direta do FastAPI
      dados = result.data || [];
      totalRegistros = result.total_registros || 0;
    }

    // Garante que dados seja um array
    if (!Array.isArray(dados)) {
      dados = [];
    }

    console.log(`✅ ${dados.length} comissões carregadas (Total: ${totalRegistros})`);

    // Retorna no formato esperado pelo frontend
    return {
      sucesso: true,
      dados: {
        data: dados,
        total_registros: totalRegistros,
        has_more: result.dados?.has_more || result.has_more || false,
        status: "success"
      }
    };

  } catch (error) {
    console.error('❌ Erro ao buscar comissões:', error);
    
    // Extrai a mensagem de erro da resposta
    let errorMessage = error.message || "Erro ao buscar comissões";
    if (error.response?.data) {
      const data = error.response.data;
      if (data.erro) {
        errorMessage = data.erro;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.detail) {
        errorMessage = data.detail;
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Busca faturas (para a lista de faturas)
 * 
 * @param {Object} filtros - Filtros para busca de faturas
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

    const response = await api.get(`/consultas/faturas/?${params.toString()}`);
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