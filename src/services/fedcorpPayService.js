// src/services/fedcorpPayService.js

import axios from "axios";

// *************
// PRINCIPAL
// *************

export const listarEmpresas = async (companyId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8888/api/santander/empresas`, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// *************
// WORKSPACES
// *************

export const listarWorkspaces = async (companyId) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/api/santander/workspaces/listar`, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obterWorkspace = async (id, companyId) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/api/santander/workspaces/obter/${id}`, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const obterWorkspaceConfigurado = async (companyId) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/api/santander/workspaces/configurado`, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    // Se não encontrar, retorna null
    if (error.response?.status === 404) {
      return { success: true, data: null };
    }
    throw error.response?.data || error;
  }
};

export const criarWorkspace = async (companyId, data) => {
  try {
    const response = await axios.post(`https://fedcorp-pay.com.br/api/santander/workspaces/criar`, data, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const atualizarWorkspace = async (id, companyId, data) => {
  try {
    const response = await axios.patch(`https://fedcorp-pay.com.br/api/santander/workspaces/atualizar/${id}`, data, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deletarWorkspace = async (id, companyId) => {
  try {
    const response = await axios.delete(`https://fedcorp-pay.com.br/api/santander/workspaces/deletar/${id}`, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// *************
// BOLETOS
// *************

// Listar boletos com filtros
export const listarBoletos = async (companyId, params = {}) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/santander/boletos/listar-boletos`, {
      params: { 
        company_id: companyId,
        ...params 
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Consulta Sonda - dados completos do boleto
export const consultarSonda = async (companyId, bankNumber) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/santander/boletos/consulta-sonda`, {
      params: { 
        company_id: companyId,
        bankNumber: bankNumber
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Buscar boleto por bill ID
export const buscarBoletoPorBillId = async (companyId, bankNumber) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/santander/boletos/buscar-especifico-bill-id`, {
      params: { 
        company_id: companyId,
        bankNumber: bankNumber
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Buscar boleto por bankSlip
export const buscarBoletoPorBankSlip = async (companyId, params) => {
  try {
    const response = await axios.get(`https://fedcorp-pay.com.br/santander/boletos/buscar-especifico-bankslip`, {
      params: { 
        company_id: companyId,
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Criar boleto
export const criarBoleto = async (companyId, data) => {
  try {
    const response = await axios.post(`https://fedcorp-pay.com.br/santander/boletos/criar`, data, {
      params: { company_id: companyId },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Baixar/Cancelar boleto
export const baixarBoleto = async (companyId, bankNumber) => {
  try {
    const response = await axios.patch(`https://fedcorp-pay.com.br/santander/boletos/baixar`, null, {
      params: { 
        company_id: companyId,
        bankNumber: bankNumber
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Key': 'XtBmS7-E6uWHclGnQ7MdLjV_9jD_kbJSmAAlozaoGMI'
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};