// src/services/envioPortoService.js
//
// Tela Envio Porto (spec specs/envio-porto) → proxy Django `envio-porto/*` →
// FedHub `/api/envio-porto/*`. O Django responde {sucesso, resultado} ou
// {sucesso: false, erro, resultado} com o mesmo HTTP status do FedHub.
// O operador nunca é enviado daqui — o Django deriva do JWT.

import api from "./api";

const desembrulhar = (response) => response.data?.resultado ?? response.data;

/** Mensagem legível a partir de um erro do axios (nunca tela silenciosa). */
export const mensagemDeErro = (error, padrao = "Erro na comunicação com o servidor.") => {
  const data = error?.response?.data;
  if (data?.erro) return data.erro;
  if (data?.resultado?.message) return data.resultado.message;
  if (data?.message) return data.message;
  if (error?.code === "ECONNABORTED") return "Tempo de resposta esgotado — tente novamente.";
  if (error?.message && !error?.response) return "Sem contato com o servidor — tentando novamente.";
  return padrao;
};

/** Job em andamento devolvido num 409 (gerar com job já executando). */
export const jobEmAndamentoDoErro = (error) => error?.response?.data?.resultado?.job_id || null;

// ---------- Porto Assistência ----------
export const gerarAssistencia = async ({ inivig, produtos }) => {
  const response = await api.post("envio-porto/assistencia/gerar/", { inivig, produtos });
  return desembrulhar(response);
};

// ---------- Jobs ----------
export const listarJobs = async ({ tipo, limite = 20 } = {}) => {
  const params = { limite };
  if (tipo) params.tipo = tipo;
  const response = await api.get("envio-porto/jobs/", { params });
  const dados = desembrulhar(response);
  return Array.isArray(dados) ? dados : dados?.jobs || [];
};

export const obterJob = async (jobId) => {
  const response = await api.get(`envio-porto/jobs/${jobId}/`);
  return desembrulhar(response);
};

/** Baixa a planilha do job como blob e dispara o download no navegador. */
export const baixarPlanilha = async (jobId, nomePadrao = `envio-porto-${jobId}.xlsx`) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${api.defaults.baseURL || ""}envio-porto/jobs/${jobId}/download/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    let mensagem = `Falha no download (${response.status})`;
    try {
      const corpo = await response.json();
      mensagem = corpo?.erro || corpo?.resultado?.message || mensagem;
    } catch (_) {
      /* corpo não-JSON */
    }
    throw new Error(mensagem);
  }
  const blob = await response.blob();
  let filename = nomePadrao;
  const disposicao = response.headers.get("Content-Disposition");
  const match = disposicao && disposicao.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (match && match[1]) filename = match[1].replace(/['"]/g, "");
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  return filename;
};

/** Envio à Porto: `confirmacao` é o texto digitado pelo operador ("ENVIAR"). */
export const enviarSftp = async (jobId, { confirmacao, reenviar = false }) => {
  const response = await api.post(
    `envio-porto/jobs/${jobId}/enviar-sftp/`,
    { confirmacao, reenviar },
    { timeout: 300000 }
  );
  return desembrulhar(response);
};

// ---------- Subgrupos Vida ----------
export const listarSubgrupos = async () => {
  const response = await api.get("envio-porto/vida/subgrupos/");
  const dados = desembrulhar(response);
  return Array.isArray(dados) ? dados : dados?.subgrupos || [];
};

export const gerarVida = async ({ vigencia, subgrupos }) => {
  const response = await api.post("envio-porto/vida/gerar/", { vigencia, subgrupos });
  return desembrulhar(response);
};

export const inconsistenciasVida = async (vigencia) => {
  const response = await api.get("envio-porto/vida/inconsistencias/", { params: { vigencia } });
  return desembrulhar(response);
};
