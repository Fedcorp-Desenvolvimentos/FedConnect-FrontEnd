import React, { useMemo, useState } from "react";
import "../styles/ConsultasHome.css";
import "../styles/OperacionalCancelamento.css";
import { useAuth } from "../../context/AuthContext";

const OperacionalCancelamento = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const [tipo, setTipo] = useState("fatura");
  const [documento, setDocumento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [anexo, setAnexo] = useState(null);

  const [status, setStatus] = useState({ type: "", message: "" }); // success | error | info
  const [sending, setSending] = useState(false);

  const currentUserType = user?.nivel_acesso;

  const podeAcessar = useMemo(() => {
    
    const niveis = ["admin", "usuario", "comercial"];
    return niveis.includes(currentUserType);
  }, [currentUserType]);

  const limpar = () => {
    setTipo("fatura");
    setDocumento("");
    setMotivo("");
    setObservacoes("");
    setAnexo(null);
    setStatus({ type: "", message: "" });
  };

  const validar = () => {
    if (!tipo) return "Selecione se é fatura ou boleto.";
    if (!documento.trim()) return "Informe o número da fatura/boleto.";
    if (documento.trim().length < 5) return "O número parece curto demais. Confere aí antes de cancelar o universo.";
    if (!motivo.trim()) return "Informe o motivo do cancelamento.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const erro = validar();
    if (erro) {
      setStatus({ type: "error", message: erro });
      return;
    }

    const payload = {
      tipo, // "fatura" | "boleto"
      documento: documento.trim(),
      motivo: motivo.trim(),
      observacoes: observacoes.trim(),
      solicitado_por: user?.email || user?.usuario || "usuario",
      
    };

    try {
      setSending(true);
            // Simulação:
      await new Promise((r) => setTimeout(r, 500));

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
                    <option value="fatura">Fatura</option>
                    <option value="boleto">Boleto</option>
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
                <label>Motivo</label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: pagamento duplicado, cobrança indevida, erro de emissão..."
                  autoComplete="off"
                />
              </div>

              <div className="op-field">
                <label>Observações (opcional)</label>
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
