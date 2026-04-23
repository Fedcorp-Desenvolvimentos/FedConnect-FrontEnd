// services/consultaRegiaoService.js

import api from "./api"; 

export const ConsultaRegiaoService = {
  getLocalidades: async () => {
    const response = await api.get(
      `consultas/localidade/`
    );
    return response.data;
  },
};