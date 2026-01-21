import axios from "axios";
import api from "./api";

export const getFaturaPorNumero = async (numeroFatura) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`/consultas/fatura/${numeroFatura}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data
  } catch(error){
    console.error(`Erro de endpoint ao consultar fatura(as) >>> ${error}`)
  }
};

export const getFaturaDinamicamente = async (filtros = {}) => {
  try {
    const token = localStorage.getItem("accessToken", "");

    const response = await api.get(
      "/consultas/fatura/fatura-dinamica/",
      {
        params: filtros,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erro de endpoint ao consultar faturas dinamicamente",
      error
    );
    throw error;
  }
};

