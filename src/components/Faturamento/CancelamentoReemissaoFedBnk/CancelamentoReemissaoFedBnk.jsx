import React, { useMemo, useState } from "react";
import { GiCancel, GiTrashCan } from "react-icons/gi";
import { FaHammer, FaSpinner, FaSearch, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import * as S from "./CancelamentoReemissaoFedBnkStyles";
import { useAuth } from "../../../context/AuthContext";
import { getFaturamento } from "../../../services/consultaFatura";
import { cancelarBoletoFedBNK } from "../../../services/boletofedbnk";
import { consultarTratamentoFatura, enviarTratamento } from "../../../services/fedpayService";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";

// Cancelamento/Reemissão FedBnk: uma única consulta de fatura alimenta as
// duas abas — cancelar boletos (individual ou em lote) ou corrigir dados e
// reemitir (o FedHub cancela, recria com número novo e emite).
// Níveis: cancelamento e reemissão têm listas próprias; nome cobrado, CNPJ/CPF
// cobrado e endereço só admin/ti (o backend Django e o FedHub reforçam — aqui é só UX).

const NIVEIS_CANCELAMENTO = ["admin", "usuario", "comercial", "faturamento"];
const NIVEIS_REEMISSAO = ["admin", "faturamento", "ti"];
const NIVEIS_ADMIN = ["admin", "ti"];

// Retenção sugerida ao digitar o novo valor: 4,8768% do valor, arredondado
// em 2 casas — só quando o valor passa de R$ 215
const LIMITE_RETENCAO = 215;
const PERCENTUAL_RETENCAO = 4.8768 / 100;

const FORM_VAZIO = {
  vencimento: "",
  valor: "",
  valor_cheio: "",
  nome_cobrado: "",
  cnpj_cobrado: "",
  cep: "",
  endereco: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const CancelamentoReemissaoFedBnk = () => {
  const { user, isAuthenticated } = useAuth();

  const currentUserType = user?.nivel_acesso;
  const podeCancelar = useMemo(() => NIVEIS_CANCELAMENTO.includes(currentUserType), [currentUserType]);
  const podeReemitir = useMemo(() => NIVEIS_REEMISSAO.includes(currentUserType), [currentUserType]);
  const isAdmin = useMemo(() => NIVEIS_ADMIN.includes(currentUserType), [currentUserType]);
  const podeAcessar = podeCancelar || podeReemitir;

  const [modo, setModo] = useState(podeCancelar ? "cancelamento" : "reemissao");

  const [fatura, setFatura] = useState("");
  const [dadosFatura, setDadosFatura] = useState(null);
  const [boletos, setBoletos] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Cancelamento
  const [cancelando, setCancelando] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ tipo: "", documento: "", motivo: "" });

  // Reemissão
  const [selecionados, setSelecionados] = useState(new Set());
  const [form, setForm] = useState(FORM_VAZIO);
  const [tratando, setTratando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [confirmTratOpen, setConfirmTratOpen] = useState(false);

  const ocupado = buscando || cancelando || tratando;
  const emCancelamento = modo === "cancelamento";

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);

  const formatarData = (valor) => {
    if (!valor) return "—";
    const d = new Date(valor);
    return isNaN(d) ? String(valor) : d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const situacaoBoleto = (boleto, parcela, registro, consultaFedpayOk) => {
    const pago = parcela?.DT_BAIXA != null || boleto.QUITADO === "S" || parcela?.STATUS === "B";
    const cancelado = boleto.STATUS_BOLETO === "C" || boleto.STATUS === "C" || boleto.DT_CANCEL != null;
    const temIdentificador = String(boleto.IDENTIFICADOR ?? "").trim() !== "";

    // Rótulo é só exibição — a elegibilidade (cancelável/tratável) usa os
    // flags pago/cancelado, pra um C sem identificador não virar cancelável
    let rotulo;
    if (pago) rotulo = { chave: "pago", rotulo: "PAGO" };
    // Status C sem identificador nunca chegou ao banco emissor
    else if (cancelado && !temIdentificador) rotulo = { chave: "nao_registrado", rotulo: "NÃO REGISTRADO" };
    else if (cancelado) rotulo = { chave: "cancelado", rotulo: "CANCELADO" };
    else if (registro === "success") rotulo = { chave: "registrado", rotulo: "REGISTRADO" };
    else if (registro === "nao_registrado") rotulo = { chave: "nao_registrado", rotulo: "NÃO REGISTRADO" };
    else if (!consultaFedpayOk) rotulo = { chave: "ativo", rotulo: "ATIVO" };
    else rotulo = { chave: "desconhecido", rotulo: "A CONFERIR" };

    return { ...rotulo, pago, cancelado };
  };

  const buscarFatura = async () => {
    if (!fatura.trim()) {
      setStatus({ type: "error", message: "Informe o número da fatura." });
      return;
    }

    setBuscando(true);
    setStatus({ type: "", message: "" });
    setDadosFatura(null);
    setBoletos([]);
    setSelecionados(new Set());
    setResultado(null);

    try {
      const [respFaturamento, respFedpay] = await Promise.allSettled([
        getFaturamento({ fatura: fatura.trim() }),
        podeReemitir ? consultarTratamentoFatura(fatura.trim()) : Promise.reject(),
      ]);

      if (respFaturamento.status !== "fulfilled" || !respFaturamento.value?.resultado?.data?.length) {
        setStatus({ type: "error", message: "Fatura não encontrada." });
        return;
      }

      const faturaData = respFaturamento.value.resultado.data[0];
      const boletosData = faturaData.BOLETOS || [];
      const parcelasData = faturaData.PARCELAS || [];

      const parcelaPorDocumento = {};
      parcelasData.forEach((parcela) => {
        if (parcela.DOCUMENTO) parcelaPorDocumento[parcela.DOCUMENTO] = parcela;
      });

      // Estado no banco emissor (registrado ou não) vem da consulta FedPay
      const registroPorDocumento = {};
      let consultaFedpayOk = false;
      if (respFedpay.status === "fulfilled" && respFedpay.value?.sucesso) {
        consultaFedpayOk = true;
        (respFedpay.value.resultado?.resultados || []).forEach((r) => {
          if (r.documento) registroPorDocumento[r.documento] = r.status;
        });
      }

      const linhas = boletosData.map((boleto) => {
        const parcela = parcelaPorDocumento[boleto.DOCUMENTO];
        const situacao = situacaoBoleto(boleto, parcela, registroPorDocumento[boleto.DOCUMENTO], consultaFedpayOk);
        return {
          documento: boleto.DOCUMENTO,
          nossoNumero: boleto.NOSSO_NUMERO || boleto.NOSSO_NUMERO_ADICIONAL || "",
          sacado: boleto.NOME_COBRADO || "Não informado",
          valor: boleto.VALOR,
          retencao: boleto.VALOR_CHEIO ?? null,
          vencimento: boleto.VENCIMENTO || parcela?.VENCIMENTO || null,
          situacao,
          cancelavel: !situacao.pago && !situacao.cancelado,
          tratavel: !situacao.pago,
        };
      });

      setDadosFatura(faturaData);
      setBoletos(linhas);

      const cancelaveis = linhas.filter((l) => l.cancelavel).length;
      const trataveis = linhas.filter((l) => l.tratavel).length;
      const partes = [];
      if (podeCancelar) partes.push(`${cancelaveis} disponível(is) para cancelamento`);
      if (podeReemitir) partes.push(`${trataveis} disponível(is) para reemissão`);

      if (podeReemitir && !consultaFedpayOk) {
        setStatus({
          type: "warning",
          message: `Fatura #${fatura} carregada, mas não foi possível consultar o banco emissor agora — a coluna Situação pode estar incompleta.`,
        });
      } else if (linhas.length === 0) {
        setStatus({ type: "warning", message: `Fatura #${fatura} não possui boletos.` });
      } else {
        setStatus({
          type: "success",
          message: `Fatura #${fatura} encontrada com ${linhas.length} boleto(s): ${partes.join(", ")}.`,
        });
      }
    } catch (err) {
      console.error("Erro ao buscar fatura:", err);
      setStatus({ type: "error", message: "Erro ao buscar fatura. Tente novamente mais tarde." });
    } finally {
      setBuscando(false);
    }
  };

  const trocarModo = (novoModo) => {
    if (novoModo === modo) return;
    setModo(novoModo);
    setSelecionados(new Set());
    setResultado(null);
    setStatus({ type: "", message: "" });
    setConfirmCancelOpen(false);
    setConfirmTratOpen(false);
  };

  const limpar = () => {
    setFatura("");
    setDadosFatura(null);
    setBoletos([]);
    setSelecionados(new Set());
    setForm(FORM_VAZIO);
    setStatus({ type: "", message: "" });
    setResultado(null);
    setConfirmCancelOpen(false);
    setConfirmTratOpen(false);
  };

  // ---------- Cancelamento ----------

  const abrirConfirmIndividual = (boleto) => {
    if (!boleto.cancelavel) {
      setStatus({ type: "error", message: "Este boleto não pode mais ser cancelado." });
      return;
    }

    setConfirmData({
      tipo: "BOLETO",
      documento: boleto.documento,
      motivo: `Cancelamento solicitado pelo usuário ${user?.nome_completo || user?.email}`,
      boletoInfo: boleto,
    });
    setConfirmCancelOpen(true);
  };

  const abrirConfirmTodos = () => {
    const cancelaveis = boletos.filter((b) => b.cancelavel);
    if (cancelaveis.length === 0) {
      setStatus({ type: "error", message: "Não há boletos para cancelar." });
      return;
    }

    setConfirmData({
      tipo: "FATURA",
      documento: fatura.trim(),
      motivo: `Cancelamento total da fatura solicitado pelo usuário ${user?.nome_completo || user?.email}`,
      quantidade: cancelaveis.length,
    });
    setConfirmCancelOpen(true);
  };

  const abrirConfirmSelecionados = () => {
    if (selecionados.size === 0) {
      setStatus({ type: "error", message: "Selecione ao menos um boleto." });
      return;
    }

    setConfirmData({
      tipo: "SELECIONADOS",
      documentos: Array.from(selecionados),
      quantidade: selecionados.size,
      motivo: `Cancelamento solicitado pelo usuário ${user?.nome_completo || user?.email}`,
    });
    setConfirmCancelOpen(true);
  };

  const marcarCancelado = (b) => ({
    ...b,
    situacao: { chave: "cancelado", rotulo: "CANCELADO" },
    cancelavel: false,
  });

  // Aplica o retorno do cancelamento em lote (status success/partial/error)
  const aplicarResultadoSelecionados = (corpo) => {
    const cancelados = new Set(corpo?.cancelados || []);
    const falhas = corpo?.falhas || [];

    if (cancelados.size > 0) {
      setBoletos((prev) => prev.map((b) => (cancelados.has(b.documento) ? marcarCancelado(b) : b)));
      const restantes = boletos.filter((b) => b.cancelavel && !cancelados.has(b.documento)).length;
      if (dadosFatura && restantes <= 0) {
        setDadosFatura((prev) => ({ ...prev, STATUS: "C" }));
      }
    }

    // Mantém selecionados apenas os que falharam, para nova tentativa
    setSelecionados(new Set(falhas.map((f) => f.documento)));

    if (falhas.length === 0 && cancelados.size > 0) {
      setStatus({ type: "success", message: `${cancelados.size} boleto(s) cancelado(s) com sucesso!` });
    } else if (cancelados.size > 0) {
      setStatus({
        type: "warning",
        message: `${cancelados.size} boleto(s) cancelado(s); ${falhas.length} falharam (${falhas
          .map((f) => f.documento)
          .join(", ")}). Eles continuam selecionados para nova tentativa.`,
      });
    } else {
      setStatus({ type: "error", message: corpo?.message || "Nenhum boleto pôde ser cancelado." });
    }
  };

  const executarCancelamento = async () => {
    setCancelando(true);
    setStatus({ type: "", message: "" });

    if (confirmData.tipo === "SELECIONADOS") {
      try {
        const response = await cancelarBoletoFedBNK({
          metodo: "SELECIONADOS",
          fatura: dadosFatura?.FATURA || fatura.trim(),
          documentos: confirmData.documentos,
          motivo: confirmData.motivo,
          mail: user?.email,
        });
        aplicarResultadoSelecionados(response);
      } catch (err) {
        console.error("Erro no cancelamento em lote:", err);
        const corpo = err.response?.data;
        if (corpo?.falhas || corpo?.cancelados) {
          aplicarResultadoSelecionados(corpo);
        } else {
          setStatus({
            type: "error",
            message: corpo?.message || corpo?.erro || err.message || "Erro ao realizar o cancelamento.",
          });
        }
      } finally {
        setCancelando(false);
        setConfirmCancelOpen(false);
      }
      return;
    }

    const payload = {
      metodo: confirmData.tipo === "BOLETO" ? "INDIVIDUAL" : "TODOS",
      fatura: dadosFatura?.FATURA || fatura.trim(),
      documento: confirmData.tipo === "BOLETO" ? confirmData.documento : null,
      motivo: confirmData.motivo,
      mail: user?.email,
    };

    try {
      const response = await cancelarBoletoFedBNK(payload);

      if (response.status === "success") {
        if (confirmData.tipo === "BOLETO") {
          const restantes = boletos.filter((b) => b.cancelavel && b.documento !== confirmData.documento).length;
          setBoletos((prev) => prev.map((b) => (b.documento === confirmData.documento ? marcarCancelado(b) : b)));
          setSelecionados((prev) => {
            const novo = new Set(prev);
            novo.delete(confirmData.documento);
            return novo;
          });
          setStatus({ type: "success", message: `Boleto ${confirmData.documento} cancelado com sucesso!` });
          if (dadosFatura && restantes <= 0) {
            setDadosFatura((prev) => ({ ...prev, STATUS: "C" }));
          }
        } else {
          setBoletos((prev) => prev.map((b) => (b.cancelavel ? marcarCancelado(b) : b)));
          setSelecionados(new Set());
          setStatus({
            type: "success",
            message: `Fatura #${fatura} e seus ${confirmData.quantidade} boleto(s) cancelados com sucesso!`,
          });
          if (dadosFatura) {
            setDadosFatura((prev) => ({ ...prev, STATUS: "C" }));
          }
        }
      } else {
        setStatus({ type: "error", message: response.message || "Erro ao realizar o cancelamento." });
      }
    } catch (err) {
      console.error("Erro no cancelamento:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.message || "Erro ao realizar o cancelamento.",
      });
    } finally {
      setCancelando(false);
      setConfirmCancelOpen(false);
    }
  };

  // ---------- Reemissão ----------

  const alternarSelecao = (documento) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(documento)) novo.delete(documento);
      else novo.add(documento);
      return novo;
    });
  };

  const alternarTodos = () => {
    const elegiveis = boletos
      .filter((b) => (emCancelamento ? b.cancelavel : b.tratavel))
      .map((b) => b.documento);
    setSelecionados((prev) => (prev.size === elegiveis.length ? new Set() : new Set(elegiveis)));
  };

  const montarAlteracoes = () => {
    const alteracoes = {};
    if (form.vencimento) alteracoes.vencimento = form.vencimento;
    if (form.valor !== "") alteracoes.valor = Number(form.valor);
    if (form.valor_cheio !== "") alteracoes.valor_cheio = Number(form.valor_cheio);
    if (isAdmin) {
      if (form.nome_cobrado.trim()) alteracoes.nome_cobrado = form.nome_cobrado.trim();
      if (form.cnpj_cobrado.trim()) alteracoes.cnpj_cobrado = form.cnpj_cobrado.trim();
      const endereco = {};
      ["cep", "endereco", "bairro", "cidade", "uf"].forEach((campo) => {
        if (form[campo].trim()) endereco[campo] = form[campo].trim();
      });
      if (Object.keys(endereco).length) alteracoes.endereco = endereco;
    }
    return alteracoes;
  };

  const resumoAlteracoes = () => {
    const alteracoes = montarAlteracoes();
    const rotulos = {
      vencimento: "Vencimento",
      valor: "Valor",
      valor_cheio: "Retenção",
      nome_cobrado: "Nome cobrado",
      cnpj_cobrado: "CNPJ/CPF cobrado",
      endereco: "Endereço (cadastro)",
    };
    return Object.keys(alteracoes).map((campo) => ({
      rotulo: rotulos[campo],
      valor: campo === "endereco"
        ? Object.values(alteracoes.endereco).join(", ")
        : campo === "valor" || campo === "valor_cheio"
          ? formatarMoeda(alteracoes[campo])
          : String(alteracoes[campo]),
    }));
  };

  const abrirConfirmTratamento = () => {
    if (selecionados.size === 0) {
      setStatus({ type: "error", message: "Selecione ao menos um boleto." });
      return;
    }
    setConfirmTratOpen(true);
  };

  const executarTratamento = async () => {
    setTratando(true);
    setStatus({ type: "", message: "" });
    setResultado(null);

    const alteracoes = montarAlteracoes();
    const payload = {
      fatura: fatura.trim(),
      boletos: Array.from(selecionados).map((documento) => ({ documento, alteracoes })),
    };

    try {
      const response = await enviarTratamento(payload);
      const corpo = response?.resultado || {};
      setSelecionados(new Set());
      setForm(FORM_VAZIO);
      // Recarrega a fatura para refletir os documentos novos e então mostra
      // o resultado do tratamento (buscarFatura limpa resultado/status)
      await buscarFatura();
      setResultado(corpo);
      setStatus({
        type: corpo.status === "success" ? "success" : "warning",
        message: corpo.resumo || "Tratamento concluído.",
      });
    } catch (err) {
      console.error("Erro no tratamento:", err);
      const corpo = err.response?.data?.resultado;
      if (corpo) setResultado(corpo);
      setStatus({
        type: "error",
        message: err.response?.data?.erro || corpo?.resumo || err.message || "Erro ao executar o tratamento.",
      });
    } finally {
      setTratando(false);
      setConfirmTratOpen(false);
    }
  };

  const atualizarCampo = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  // Digitou o novo valor: sugere a retenção (continua editável no campo)
  const atualizarValor = (e) => {
    const valor = e.target.value;
    const v = Number(valor);
    const retencao = v > LIMITE_RETENCAO
      ? (Math.round(v * PERCENTUAL_RETENCAO * 100) / 100).toFixed(2)
      : "";
    setForm((prev) => ({ ...prev, valor, valor_cheio: retencao }));
  };

  if (!isAuthenticated) {
    return (
      <S.ErrorContainer>
        <p>Você precisa estar logado para acessar esta página.</p>
      </S.ErrorContainer>
    );
  }

  if (!podeAcessar) {
    return (
      <S.ErrorContainer>
        <p>Seu nível de acesso não permite acessar esta funcionalidade.</p>
      </S.ErrorContainer>
    );
  }

  const cancelaveis = boletos.filter((b) => b.cancelavel);
  const trataveis = boletos.filter((b) => b.tratavel);
  const elegiveis = emCancelamento ? cancelaveis : trataveis;
  const alteracoesResumo = resumoAlteracoes();

  return (
    <PageLayout
      title="Cancelamento/Reemissão de Boletos"
      subtitle="Consulte uma fatura para cancelar boletos ou corrigir dados e reemitir com número novo"
      icon={<GiCancel />}
    >
      <S.Container>
        <S.Card>
          {/* Abas de modo */}
          {podeCancelar && podeReemitir && (
            <S.ModeTabs>
              <S.ModeTab
                $active={emCancelamento}
                onClick={() => trocarModo("cancelamento")}
                disabled={ocupado}
              >
                <GiCancel /> Cancelamento
              </S.ModeTab>
              <S.ModeTab
                $active={!emCancelamento}
                onClick={() => trocarModo("reemissao")}
                disabled={ocupado}
              >
                <FaHammer /> Reemissão / Atualização
              </S.ModeTab>
            </S.ModeTabs>
          )}

          {/* Formulário de Consulta */}
          <S.SearchSection>
            <S.SearchField>
              <S.Label>Número da Fatura</S.Label>
              <S.SearchInputGroup>
                <S.Input
                  type="text"
                  value={fatura}
                  onChange={(e) => setFatura(e.target.value)}
                  placeholder="Ex: 162028"
                  disabled={ocupado}
                  onKeyPress={(e) => e.key === "Enter" && buscarFatura()}
                />
                <S.SearchButton onClick={buscarFatura} disabled={ocupado || !fatura.trim()}>
                  {buscando ? <FaSpinner className="spinner" /> : <FaSearch />}
                  Consultar
                </S.SearchButton>
              </S.SearchInputGroup>
            </S.SearchField>
          </S.SearchSection>

          {/* Alertas */}
          {status.message && (
            <S.Alert $type={status.type}>
              <span>{status.message}</span>
            </S.Alert>
          )}

          {/* Informações da Fatura */}
          {dadosFatura && (
            <S.FaturaInfo>
              <S.InfoHeader>
                <S.InfoTitle>Informações da Fatura</S.InfoTitle>
                {emCancelamento && cancelaveis.length > 0 && (
                  <S.CancelAllButton onClick={abrirConfirmTodos} disabled={ocupado}>
                    <GiTrashCan /> Cancelar fatura e boletos ({cancelaveis.length})
                  </S.CancelAllButton>
                )}
              </S.InfoHeader>
              <S.InfoGrid>
                <S.InfoItem>
                  <S.InfoLabel>Fatura</S.InfoLabel>
                  <S.InfoValue>#{dadosFatura.FATURA}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Vencimento</S.InfoLabel>
                  <S.InfoValue>{formatarData(dadosFatura.VENCIMENTO)}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Status</S.InfoLabel>
                  <S.StatusBadge $status={dadosFatura.STATUS}>
                    {dadosFatura.STATUS === "A" ? "ATIVA" : dadosFatura.STATUS === "C" ? "CANCELADA" : "BAIXADA"}
                  </S.StatusBadge>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Qtd. Boletos</S.InfoLabel>
                  <S.InfoValue>{dadosFatura.QTD_BOLETOS || boletos.length}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>{emCancelamento ? "Disponíveis p/ cancelamento" : "Disponíveis p/ reemissão"}</S.InfoLabel>
                  <S.InfoValue>{emCancelamento ? cancelaveis.length : trataveis.length}</S.InfoValue>
                </S.InfoItem>
              </S.InfoGrid>
            </S.FaturaInfo>
          )}

          {/* Tabela de Boletos */}
          {boletos.length > 0 && (
            <S.BoletosSection>
              <S.BoletosTitle>Boletos da Fatura</S.BoletosTitle>
              <S.TableWrapper>
                <S.Table>
                  <thead>
                    <tr>
                      <th style={{ width: "44px" }}>
                        <input
                          type="checkbox"
                          checked={elegiveis.length > 0 && selecionados.size === elegiveis.length}
                          onChange={alternarTodos}
                          disabled={ocupado || elegiveis.length === 0}
                          title="Selecionar todos"
                        />
                      </th>
                      <th>Nosso Número</th>
                      <th>Documento</th>
                      <th>Sacado</th>
                      <th>Valor</th>
                      <th>Retenção</th>
                      <th>Vencimento</th>
                      <th>Situação</th>
                      {emCancelamento && <th style={{ width: "80px" }}>Ações</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {boletos.map((boleto) => (
                      <tr key={boleto.documento}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selecionados.has(boleto.documento)}
                            onChange={() => alternarSelecao(boleto.documento)}
                            disabled={ocupado || (emCancelamento ? !boleto.cancelavel : !boleto.tratavel)}
                            title={
                              emCancelamento
                                ? boleto.cancelavel
                                  ? "Selecionar para cancelamento"
                                  : "Este boleto não pode ser cancelado"
                                : boleto.tratavel
                                  ? "Selecionar para reemissão"
                                  : "Boleto pago não pode ser retrabalhado"
                            }
                          />
                        </td>
                        <S.MonoCell>{boleto.nossoNumero}</S.MonoCell>
                        <S.MonoCell>{boleto.documento}</S.MonoCell>
                        <td>{boleto.sacado}</td>
                        <td>{formatarMoeda(boleto.valor)}</td>
                        <td>{boleto.retencao != null ? formatarMoeda(boleto.retencao) : "—"}</td>
                        <td>{formatarData(boleto.vencimento)}</td>
                        <td>
                          <S.StatusBadge $status={boleto.situacao.chave}>{boleto.situacao.rotulo}</S.StatusBadge>
                        </td>
                        {emCancelamento && (
                          <td>
                            <S.IconButton
                              onClick={() => abrirConfirmIndividual(boleto)}
                              disabled={ocupado || !boleto.cancelavel}
                              title={boleto.cancelavel ? "Cancelar boleto" : "Este boleto não pode ser cancelado"}
                            >
                              <GiCancel />
                            </S.IconButton>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            </S.BoletosSection>
          )}

          {/* Formulário de alterações (reemissão) */}
          {!emCancelamento && trataveis.length > 0 && (
            <S.AlteracoesSection>
              <S.AlteracoesTitulo>Alterações a aplicar</S.AlteracoesTitulo>
              <S.AlteracoesSubtitulo>
                Preencha apenas o que deseja alterar — os campos vazios mantêm o valor atual de cada boleto.
                As alterações valem para todos os boletos selecionados ({selecionados.size}).
              </S.AlteracoesSubtitulo>
              <S.FormGrid>
                <S.FormField>
                  <S.Label>Novo vencimento</S.Label>
                  <S.Input type="date" value={form.vencimento} onChange={atualizarCampo("vencimento")} disabled={tratando} />
                </S.FormField>
                <S.FormField>
                  <S.Label>Novo valor (R$)</S.Label>
                  <S.Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.valor}
                    onChange={atualizarValor}
                    disabled={tratando}
                    placeholder="Manter valor atual"
                  />
                </S.FormField>
                <S.FormField>
                  <S.Label>Retenção (R$)</S.Label>
                  <S.Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.valor_cheio}
                    onChange={atualizarCampo("valor_cheio")}
                    disabled={tratando}
                    placeholder="Manter retenção atual"
                  />
                </S.FormField>
                {isAdmin && (
                  <>
                    <S.AdminDivider>Somente administradores</S.AdminDivider>
                    <S.FormField>
                      <S.Label>Nome cobrado</S.Label>
                      <S.Input value={form.nome_cobrado} onChange={atualizarCampo("nome_cobrado")} disabled={tratando} placeholder="Manter nome atual" />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>CNPJ/CPF cobrado</S.Label>
                      <S.Input value={form.cnpj_cobrado} onChange={atualizarCampo("cnpj_cobrado")} disabled={tratando} placeholder="Manter documento atual" />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>CEP (cadastro do pagador)</S.Label>
                      <S.Input value={form.cep} onChange={atualizarCampo("cep")} disabled={tratando} placeholder="00000-000" />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>Endereço</S.Label>
                      <S.Input value={form.endereco} onChange={atualizarCampo("endereco")} disabled={tratando} placeholder="Manter endereço atual" />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>Bairro</S.Label>
                      <S.Input value={form.bairro} onChange={atualizarCampo("bairro")} disabled={tratando} />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>Cidade</S.Label>
                      <S.Input value={form.cidade} onChange={atualizarCampo("cidade")} disabled={tratando} />
                    </S.FormField>
                    <S.FormField>
                      <S.Label>UF</S.Label>
                      <S.Input value={form.uf} onChange={atualizarCampo("uf")} disabled={tratando} maxLength={2} placeholder="RJ" />
                    </S.FormField>
                  </>
                )}
              </S.FormGrid>
            </S.AlteracoesSection>
          )}

          {/* Resultado do tratamento */}
          {!emCancelamento && resultado?.pendencias?.length > 0 && (
            <S.ResultadoSection>
              <S.BoletosTitle>Pendências</S.BoletosTitle>
              <S.TableWrapper>
                <S.Table>
                  <thead>
                    <tr>
                      <th>Documento</th>
                      <th>Nome Cobrado</th>
                      <th>Problema / Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.pendencias.map((p, i) => (
                      <tr key={`${p.documento}-${i}`}>
                        <S.MonoCell>{p.documento}</S.MonoCell>
                        <td>{p.nome_cobrado || "—"}</td>
                        <td>
                          <S.PendenciaProblema>{p.problema}</S.PendenciaProblema>
                          <S.PendenciaAcao>{p.acao}</S.PendenciaAcao>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            </S.ResultadoSection>
          )}

          {!emCancelamento && resultado?.boletos_recriados?.length > 0 && (
            <S.ResultadoSection>
              <S.BoletosTitle>Boletos Recriados</S.BoletosTitle>
              <S.TableWrapper>
                <S.Table>
                  <thead>
                    <tr>
                      <th>Documento anterior</th>
                      <th>Novo documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.boletos_recriados.map((r) => (
                      <tr key={r.documento_novo}>
                        <S.MonoCell>{r.documento_antigo}</S.MonoCell>
                        <S.MonoCell>{r.documento_novo}</S.MonoCell>
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            </S.ResultadoSection>
          )}

          {/* Botões de ação */}
          {(dadosFatura || boletos.length > 0) && (
            <S.ActionsFooter>
              <S.SecondaryButton onClick={limpar} disabled={ocupado}>
                Limpar consulta
              </S.SecondaryButton>
              {emCancelamento ? (
                <S.DangerButton onClick={abrirConfirmSelecionados} disabled={ocupado || selecionados.size === 0}>
                  {cancelando ? <FaSpinner className="spinner" /> : <GiCancel />}
                  Cancelar selecionados ({selecionados.size})
                </S.DangerButton>
              ) : (
                <S.PrimaryButton onClick={abrirConfirmTratamento} disabled={ocupado || selecionados.size === 0}>
                  {tratando ? <FaSpinner className="spinner" /> : <FaHammer />}
                  Reemitir selecionados ({selecionados.size})
                </S.PrimaryButton>
              )}
            </S.ActionsFooter>
          )}

          {/* Rodapé */}
          <S.Footer>
            <small>
              Solicitante: <strong>{user?.nome_completo || user?.usuario || user?.email || "Usuário"}</strong>
            </small>
          </S.Footer>
        </S.Card>

        {/* Modal de Confirmação — Cancelamento */}
        {confirmCancelOpen && (
          <S.ModalOverlay onClick={() => !cancelando && setConfirmCancelOpen(false)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader $variant="danger">
                <GiCancel size={24} />
                <h3>Confirmar cancelamento</h3>
                <S.ModalClose onClick={() => !cancelando && setConfirmCancelOpen(false)} disabled={cancelando}>
                  <FaTimes />
                </S.ModalClose>
              </S.ModalHeader>

              <S.ModalBody>
                {confirmData.tipo === "BOLETO" && (
                  <>
                    <p>
                      Você está prestes a cancelar o <strong>boleto</strong>{' '}
                      <S.Highlight>{confirmData.documento}</S.Highlight>
                    </p>
                    <p>
                      <strong>Valor:</strong> {formatarMoeda(confirmData.boletoInfo?.valor)}
                    </p>
                  </>
                )}
                {confirmData.tipo === "SELECIONADOS" && (
                  <>
                    <p>
                      Você está prestes a cancelar <strong>{confirmData.quantidade} boleto(s) selecionado(s)</strong>{' '}
                      da fatura <S.Highlight>#{fatura}</S.Highlight>:
                    </p>
                    <ul>
                      {confirmData.documentos.map((doc) => (
                        <li key={doc}>
                          <S.Highlight>{doc}</S.Highlight>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {confirmData.tipo === "FATURA" && (
                  <p>
                    Você está prestes a cancelar <strong>TODOS os {confirmData.quantidade} boletos</strong>{' '}
                    da fatura <S.Highlight>#{confirmData.documento}</S.Highlight>.
                  </p>
                )}

                <S.WarningBox>
                  <FaExclamationTriangle size={20} />
                  <div>
                    <strong>Atenção:</strong> Esta ação é <strong>irreversível</strong> e não pode ser desfeita.
                  </div>
                </S.WarningBox>
              </S.ModalBody>

              <S.ModalActions>
                <S.SecondaryButton onClick={() => setConfirmCancelOpen(false)} disabled={cancelando}>
                  Voltar
                </S.SecondaryButton>
                <S.DangerButton onClick={executarCancelamento} disabled={cancelando}>
                  {cancelando ? <FaSpinner className="spinner" /> : "Confirmar cancelamento"}
                </S.DangerButton>
              </S.ModalActions>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {/* Modal de Confirmação — Reemissão */}
        {confirmTratOpen && (
          <S.ModalOverlay onClick={() => !tratando && setConfirmTratOpen(false)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader>
                <FaHammer size={22} />
                <h3>Confirmar reemissão</h3>
                <S.ModalClose onClick={() => !tratando && setConfirmTratOpen(false)} disabled={tratando}>
                  <FaTimes />
                </S.ModalClose>
              </S.ModalHeader>

              <S.ModalBody>
                <p>
                  Você está prestes a retrabalhar <strong>{selecionados.size} boleto(s)</strong> da fatura{" "}
                  <S.Highlight>#{fatura}</S.Highlight>:
                </p>
                <ul>
                  {Array.from(selecionados).map((doc) => (
                    <li key={doc}>
                      <S.Highlight>{doc}</S.Highlight>
                    </li>
                  ))}
                </ul>
                {alteracoesResumo.length > 0 ? (
                  <>
                    <p><strong>Alterações aplicadas a todos:</strong></p>
                    <ul>
                      {alteracoesResumo.map((a) => (
                        <li key={a.rotulo}>
                          {a.rotulo}: <strong>{a.valor}</strong>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>Sem alterações de dados — os boletos serão reemitidos com os dados atuais.</p>
                )}

                <S.WarningBox>
                  <FaExclamationTriangle size={20} />
                  <div>
                    <strong>Atenção:</strong> cada boleto selecionado será <strong>cancelado no banco emissor</strong> e
                    recriado com <strong>número novo</strong>, seguido da reemissão. Esta ação é irreversível.
                  </div>
                </S.WarningBox>
              </S.ModalBody>

              <S.ModalActions>
                <S.SecondaryButton onClick={() => setConfirmTratOpen(false)} disabled={tratando}>
                  Voltar
                </S.SecondaryButton>
                <S.PrimaryButton onClick={executarTratamento} disabled={tratando}>
                  {tratando ? <FaSpinner className="spinner" /> : "Confirmar reemissão"}
                </S.PrimaryButton>
              </S.ModalActions>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default CancelamentoReemissaoFedBnk;
