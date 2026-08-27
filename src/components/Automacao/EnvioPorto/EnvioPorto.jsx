import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSpinner, FaDownload, FaPaperPlane, FaExclamationTriangle, FaTimes, FaSync, FaShip } from "react-icons/fa";
import * as S from "./EnvioPortoStyles";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { useAuth } from "../../../context/AuthContext";
import {
  baixarPlanilha,
  enviarSftp,
  gerarAssistencia,
  gerarVida,
  inconsistenciasVida,
  jobEmAndamentoDoErro,
  listarJobs,
  listarSubgrupos,
  mensagemDeErro,
  obterJob,
} from "../../../services/envioPortoService";

// Envio Porto (spec specs/envio-porto): substitui o desktop "Sistema de Envio
// Porto Seguro". Toda a lógica é do FedHub (via proxy Django); aqui só
// formulários, polling do job, download e a confirmação digitada do envio.

// PA-023 (FedHub, fechada 2026-08-27): "faturista" = nivel_acesso "faturamento",
// Alberto é admin, "ti" = equipe técnica. O Django reforça o mesmo gate.
const NIVEIS_TELA = ["admin", "faturamento", "ti"];
const NIVEIS_ENVIO = ["admin", "faturamento", "ti"];
const TEXTO_CONFIRMACAO = "ENVIAR";
const INTERVALO_POLLING_MS = 2000;
const CHAVE_PREFS = "envioPorto.assistencia";

const PRODUTOS = [
  { codigo: "1", nome: "Código 1 - Residencial" },
  { codigo: "2", nome: "Código 2 - Auto" },
  { codigo: "3", nome: "Código 3 - Empresarial" },
];

const prefsPadrao = () => ({
  produtos: Object.fromEntries(PRODUTOS.map((p) => [p.codigo, { incluir: true, modo: "toda", quantidade: "10000" }])),
});

const carregarPrefs = () => {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_PREFS) || "null");
    if (salvo?.produtos) return { ...prefsPadrao(), ...salvo, produtos: { ...prefsPadrao().produtos, ...salvo.produtos } };
  } catch (_) {
    /* prefs corrompidas não impedem o uso */
  }
  return prefsPadrao();
};

