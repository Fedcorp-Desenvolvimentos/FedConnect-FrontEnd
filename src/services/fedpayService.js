import api from "./api";

// Tratamento de boletos (FedPay/FedHub via backend Django).
// O nível do operador NÃO é enviado — o backend deriva do token.

export const consultarTratamentoFatura = async (fatura, isfedcob = false) => {
  const response = await api.get(`fedpay/consulta/${fatura}/`, {
    params: isfedcob ? { isfedcob: true } : {},
  });
  return response.data;
};

export const enviarTratamento = async (payload) => {
  // O tratamento cancela no banco emissor, recria e reemite — pode demorar
  const response = await api.post("fedpay/tratamento/", payload, {
    timeout: 300000,
  });
  return response.data;
};
