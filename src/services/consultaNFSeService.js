import api from "./api";

export const getNFSePorBoleto = async (documento) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`consultas/nfse/${documento}/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data
  } catch(error){
    console.error(`Erro de endpoint ao consultar NFSe >>> ${error}`)
  }
};