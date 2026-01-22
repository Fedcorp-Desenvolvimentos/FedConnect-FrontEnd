import api from "./api";

export const getFaturaPorNumero = async (numero_fatura) => {
  try {
    const token = localStorage.getItem("accessToken", "")
    const response = await api.get(`consultas/faturas/${numero_fatura}/`, {
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
      "consultas/faturas/fatura-dinamica/",
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

