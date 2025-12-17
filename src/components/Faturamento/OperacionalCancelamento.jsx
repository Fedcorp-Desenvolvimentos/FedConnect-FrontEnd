import React, { useMemo, useState } from "react";
import "../styles/ConsultasHome.css";
import "../styles/OperacionalCancelamento.css";
import { useAuth } from "../../context/AuthContext";
import {triggerWebhook} from "../../services/boletofedbnk"

const OperacionalCancelamento = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const [tipo, setTipo] = useState("FATURA");
  const [documento, setDocumento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [anexo, setAnexo] = useState(null);

  const [status, setStatus] = useState({ type: "", message: "" }); 
  const [sending, setSending] = useState(false);

  const currentUserType = user?.nivel_acesso;

  const podeAcessar = useMemo(() => {
    
    const niveis = ["admin", "usuario", "comercial", "faturamento"];
    return niveis.includes(currentUserType);
  }, [currentUserType]);

  const limpar = () => {
    setTipo("FATURA");
    setDocumento("");
    setObservacoes("");
    setAnexo(null);
    setStatus({ type: "", message: "" });
  };

  const validar = () => {
    if (!tipo) return "Selecione se é fatura ou boleto.";
    if (!documento.trim()) return "Informe o número da fatura/boleto.";
    if (documento.trim().length < 5) return "O número parece curto demais. Confere aí antes de cancelar o universo.";
    return "";
  };
console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const erro = validar();
    if (erro) {
      setStatus({ type: "error", message: erro });
      return;
    }

    const payload = {
      method: tipo,
      number: documento.trim(),
      motivo: observacoes.trim(),
      mail: user?.email || "danielmello@condomed.com.br",
      
    };

    try {
      setSending(true);
      const response = await triggerWebhook(payload);
     

      setStatus({
        type: "success",
        message: "Cancelamento registrado com sucesso!",
      });

      console.log("CANCELAMENTO_PAYLOAD:", payload);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Não consegui registrar a solicitação. Tenta de novo — ou ameaça com um log bem bonito.",
      });
      console.error(err);
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
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
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
                />
              </div>

             

              {status?.message ? (
                <div className={`op-alert ${status.type}`}>
                  <i className={`bi ${status.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
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
