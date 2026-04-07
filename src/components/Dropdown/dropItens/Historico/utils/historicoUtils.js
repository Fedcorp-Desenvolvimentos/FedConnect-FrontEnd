// pages/Historico/utils/historicoUtils.js
export const getParametroDisplay = (consulta, detalhes = null) => {
  const tiposChave = [
    'cpf_alternativa',
    'cnpj_razao_social',
    'cep_rua_cidade'
  ];
  
  if (tiposChave.includes(consulta.tipo_consulta)) {
    if (detalhes && detalhes.resultado && detalhes.resultado.Result && detalhes.resultado.Result.length > 0) {
      if (detalhes.resultado.Result[0].BasicData && detalhes.resultado.Result[0].BasicData.Name) {
        return detalhes.resultado.Result[0].BasicData.Name;
      }
      if (detalhes.resultado.Result[0].BasicData && detalhes.resultado.Result[0].BasicData.OfficialName) {
        return detalhes.resultado.Result[0].BasicData.OfficialName;
      }
    }
    if (detalhes && detalhes.resultado && detalhes.resultado.resultados_viacep && detalhes.resultado.resultados_viacep.length > 0) {
      return detalhes.resultado.resultados_viacep[0].logradouro || detalhes.resultado.resultados_viacep[0].cep || 'Endereço encontrado';
    }
    if (
      detalhes &&
      ((detalhes.resultado &&
        ((detalhes.resultado.Result && detalhes.resultado.Result.length === 0) ||
          (detalhes.resultado.resultados_viacep && detalhes.resultado.resultados_viacep.length === 0))) ||
        !detalhes.resultado)
    ) {
      return 'Pesquisa falhou';
    }
    try {
      const param = typeof consulta.parametro_consulta === 'string'
        ? JSON.parse(consulta.parametro_consulta)
        : consulta.parametro_consulta;
      if (param && param.q) return param.q;
      if (param && param.name) return param.name;
      return 'Chaves alternativas';
    } catch {
      return 'Chaves alternativas';
    }
  }
  return consulta.parametro_consulta;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('pt-BR');
};