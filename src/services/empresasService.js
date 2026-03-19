// src/services/empresasService.js

import api from "./api"

export const getEmpresas = async () => {
    try {
        const token = localStorage.getItem("accessToken", "")
        const response = await api.get("empresas/", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao buscar empresas:", error);
    }   
}

export const getEmpresasPorCNPJ = async (cnpj) => {
    try {
        const token = localStorage.getItem("accessToken", "")
        const response = await api.get(`empresas/${cnpj}`,  {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao buscar empresas:", error);
    }   
}
