// src/services/corretoresService.js

import api from "./api"

export const getCorretores = async (codigo) => {
    try {
        const token = localStorage.getItem("accessToken", "")
        const response = await api.get(`consultas/corretores/${codigo}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao buscar corretores:", error);
    }   
}