/** Dia 01 do mês anterior (padrão de vigência do desktop), em AAAA-MM-DD. */
export const primeiroDiaMesAnterior = (hoje = new Date()) => {
  const d = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-01`;
};

const formatarDataHora = (valor) => {
  if (!valor) return "—";
  const d = new Date(valor);
  return isNaN(d) ? String(valor) : d.toLocaleString("pt-BR");
};

const formatarData = (valor) => {
  if (!valor) return "—";
  const [a, m, dia] = String(valor).slice(0, 10).split("-");
  return dia && m && a ? `${dia}/${m}/${a}` : String(valor);
};

const vigenciaDoJob = (job) => job?.parametros?.inivig || job?.parametros?.vigencia || null;

// ---------------------------------------------------------------------------
// Hook: acompanha um job por polling enquanto estiver executando (RF-2)
// ---------------------------------------------------------------------------
const useJob = (jobId, aoConcluir) => {
  const [job, setJob] = useState(null);
  const [erroPolling, setErroPolling] = useState("");
  const timer = useRef(null);
  const concluiuRef = useRef(false);

  const consultar = useCallback(async () => {
    if (!jobId) return;
    try {
      const dados = await obterJob(jobId);
      setJob(dados);
      setErroPolling("");
      if (dados?.status && dados.status !== "executando" && !concluiuRef.current) {
        concluiuRef.current = true;
        aoConcluir?.(dados);
      }
    } catch (error) {
      setErroPolling(mensagemDeErro(error));
    }
  }, [jobId, aoConcluir]);

  useEffect(() => {
    setJob(null);
    setErroPolling("");
    concluiuRef.current = false;
    if (!jobId) return undefined;
    consultar();
    timer.current = setInterval(consultar, INTERVALO_POLLING_MS);
    return () => clearInterval(timer.current);
  }, [jobId, consultar]);

  useEffect(() => {
    if (job && job.status !== "executando" && timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, [job]);

  const atualizar = consultar;
  return { job, erroPolling, atualizar };
};

// ---------------------------------------------------------------------------
// Painel do job: log, totais, download e envio (RF-2, RF-3, RF-4)
// ---------------------------------------------------------------------------
const PainelJob = ({ job, erroPolling, podeEnviar, onBaixar, onEnviar, ocupado }) => {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [job?.log?.length]);

  if (!job) return null;
  const linhas = Array.isArray(job.log) ? job.log : [];
  const ultimoErro = [...linhas].reverse().find((l) => String(l).startsWith("[ERRO]"));
  const concluido = job.status === "concluido";
  const temArquivo = concluido && job.resultado?.arquivo && (job.resultado?.total ?? 1) > 0;
  const enviado = job.envio?.status === "enviado";
  const porProduto = job.resultado?.linhas_por_produto || {};

  return (
    <S.Card>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <S.SectionTitle style={{ margin: 0 }}>
          Job {job.tipo === "vida" ? "Subgrupos Vida" : "Porto Assistência"}
        </S.SectionTitle>
        <S.StatusBadge $status={job.status}>{job.status}</S.StatusBadge>
        {job.envio?.status && job.tipo !== "vida" && (
          <S.StatusBadge $status={job.envio.status}>{enviado ? "enviado à Porto" : job.envio.status.replace("_", " ")}</S.StatusBadge>
        )}
        <S.Muted style={{ margin: 0 }}>
          #{job.job_id} · {job.operador || "—"} · {formatarDataHora(job.criado_em)}
          {vigenciaDoJob(job) && ` · vigência ${formatarData(vigenciaDoJob(job))}`}
        </S.Muted>
      </div>

      {erroPolling && <S.Alert $type="warning" style={{ marginTop: "0.75rem" }}><FaExclamationTriangle /> {erroPolling}</S.Alert>}
      {job.status === "falhou" && (
        <S.Alert $type="error" style={{ marginTop: "0.75rem" }}>
          <FaExclamationTriangle /> {ultimoErro || "A geração falhou. Veja o log."}
        </S.Alert>
      )}
      {concluido && job.resultado?.total === 0 && (
        <S.Alert $type="warning" style={{ marginTop: "0.75rem" }}>Nenhum dado encontrado para os filtros selecionados.</S.Alert>
      )}

      <S.LogBox ref={logRef}>
        {linhas.length === 0 ? "Aguardando o início da geração..." : linhas.map((l, i) => (
          <div key={i} className={String(l).startsWith("[ERRO]") ? "erro" : undefined}>{l}</div>
        ))}
      </S.LogBox>

      {concluido && job.resultado && (
        <S.Totais>
          {Object.entries(porProduto).map(([codigo, linhasProd]) => (
            <S.Total key={codigo}>
              <span>{PRODUTOS.find((p) => p.codigo === String(codigo))?.nome || `Produto ${codigo}`}</span>
              <strong>{Number(linhasProd).toLocaleString("pt-BR")} linhas</strong>
            </S.Total>
          ))}
          <S.Total>
            <span>Total geral</span>
            <strong>{Number(job.resultado.total ?? 0).toLocaleString("pt-BR")} linhas</strong>
          </S.Total>
          {job.resultado.arquivo && (
            <S.Total>
              <span>Arquivo</span>
              <strong style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{job.resultado.arquivo}</strong>
            </S.Total>
          )}
        </S.Totais>
      )}

      {enviado && job.envio?.remoto && (
        <S.Alert $type="success" style={{ marginTop: "0.75rem" }}>
          Enviado à Porto: <S.Highlight>{job.envio.remoto}</S.Highlight> ({Number(job.envio.bytes || 0).toLocaleString("pt-BR")} bytes)
          {job.envio.em && ` em ${formatarDataHora(job.envio.em)}`}{job.envio.operador && ` por ${job.envio.operador}`}
        </S.Alert>
      )}
      {job.envio?.status === "falhou" && (
        <S.Alert $type="error" style={{ marginTop: "0.75rem" }}>Falha no envio à Porto: {job.envio.erro || "veja o log"}. O arquivo pode ser reenviado.</S.Alert>
      )}

      <S.Actions>
        <S.SecondaryButton onClick={() => onBaixar(job)} disabled={ocupado || !temArquivo} title={temArquivo ? "Baixar a planilha" : "Disponível quando o job concluir com dados"}>
          <FaDownload /> Baixar planilha
        </S.SecondaryButton>
        {job.tipo !== "vida" && podeEnviar && (
          <S.DangerButton onClick={() => onEnviar(job)} disabled={ocupado || !temArquivo}>
            <FaPaperPlane /> {enviado ? "Reenviar para a Porto" : "Enviar para a Porto"}
          </S.DangerButton>
        )}
      </S.Actions>
    </S.Card>
  );
};

// ---------------------------------------------------------------------------
// Modal de confirmação do envio SFTP (RF-4)
// ---------------------------------------------------------------------------
const ModalEnvio = ({ job, enviando, erro, onCancelar, onConfirmar }) => {
  const [texto, setTexto] = useState("");
  const reenvio = job.envio?.status === "enviado";
  const confirmado = texto.trim().toUpperCase() === TEXTO_CONFIRMACAO;
  return (
    <S.ModalOverlay onClick={enviando ? undefined : onCancelar}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <FaExclamationTriangle size={20} />
          <h3>{reenvio ? "Reenviar para a Porto Seguro" : "Enviar para a Porto Seguro"}</h3>
          <S.SecondaryButton onClick={onCancelar} disabled={enviando} style={{ padding: "0.35rem 0.6rem" }}><FaTimes /></S.SecondaryButton>
        </S.ModalHeader>
        <S.ModalBody>
          <S.WarningBox>
            <FaExclamationTriangle />
            <div>
              Tudo que chega em <S.Highlight>/Porto/Remessa</S.Highlight> pode ser processado pela seguradora. Esta ação não pode ser desfeita.
              {reenvio && <> O arquivo remoto <strong>será sobrescrito</strong>.</>}
            </div>
          </S.WarningBox>
          <ul>
            <li>Arquivo: <strong>{job.resultado?.arquivo}</strong></li>
            {vigenciaDoJob(job) && <li>Vigência: <strong>{formatarData(vigenciaDoJob(job))}</strong></li>}
            <li>Total: <strong>{Number(job.resultado?.total ?? 0).toLocaleString("pt-BR")} linhas</strong>
              {job.resultado?.linhas_por_produto && ` (${Object.entries(job.resultado.linhas_por_produto).map(([c, n]) => `cód. ${c}: ${n}`).join(", ")})`}
            </li>
          </ul>
          <p>Digite <S.Highlight>{TEXTO_CONFIRMACAO}</S.Highlight> para confirmar:</p>
          <S.Input value={texto} onChange={(e) => setTexto(e.target.value)} disabled={enviando} autoFocus placeholder={TEXTO_CONFIRMACAO} style={{ width: "100%" }} />
          {erro && <S.Alert $type="error" style={{ marginTop: "0.75rem", marginBottom: 0 }}>{erro}</S.Alert>}
        </S.ModalBody>
        <S.ModalActions>
          <S.SecondaryButton onClick={onCancelar} disabled={enviando}>Cancelar</S.SecondaryButton>
          <S.DangerButton onClick={() => onConfirmar(texto.trim().toUpperCase(), reenvio)} disabled={!confirmado || enviando}>
            {enviando ? <><FaSpinner className="spinner" /> Enviando...</> : <><FaPaperPlane /> {reenvio ? "Reenviar" : "Enviar"}</>}
          </S.DangerButton>
        </S.ModalActions>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
const EnvioPorto = () => {
  const { user, isAuthenticated } = useAuth();
  const nivel = user?.nivel_acesso;
  const podeUsar = NIVEIS_TELA.includes(nivel);
  const podeEnviar = NIVEIS_ENVIO.includes(nivel);

  const [aba, setAba] = useState("assistencia");
  const [status, setStatus] = useState(null); // {type, message}
  const [ocupado, setOcupado] = useState(false);

  // Assistência (RF-1)
  const [inivig, setInivig] = useState(primeiroDiaMesAnterior());
  const [prefs, setPrefs] = useState(carregarPrefs);
  // Vida (RF-5)
  const [vigenciaVida, setVigenciaVida] = useState(primeiroDiaMesAnterior());
  const [subgrupos, setSubgrupos] = useState([]);
  const [subgruposSel, setSubgruposSel] = useState(new Set());
  const [carregandoSubgrupos, setCarregandoSubgrupos] = useState(false);
  const [inconsistencias, setInconsistencias] = useState(null);
  // Jobs (RF-2, RF-6)
  const [jobId, setJobId] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [modalEnvio, setModalEnvio] = useState(null); // job
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  const carregarHistorico = useCallback(async () => {
    try {
      const jobs = await listarJobs({ limite: 20 });
      setHistorico(jobs);
      return jobs;
    } catch (error) {
      setStatus({ type: "warning", message: `Histórico indisponível: ${mensagemDeErro(error)}` });
      return [];
    }
  }, []);

  const aoConcluirJob = useCallback(() => { carregarHistorico(); }, [carregarHistorico]);
  const { job, erroPolling, atualizar: atualizarJob } = useJob(jobId, aoConcluirJob);

  // Ao abrir: histórico e retomada de job em execução (RF-6)
  useEffect(() => {
    if (!podeUsar) return;
    carregarHistorico().then((jobs) => {
      const emExecucao = jobs.find((j) => j.status === "executando");
      if (emExecucao) {
        setJobId(emExecucao.job_id);
        setStatus({ type: "info", message: `Há uma geração em andamento (job ${emExecucao.job_id}) — acompanhando.` });
      }
    });
  }, [podeUsar, carregarHistorico]);

  useEffect(() => {
    if (aba !== "vida" || subgrupos.length > 0 || !podeUsar) return;
    setCarregandoSubgrupos(true);
    listarSubgrupos()
      .then(setSubgrupos)
      .catch((error) => setStatus({ type: "error", message: `Não foi possível carregar os subgrupos: ${mensagemDeErro(error)}` }))
      .finally(() => setCarregandoSubgrupos(false));
  }, [aba, subgrupos.length, podeUsar]);

  useEffect(() => {
    try { localStorage.setItem(CHAVE_PREFS, JSON.stringify(prefs)); } catch (_) { /* sem storage */ }
  }, [prefs]);

  const jobEmExecucaoDoTipo = (tipo) => (job?.status === "executando" && job?.tipo === tipo) || historico.some((j) => j.status === "executando" && j.tipo === tipo);

  // ---------- Assistência ----------
  const alterarProduto = (codigo, campo, valor) =>
    setPrefs((p) => ({ ...p, produtos: { ...p.produtos, [codigo]: { ...p.produtos[codigo], [campo]: valor } } }));

  const montarProdutos = () => {
    const produtos = {};
    for (const p of PRODUTOS) {
      const pref = prefs.produtos[p.codigo];
      if (!pref?.incluir) continue;
      if (pref.modo === "toda") {
        produtos[p.codigo] = null;
      } else {
        const qtd = parseInt(String(pref.quantidade).replace(/[.,\s]/g, ""), 10);
        if (!Number.isInteger(qtd) || qtd <= 0) throw new Error(`Quantidade inválida no ${p.nome}.`);
        produtos[p.codigo] = qtd;
      }
    }
    if (Object.keys(produtos).length === 0) throw new Error("Selecione ao menos um produto.");
    return produtos;
  };

  const iniciarGeracao = async (chamada, tipo) => {
    setStatus(null);
    setOcupado(true);
    try {
      const resultado = await chamada();
      if (!resultado?.job_id) throw new Error("Resposta inesperada do servidor (sem job_id).");
      setJobId(resultado.job_id);
      setStatus({ type: "success", message: `Geração iniciada (job ${resultado.job_id}).` });
      carregarHistorico();
    } catch (error) {
      const andamento = jobEmAndamentoDoErro(error);
      if (andamento) {
        setJobId(andamento);
        setStatus({ type: "warning", message: `Já existe uma geração ${tipo} em andamento (job ${andamento}) — acompanhando.` });
      } else {
        setStatus({ type: "error", message: error?.response ? mensagemDeErro(error) : error.message || mensagemDeErro(error) });
      }
    } finally {
      setOcupado(false);
    }
  };

  const gerarAssistenciaClick = () => {
    if (!inivig) return setStatus({ type: "error", message: "Informe a data de início de vigência." });
    let produtos;
    try { produtos = montarProdutos(); } catch (e) { return setStatus({ type: "error", message: e.message }); }
    return iniciarGeracao(() => gerarAssistencia({ inivig, produtos }), "Porto Assistência");
  };

  // ---------- Vida ----------
  const alternarSubgrupo = (nome) =>
    setSubgruposSel((prev) => { const n = new Set(prev); n.has(nome) ? n.delete(nome) : n.add(nome); return n; });

  const gerarVidaClick = () => {
    if (!vigenciaVida) return setStatus({ type: "error", message: "Informe a data de vigência." });
    if (subgruposSel.size === 0) return setStatus({ type: "error", message: "Selecione ao menos um subgrupo." });
    return iniciarGeracao(() => gerarVida({ vigencia: vigenciaVida, subgrupos: Array.from(subgruposSel) }), "Subgrupos Vida");
  };

  const verInconsistencias = async () => {
    setStatus(null);
    setOcupado(true);
    setInconsistencias(null);
    try {
      const r = await inconsistenciasVida(vigenciaVida);
      const linhas = Array.isArray(r) ? r : r?.linhas || [];
      const colunas = r?.colunas || (linhas[0] ? Object.keys(linhas[0]) : []);
      setInconsistencias({ colunas, linhas });
      if (linhas.length === 0) setStatus({ type: "success", message: "Nenhuma inconsistência encontrada para esta data." });
    } catch (error) {
      setStatus({ type: "error", message: mensagemDeErro(error) });
    } finally {
      setOcupado(false);
    }
  };

  // ---------- Download / envio ----------
  const baixar = async (j) => {
    setStatus(null);
    setOcupado(true);
    try {
      const nome = await baixarPlanilha(j.job_id, j.resultado?.arquivo);
      setStatus({ type: "success", message: `Download iniciado: ${nome}` });
    } catch (error) {
      setStatus({ type: "error", message: error.message || mensagemDeErro(error) });
    } finally {
      setOcupado(false);
    }
  };

  const confirmarEnvio = async (confirmacao, reenviar) => {
    if (!modalEnvio) return;
    setEnviando(true);
    setErroEnvio("");
    try {
      const r = await enviarSftp(modalEnvio.job_id, { confirmacao, reenviar });
      setModalEnvio(null);
      setStatus({ type: "success", message: `Arquivo enviado à Porto: ${r?.envio?.remoto || r?.remoto || "confirmado pelo servidor"}.` });
      if (modalEnvio.job_id === jobId) atualizarJob(); else setJobId(modalEnvio.job_id);
      carregarHistorico();
    } catch (error) {
      setErroEnvio(mensagemDeErro(error, "Falha no envio — o arquivo continua disponível para nova tentativa."));
    } finally {
      setEnviando(false);
    }
  };

  // ---------- Render ----------
  if (!isAuthenticated) {
    return <div style={{ textAlign: "center", padding: "2rem" }}><p>Você precisa estar logado para acessar esta página.</p></div>;
  }
  if (!podeUsar) {
    return (
      <PageLayout title="Envio Porto" subtitle="Acesso restrito" icon={<FaShip />}>
        <S.Container><S.Card><S.Alert $type="error"><FaExclamationTriangle /> Seu nível de acesso não permite usar o Envio Porto.</S.Alert></S.Card></S.Container>
      </PageLayout>
    );
  }

  const assistenciaEmExecucao = jobEmExecucaoDoTipo("assistencia");
  const vidaEmExecucao = jobEmExecucaoDoTipo("vida");

  return (
    <PageLayout title="Envio Porto" subtitle="Geração da relação mensal para a Porto Seguro, envio por SFTP e relatórios de Subgrupos Vida" icon={<FaShip />}>
      <S.Container>
        <S.Card>
          <S.Tabs>
            <S.Tab $active={aba === "assistencia"} onClick={() => setAba("assistencia")}>Porto Assistência</S.Tab>
            <S.Tab $active={aba === "vida"} onClick={() => setAba("vida")}>Subgrupos Vida</S.Tab>
            <S.Tab $active={aba === "dental"} onClick={() => setAba("dental")}>Dental</S.Tab>
          </S.Tabs>

          {status && <S.Alert $type={status.type}>{status.message}</S.Alert>}

          {aba === "assistencia" && (
            <>
              <S.FormGrid>
                <S.FormField>
                  <S.Label>Data de início de vigência (<code>:inivig</code> das queries)</S.Label>
                  <S.Input type="date" value={inivig} onChange={(e) => setInivig(e.target.value)} disabled={ocupado || assistenciaEmExecucao} />
                  <S.Muted>Pré-sugerida: dia 01 do mês anterior. Define a competência do arquivo (relacao-envio-porto-MMAAAA.xlsx).</S.Muted>
                </S.FormField>
              </S.FormGrid>
              <S.SectionTitle style={{ marginTop: "1.25rem" }}>Produtos</S.SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {PRODUTOS.map((p) => {
                  const pref = prefs.produtos[p.codigo];
                  return (
                    <S.ProdutoRow key={p.codigo} $ativo={pref.incluir}>
                      <label><input type="checkbox" checked={pref.incluir} onChange={(e) => alterarProduto(p.codigo, "incluir", e.target.checked)} disabled={ocupado} /> {p.nome}</label>
                      <label><input type="radio" name={`modo-${p.codigo}`} checked={pref.modo === "toda"} onChange={() => alterarProduto(p.codigo, "modo", "toda")} disabled={ocupado || !pref.incluir} /> Base toda</label>
                      <label><input type="radio" name={`modo-${p.codigo}`} checked={pref.modo === "quantidade"} onChange={() => alterarProduto(p.codigo, "modo", "quantidade")} disabled={ocupado || !pref.incluir} /> Quantidade:</label>
                      <S.Input type="number" min="1" step="1" value={pref.quantidade} onChange={(e) => alterarProduto(p.codigo, "quantidade", e.target.value)} disabled={ocupado || !pref.incluir || pref.modo !== "quantidade"} placeholder="linhas" />
                    </S.ProdutoRow>
                  );
                })}
              </div>
              <S.Actions>
                <S.SuccessButton onClick={gerarAssistenciaClick} disabled={ocupado || assistenciaEmExecucao} title={assistenciaEmExecucao ? "Já existe uma geração em andamento" : "Gerar a planilha"}>
                  {ocupado ? <FaSpinner className="spinner" /> : <FaSync />} Gerar Planilha
                </S.SuccessButton>
              </S.Actions>
              <S.Muted>O envio à Porto é um passo separado, com confirmação — nunca acontece automaticamente ao fim da geração.</S.Muted>
            </>
          )}

          {aba === "vida" && (
            <>
              <S.FormGrid>
                <S.FormField>
                  <S.Label>Data de vigência</S.Label>
                  <S.Input type="date" value={vigenciaVida} onChange={(e) => setVigenciaVida(e.target.value)} disabled={ocupado || vidaEmExecucao} />
                </S.FormField>
              </S.FormGrid>
              <S.SectionTitle style={{ marginTop: "1.25rem" }}>
                Subgrupos {carregandoSubgrupos && <FaSpinner className="spinner" />}
                {subgrupos.length > 0 && <S.Muted style={{ display: "inline", marginLeft: "0.5rem" }}>({subgruposSel.size} de {subgrupos.length} selecionados)</S.Muted>}
              </S.SectionTitle>
              <S.Subgrupos>
                {subgrupos.map((sg) => {
                  const nome = sg.nome ?? sg.NOME_SUBGRP ?? String(sg);
                  return (
                    <label key={nome}>
                      <input type="checkbox" checked={subgruposSel.has(nome)} onChange={() => alternarSubgrupo(nome)} disabled={ocupado} /> {nome}
                    </label>
                  );
                })}
                {!carregandoSubgrupos && subgrupos.length === 0 && <S.Muted>Nenhum subgrupo carregado.</S.Muted>}
              </S.Subgrupos>
              <S.Actions>
                <S.PrimaryButton onClick={verInconsistencias} disabled={ocupado}>Ver inconsistências</S.PrimaryButton>
                <S.SuccessButton onClick={gerarVidaClick} disabled={ocupado || vidaEmExecucao}>
                  {ocupado ? <FaSpinner className="spinner" /> : <FaSync />} Gerar Planilha Excel
                </S.SuccessButton>
              </S.Actions>
              {inconsistencias && inconsistencias.linhas.length > 0 && (
                <>
                  <S.SectionTitle style={{ marginTop: "1.25rem" }}>Inconsistências — faturas de Vida sem subgrupo ({inconsistencias.linhas.length})</S.SectionTitle>
                  <S.TableWrapper>
                    <S.Table>
                      <thead><tr>{inconsistencias.colunas.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                      <tbody>
                        {inconsistencias.linhas.map((l, i) => (
                          <tr key={i}>{inconsistencias.colunas.map((c) => <td key={c}>{Array.isArray(l) ? l[inconsistencias.colunas.indexOf(c)] : String(l[c] ?? "")}</td>)}</tr>
                        ))}
                      </tbody>
                    </S.Table>
                  </S.TableWrapper>
                </>
              )}
            </>
          )}

          {aba === "dental" && (
            <S.Placeholder>
              <S.Alert $type="info" style={{ marginBottom: 0 }}>Módulos planejados — o código entra depois, no mesmo padrão.</S.Alert>
              <S.SecondaryButton disabled title="Em desenvolvimento">GERA PORTO DENTAL — em desenvolvimento</S.SecondaryButton>
              <S.SecondaryButton disabled title="Em desenvolvimento">GERAR DENTAL SEMPRE ODONTO — em desenvolvimento</S.SecondaryButton>
            </S.Placeholder>
          )}
        </S.Card>

        <PainelJob job={job} erroPolling={erroPolling} podeEnviar={podeEnviar} onBaixar={baixar} onEnviar={(j) => { setErroEnvio(""); setModalEnvio(j); }} ocupado={ocupado || enviando} />

        <S.Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <S.SectionTitle style={{ margin: 0 }}>Histórico recente</S.SectionTitle>
            <S.SecondaryButton onClick={carregarHistorico} disabled={ocupado} style={{ padding: "0.4rem 0.8rem" }}><FaSync /> Atualizar</S.SecondaryButton>
          </div>
          {historico.length === 0 ? (
            <S.Muted>Nenhum job registrado ainda.</S.Muted>
          ) : (
            <S.TableWrapper>
              <S.Table>
                <thead>
                  <tr><th>Job</th><th>Tipo</th><th>Vigência</th><th>Operador</th><th>Criado em</th><th>Status</th><th>Linhas</th><th>Envio</th><th style={{ width: 150 }}>Ações</th></tr>
                </thead>
                <tbody>
                  {historico.map((j) => {
                    const temArquivo = j.status === "concluido" && j.resultado?.arquivo && (j.resultado?.total ?? 1) > 0;
                    return (
                      <tr key={j.job_id} style={j.job_id === jobId ? { background: "#f0f9ff" } : undefined}>
                        <S.MonoCell>{j.job_id}</S.MonoCell>
                        <td>{j.tipo === "vida" ? "Subgrupos Vida" : "Porto Assistência"}</td>
                        <td>{formatarData(vigenciaDoJob(j))}</td>
                        <td>{j.operador || "—"}</td>
                        <td>{formatarDataHora(j.criado_em)}</td>
                        <td><S.StatusBadge $status={j.status}>{j.status}</S.StatusBadge></td>
                        <td>{j.resultado?.total != null ? Number(j.resultado.total).toLocaleString("pt-BR") : "—"}</td>
                        <td>
                          {j.tipo === "vida" ? "—" : j.envio?.status === "enviado"
                            ? <span title={`${j.envio.remoto || ""} · ${j.envio.operador || ""}`}><S.StatusBadge $status="enviado">enviado</S.StatusBadge></span>
                            : <S.StatusBadge $status={j.envio?.status || "nao_enviado"}>{(j.envio?.status || "não enviado").replace("_", " ")}</S.StatusBadge>}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.35rem" }}>
                            <S.SecondaryButton onClick={() => setJobId(j.job_id)} disabled={ocupado} style={{ padding: "0.35rem 0.6rem" }} title="Ver log">Ver</S.SecondaryButton>
                            <S.SecondaryButton onClick={() => baixar(j)} disabled={ocupado || !temArquivo} style={{ padding: "0.35rem 0.6rem" }} title="Baixar"><FaDownload /></S.SecondaryButton>
                            {j.tipo !== "vida" && podeEnviar && (
                              <S.DangerButton onClick={() => { setErroEnvio(""); setModalEnvio(j); }} disabled={ocupado || enviando || !temArquivo} style={{ padding: "0.35rem 0.6rem" }} title="Enviar para a Porto"><FaPaperPlane /></S.DangerButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </S.Table>
            </S.TableWrapper>
          )}
        </S.Card>

        {modalEnvio && (
          <ModalEnvio job={modalEnvio} enviando={enviando} erro={erroEnvio} onCancelar={() => !enviando && setModalEnvio(null)} onConfirmar={confirmarEnvio} />
        )}
      </S.Container>
    </PageLayout>
  );
};

export default EnvioPorto;
