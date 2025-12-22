import React, { useMemo, useState } from "react";
import "../styles/ConsultasHome.css";
import "../styles/OperacionalCancelamento.css";
import { useAuth } from "../../context/AuthContext";
import { triggerWebhook } from "../../services/boletofedbnk";

const OperacionalCancelamento = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const [tipo, setTipo] = useState("FATURA");
  const [documento, setDocumento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [anexo, setAnexo] = useState(null);

  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const currentUserType = user?.nivel_acesso;

  const podeAcessar = useMemo(() => {
    const niveis = ["admin", "usuario", "comercial", "faturamento"];
    return niveis.includes(currentUserType);
  }, [currentUserType]);

  const limpar = () => {
    setTipo("FATURA");
    setDocumento("");
    setMotivo("");
    setObservacoes("");
    setAnexo(null);
    setStatus({ type: "", message: "" });
    setConfirmOpen(false);
  };

  const validar = () => {
    if (!tipo) return "Selecione se é fatura ou boleto.";
    if (!documento.trim()) return "Informe o número da fatura/boleto.";
    if (documento.trim().length < 5) return "O número parece curto demais. Confere aí antes de cancelar o universo.";
    return "";
  };

  const closeConfirm = () => {
    if (sending) return;
    setConfirmOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const erro = validar();
    if (erro) {
      setStatus({ type: "error", message: erro });
      return;
    }

    setConfirmOpen(true);
  };

  const confirmarCancelamento = async () => {
    setStatus({ type: "", message: "" });

    const payload = {
      method: tipo,
      number: documento.trim(),
      motivo: observacoes.trim(),
      mail: user?.email || "danielmello@condomed.com.br",
    };

    try {
      setSending(true);
      await triggerWebhook(payload);

      setStatus({
        type: "success",
        message: "Cancelamento registrado com sucesso!",
      });

      console.log("CANCELAMENTO_PAYLOAD:", payload);
      setConfirmOpen(false);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Não consegui registrar a solicitação. Tenta de novo — ou ameaça com um log bem bonito.",
      });
      console.error(err);
      setConfirmOpen(false);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="home-grid">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="home-grid">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  if (!podeAcessar) {
    return (
      <div className="home-grid">
        <p>Seu nível de acesso não permite acessar esta funcionalidade.</p>
      </div>
    );
  }

  return (
    <div className="home-grid">
      
      {confirmOpen && (
        <div
          className="op-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="op-confirm-title"
        >
          <div className="op-modal">
            <div className="op-modal-header">
              <i className="bi bi-exclamation-octagon-fill"></i>
              <h3 id="op-confirm-title">Confirmar cancelamento</h3>

              <button
                type="button"
                className="op-modal-close"
                onClick={closeConfirm}
                aria-label="Fechar"
                disabled={sending}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="op-modal-body">
              <p>
                Você está prestes a cancelar{" "}
                <b>{tipo === "FATURA" ? "a fatura" : "o boleto"}</b>{" "}
                <span className="op-mono">
                  {documento.trim() ? `#${documento.trim()}` : ""}
                </span>
                .
              </p>

              <div className="op-modal-warning">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>
                  <b>Atenção:</b> essa ação é <b>irreversível</b>.
                </div>
              </div>

              {observacoes.trim() ? (
                <div className="op-modal-preview">
                  <small>Motivo informado:</small>
                  <div className="op-modal-preview-box">{observacoes.trim()}</div>
                </div>
              ) : (
                <div className="op-modal-preview">
                  <small>Motivo informado:</small>
                  <div className="op-modal-preview-box op-muted">Não informado</div>
                </div>
              )}
            </div>

            <div className="op-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={closeConfirm}
                disabled={sending}
              >
                Voltar
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={confirmarCancelamento}
                disabled={sending}
                title="Confirmar cancelamento"
              >
                {sending ? "Confirmando..." : "Confirmar cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main>
        <div className="container02">
          <h1 className="consultas-title">
            <i className="bi bi-x-octagon-fill"></i> Cancelamentos FedBnk
          </h1>

          <div className="op-card">
            <form onSubmit={handleSubmit} className="op-form">
              <div className="op-row">
                <div className="op-field">
                  <label>Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    disabled={sending}
                  >
                    <option value="FATURA">Fatura</option>
                    <option value="BOLETO">Boleto</option>
                  </select>
                </div>

                <div className="op-field">
                  <label>Número</label>
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Ex: 341910"
                    autoComplete="off"
                    disabled={sending}
                  />
                </div>
              </div>

              <div className="op-field">
                <label>Motivo (opcional)</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Detalhes adicionais que ajudem o time quando realizarem consultas."
                  rows={4}
                  disabled={sending}
                />
              </div>

              {status?.message ? (
                <div className={`op-alert ${status.type}`}>
                  <i
                    className={`bi ${
                      status.type === "success"
                        ? "bi-check-circle-fill"
                        : "bi-exclamation-triangle-fill"
                    }`}
                  ></i>
                  <span>{status.message}</span>
                </div>
              ) : null}

              <div className="op-actions">
                <button type="button" className="btn-secondary" onClick={limpar} disabled={sending}>
                  Limpar
                </button>

                <button type="submit" className="btn-primary" disabled={sending}>
                  {sending ? "Registrando..." : "Registrar Solicitação"}
                </button>
              </div>

              <div className="op-footer">
                <small>
                  Solicitante: <b>{user?.nome || user?.usuario || user?.email || "Usuário"}</b>
                </small>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperacionalCancelamento;
