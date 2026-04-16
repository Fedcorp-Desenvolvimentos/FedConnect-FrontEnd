import api from "./api";

export const cancelarBoletoFedBNK = async (payload) => {
  try {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    // Payload: sempre com metodo, fatura e documento (documento pode ser null)
    const requestPayload = {
      metodo: payload.metodo,      // "INDIVIDUAL" ou "TODOS"
      fatura: payload.fatura,      // número da fatura
      documento: payload.documento || null,
      motivo: payload.motivo,
      mail: payload.mail
    };
    
    const response = await api.post(
      `boletofedbnk/cancelar/`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar boleto:', error);
    throw error;
  }
};