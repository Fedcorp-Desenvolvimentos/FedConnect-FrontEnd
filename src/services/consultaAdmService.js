import api from "./api";

export const getAdministradoraEspecificaPorCodigo = async (codigo) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`consultas/administradora/por-codigo/${codigo}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data
  } catch(error){
    console.error(`Erro de endpoint ao consultar administradora >>> ${error}`)
  }
};

export const getAdministradoraEspecificaPorNome = async (nome) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`consultas/administradora/por-nome/${nome}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data
  } catch(error){
    console.error(`Erro de endpoint ao consultar administradora >>> ${error}`)
  }
};

export const getAdministradoraPorPosto = async (codigo) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`consultas/administradora/posto/${codigo}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data
  } catch(error){
    console.error(`Erro de endpoint ao consultar administradora >>> ${error}`)
  }
};