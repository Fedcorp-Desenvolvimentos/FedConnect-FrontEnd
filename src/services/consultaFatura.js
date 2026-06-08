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

export const getFaturamento = async (filtros = {}) => {
  try {
    const token = localStorage.getItem("accessToken", "");
    const response = await api.get(
      "consultas/faturamento/",
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
      "Erro de endpoint ao consultar faturamento geral",
      error
    );
    throw error;
  }
};

export const exportarFaturasParaExcel = async (filtros = {}) => {
  try {
    const token = localStorage.getItem("accessToken", "");
    
    // Usar fetch para baixar o arquivo
    const response = await fetch(
      `${api.defaults.baseURL || ''}consultas/faturas/com-boletos/exportar-excel/?${new URLSearchParams(filtros)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na exportação: ${response.statusText}`);
    }

    // Obter o blob (arquivo)
    const blob = await response.blob();
    
    // Criar URL para download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Extrair nome do arquivo do header ou criar padrão
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'faturas_com_boletos.xlsx';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { sucesso: true, mensagem: 'Arquivo baixado com sucesso' };
    
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
    
    // Se for erro de conteúdo (provavelmente mensagem JSON de erro)
    if (error.message.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      // Tentar ler como JSON
      try {
        const errorData = await error.response?.json();
        throw new Error(errorData?.erro || 'Erro na exportação');
      } catch {
        throw error;
      }
    }
    
    throw error;
  }
};

export const exportarFaturasParaPDF = async (filtros = {}) => {
  const token = localStorage.getItem("accessToken", "");

  const response = await fetch(
    `${api.defaults.baseURL || ''}consultas/faturas/com-boletos/exportar-pdf/?${new URLSearchParams(filtros)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao exportar PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "faturas_com_boletos.pdf";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const rodar_procedure_tratamento_erros = async () => {
  try {
    const token = localStorage.getItem("accessToken", "");
    const response = await api.post(
      "faturamento/tratamento-de-erros/rodar-procedure/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao rodar procedure de tratamento de erros:", error);
    throw error;
  }
};