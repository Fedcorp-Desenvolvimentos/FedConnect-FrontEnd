import React, { useMemo, useState, useEffect } from "react";
import "../../styles/OperacionalCancelamento.css";
import { useAuth } from "../../context/AuthContext";
import { getFaturamento } from "../../services/consultaFatura";
import { cancelarBoletoFedBNK } from "../../services/boletofedbnk";
import { GiCancel, GiCheckMark, GiTrashCan } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa";
import PageLayout from "../PageLayout/PageLayout";

const OperacionalCancelamento = () => {
  const { user, isAuthenticated } = useAuth();

  const [fatura, setFatura] = useState("");
  const [dadosFatura, setDadosFatura] = useState(null);
  const [boletos, setBoletos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  
  const [status, setStatus] = useState({ type: "", message: "" });
  const [cancelando, setCancelando] = useState(false);
  const [boletoCancelando, setBoletoCancelando] = useState(null);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ tipo: "", documento: "", motivo: "" });

  const currentUserType = user?.nivel_acesso;

  const podeAcessar = useMemo(() => {
    const niveis = ["admin", "usuario", "comercial", "faturamento"];
    return niveis.includes(currentUserType);
  }, [currentUserType]);

  // Função auxiliar para verificar se o boleto está ativo
  const isBoletoAtivo = (boleto, parcela) => {
    // Se tem baixa (quitado)
    if (parcela && parcela.DT_BAIXA !== null) return false;
    
    // Se está cancelado
    if (boleto.STATUS_BOLETO === "C") return false;
    
    // Se está quitado pelo campo QUITADO
    if (boleto.QUITADO === "S") return false;
    
    // Se tem data de cancelamento
    if (boleto.DT_CANCEL !== null) return false;
    
    // Se está baixado pelo status B
    if (parcela && parcela.STATUS === "B") return false;
    
    return true;
  };

  // Buscar fatura e seus boletos
  const buscarFatura = async () => {
    if (!fatura.trim()) {
      setStatus({ type: "error", message: "Informe o número da fatura." });
      return;
    }

    setBuscando(true);
    setStatus({ type: "", message: "" });
    setDadosFatura(null);
    setBoletos([]);

    try {
      const response = await getFaturamento({ fatura: fatura.trim() });

      if (!response?.resultado?.data || response.resultado.data.length === 0) {
        setStatus({ type: "error", message: "Fatura não encontrada." });
        return;
      }

      const faturaData = response.resultado.data[0];
      const boletosData = faturaData.BOLETOS || [];
      const parcelasData = faturaData.PARCELAS || [];
      const baixasData = faturaData.BAIXAS || [];

      // Criar um mapa de parcelas por documento
      const parcelaPorDocumento = {};
      parcelasData.forEach(parcela => {
        if (parcela.DOCUMENTO) {
          parcelaPorDocumento[parcela.DOCUMENTO] = parcela;
        }
      });

      // Mapear boletos
      const boletosAtivos = [];
      const boletosCanceladosOuQuitados = [];

      boletosData.forEach(boleto => {
        const parcela = parcelaPorDocumento[boleto.DOCUMENTO];
        const ativo = isBoletoAtivo(boleto, parcela);
        
        const boletoFormatado = {
          documento: boleto.DOCUMENTO,
          nossoNumero: boleto.NOSSO_NUMERO || boleto.NOSSO_NUMERO_ADICIONAL || "",
          valor: boleto.VALOR,
          sacado: boleto.NOME_COBRADO || "Não informado",
          status: ativo ? "ATIVO" : (parcela?.DT_BAIXA ? "QUITADO" : "CANCELADO"),
          dataEvento: parcela?.DT_BAIXA || boleto.DT_CANCEL,
          desabilitado: !ativo
        };
        
        if (ativo) {
          boletosAtivos.push(boletoFormatado);
        } else {
          boletosCanceladosOuQuitados.push(boletoFormatado);
        }
      });

      setDadosFatura({
        ...faturaData,
        totalBoletos: boletosData.length,
        boletosAtivos: boletosAtivos.length,
        boletosIndisponiveis: boletosCanceladosOuQuitados.length
      });
      
      setBoletos(boletosAtivos);
      
      if (boletosAtivos.length === 0) {
        setStatus({ 
          type: "warning", 
          message: `Fatura #${fatura} não possui boletos ativos para cancelamento. ${boletosCanceladosOuQuitados.length} boleto(s) já foram quitados ou cancelados.` 
        });
      } else {
        setStatus({ 
          type: "success", 
          message: `Fatura #${fatura} encontrada com ${boletosAtivos.length} boleto(s) ativo(s) para cancelamento.` 
        });
      }
      
    } catch (err) {
      console.error("Erro ao buscar fatura:", err);
      setStatus({ 
        type: "error", 
        message: "Erro ao buscar fatura. Tente novamente mais tarde." 
      });
    } finally {
      setBuscando(false);
    }
  };

  // Abrir modal de confirmação para cancelamento individual
  const abrirConfirmIndividual = (boleto) => {
    if (boleto.desabilitado) {
      setStatus({ type: "error", message: "Este boleto não pode mais ser cancelado." });
      return;
    }
    
    setConfirmData({
      tipo: "BOLETO",
      documento: boleto.documento,
      nossoNumero: boleto.nossoNumero,
      motivo: `Cancelamento solicitado pelo usuário ${user?.nome_completo || user?.email}`,
      boletoInfo: boleto
    });
    setConfirmOpen(true);
  };

  // Abrir modal de confirmação para cancelar todos
  const abrirConfirmTodos = () => {
    if (boletos.length === 0) {
      setStatus({ type: "error", message: "Não há boletos para cancelar." });
      return;
    }
    
    setConfirmData({
      tipo: "FATURA",
      documento: fatura.trim(),
      motivo: `Cancelamento total da fatura solicitado pelo usuário ${user?.nome_completo || user?.email}`,
      quantidade: boletos.length
    });
    setConfirmOpen(true);
  };

  // Executar cancelamento
  const executarCancelamento = async () => {
    setCancelando(true);
    setStatus({ type: "", message: "" });
    
    // Payload: SEMPRE envia fatura e documento
    const payload = {
      metodo: confirmData.tipo === "BOLETO" ? "INDIVIDUAL" : "TODOS",
      fatura: dadosFatura?.FATURA || fatura.trim(),  // PEGA A FATURA CORRETA dos dados
      documento: confirmData.tipo === "BOLETO" ? confirmData.documento : null,
      motivo: confirmData.motivo,
      mail: user?.email || "danielmello@condomed.com.br",
    };
        
    try {
      const response = await cancelarBoletoFedBNK(payload);
      
      if (response.status === "success") {
        if (confirmData.tipo === "BOLETO") {
          setBoletos(prev => prev.filter(b => b.documento !== confirmData.documento));
          setStatus({ 
            type: "success", 
            message: `Boleto ${confirmData.documento} cancelado com sucesso!` 
          });
        } else {
          setBoletos([]);
          setStatus({ 
            type: "success", 
            message: `Fatura #${fatura} e seus ${confirmData.quantidade} boleto(s) cancelados com sucesso!` 
          });
        }
        
        if (dadosFatura) {
          setDadosFatura(prev => ({ ...prev, STATUS: "C" }));
        }
      } else {
        setStatus({ 
          type: "error", 
          message: response.message || "Erro ao realizar o cancelamento." 
        });
      }
      
      setConfirmOpen(false);
      
    } catch (err) {
      console.error("Erro no cancelamento:", err);
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || err.message || "Erro ao realizar o cancelamento." 
      });
    } finally {
      setCancelando(false);
      setBoletoCancelando(null);
    }
  };

  const limpar = () => {
    setFatura("");
    setDadosFatura(null);
    setBoletos([]);
    setStatus({ type: "", message: "" });
    setConfirmOpen(false);
    setBoletoCancelando(null);
  };

  const closeConfirm = () => {
    if (cancelando) return;
    setConfirmOpen(false);
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

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
    <PageLayout
      title="Cancelamentos FedBnk"
      subtitle="Consulte uma fatura e cancele boletos individualmente ou em lote."
      icon={<GiCancel />}
      className="operacional-page"
    >
      <div className="op-container">
        
        {/* Modal de Confirmação */}
        {confirmOpen && (
          <div className="op-modal-overlay" onClick={closeConfirm}>
            <div className="op-modal" onClick={(e) => e.stopPropagation()}>
              <div className="op-modal-header">
                <GiCancel size={24} />
                <h3>Confirmar cancelamento</h3>
                <button className="op-modal-close" onClick={closeConfirm} disabled={cancelando}>
                  ✕
                </button>
              </div>

              <div className="op-modal-body">
                {confirmData.tipo === "BOLETO" ? (
                  <>
                    <p>
                      Você está prestes a cancelar o <strong>boleto</strong>{' '}
                      <span className="op-highlight">{confirmData.documento}</span>
                    </p>
                    <p>
                      <strong>Valor:</strong> {formatarMoeda(confirmData.boletoInfo?.valor)}
                    </p>
                  </>
                ) : (
                  <p>
                    Você está prestes a cancelar <strong>TODOS os {confirmData.quantidade} boletos</strong>{' '}
                    da fatura <span className="op-highlight">#{confirmData.documento}</span>.
                  </p>
                )}

                <div className="op-modal-warning">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <strong>Atenção:</strong> Esta ação é <strong>irreversível</strong> e não pode ser desfeita.
                  </div>
                </div>
              </div>

              <div className="op-modal-actions">
                <button className="btn-secondary" onClick={closeConfirm} disabled={cancelando}>
                  Voltar
                </button>
                <button className="btn-danger" onClick={executarCancelamento} disabled={cancelando}>
                  {cancelando ? <FaSpinner className="spinner" /> : "Confirmar cancelamento"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulário de Consulta */}
        <div className="op-card">
          <div className="op-search-section">
            <div className="op-search-field">
              <label>Número da Fatura</label>
              <div className="op-search-input-group">
                <input
                  type="text"
                  value={fatura}
                  onChange={(e) => setFatura(e.target.value)}
                  placeholder="Ex: 162028"
                  autoComplete="off"
                  disabled={buscando || cancelando}
                  onKeyPress={(e) => e.key === 'Enter' && buscarFatura()}
                />
                <button 
                  className="btn-primary" 
                  onClick={buscarFatura}
                  disabled={buscando || !fatura.trim()}
                >
                  {buscando ? <FaSpinner className="spinner" /> : "Consultar"}
                </button>
              </div>
            </div>
          </div>

          {status.message && (
            <div className={`op-alert ${status.type}`}>
              <span>{status.message}</span>
            </div>
          )}

          {/* Informações da Fatura */}
          {dadosFatura && (
            <div className="op-fatura-info">
              <div className="info-header">
                <h3>Informações da Fatura</h3>
                {boletos.length > 0 && (
                  <button 
                    className="btn-danger-outline" 
                    onClick={abrirConfirmTodos}
                    disabled={cancelando}
                  >
                    <GiTrashCan /> Cancelar todos ({boletos.length})
                  </button>
                )}
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Fatura:</span>
                  <span className="info-value">#{dadosFatura.FATURA}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Vencimento:</span>
                  <span className="info-value">
                    {new Date(dadosFatura.VENCIMENTO).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-${dadosFatura.STATUS}`}>
                    {dadosFatura.STATUS === "A" ? "ATIVA" : dadosFatura.STATUS === "C" ? "CANCELADA" : "BAIXADA"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Qtd. Boletos:</span>
                  <span className="info-value">{dadosFatura.QTD_BOLETOS || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabela de Boletos */}
          {boletos.length > 0 && (
            <div className="op-boletos-table">
              <h3>Boletos Ativos para Cancelamento</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Nosso Número</th>
                      <th>Documento</th>
                      <th>Sacado</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletos.map((boleto, index) => (
                      <tr key={index}>
                        <td className="mono">{boleto.nossoNumero}</td>
                        <td className="mono">{boleto.documento}</td>
                        <td>{boleto.sacado}</td>
                        <td>{formatarMoeda(boleto.valor)}</td>
                        <td>
                          <span className={`status-badge ${boleto.status === "ATIVO" ? "active" : "cancelled"}`}>
                            {boleto.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={() => abrirConfirmIndividual(boleto)}
                            disabled={cancelando || boleto.desabilitado}
                            title={boleto.desabilitado ? "Este boleto não pode ser cancelado" : "Cancelar boleto"}
                          >
                            <GiCancel />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          {(dadosFatura || boletos.length > 0) && (
            <div className="op-actions-footer">
              <button className="btn-secondary" onClick={limpar} disabled={cancelando}>
                Limpar consulta
              </button>
            </div>
          )}

          {/* Rodapé */}
          <div className="op-footer">
            <small>
              Solicitante: <strong>{user?.nome_completo || user?.usuario || user?.email || "Usuário"}</strong>
            </small>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OperacionalCancelamento;