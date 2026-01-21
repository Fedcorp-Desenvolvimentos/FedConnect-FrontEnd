import axios from "axios";

export const getFaturaPorNumero = async (numeroFatura) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await axios.get(`http://localhost:8000/consultas/fatura/${numeroFatura}/`, {
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

    const response = await axios.get(
      "http://localhost:8000/consultas/fatura/fatura-dinamica/",
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

