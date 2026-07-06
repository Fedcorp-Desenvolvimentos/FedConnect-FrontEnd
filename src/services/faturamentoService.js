import api from "./api";

const getDadosBoletosSegundaVia = async (fatura) => {
  try {
    const response = await api.get(`api/faturamento/dados-segunda-via/${fatura}/`);
    // console.log("Resposta da API:", response.data);
    return response.data;
    } catch (error) {
        console.error("Erro ao obter dados dos boletos:", error);
        throw error;
  }
};