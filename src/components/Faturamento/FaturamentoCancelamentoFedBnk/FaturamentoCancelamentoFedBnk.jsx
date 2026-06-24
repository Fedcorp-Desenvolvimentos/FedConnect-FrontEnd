import React, { useMemo, useState, useEffect } from "react";
import { GiCancel, GiTrashCan } from "react-icons/gi";
import { FaSpinner, FaSearch, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import * as S from "./FaturamentoCancelamentoFedBnkStyles";
import { useAuth } from "../../../context/AuthContext";
import { getFaturamento } from "../../../services/consultaFatura";
import { cancelarBoletoFedBNK } from "../../../services/boletofedbnk";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";

const FaturamentoCancelamentoFedBnk = () => {
  const { user, isAuthenticated } = useAuth();

  const [fatura, setFatura] = useState("");
  const [dadosFatura, setDadosFatura] = useState(null);
  const [boletos, setBoletos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  
  const [status, setStatus] = useState({ type: "", message: "" });
  const [cancelando, setCancelando] = useState(false);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ tipo: "", documento: "", motivo: "" });

  const currentUserType = user?.nivel_acesso;

  const podeAcessar = useMemo(() => {
    const niveis = ["admin", "usuario", "comercial", "faturamento"];
    return niveis.includes(currentUserType);
  }, [currentUserType]);

  const isBoletoAtivo = (boleto, parcela) => {
    if (parcela && parcela.DT_BAIXA !== null) return false;
    if (boleto.STATUS_BOLETO === "C") return false;
    if (boleto.QUITADO === "S") return false;
    if (boleto.DT_CANCEL !== null) return false;
    if (parcela && parcela.STATUS === "B") return false;
    return true;
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

    try {
      const response = await getFaturamento({ fatura: fatura.trim() });

      if (!response?.resultado?.data || response.resultado.data.length === 0) {
        setStatus({ type: "error", message: "Fatura não encontrada." });
        return;
      }

      const faturaData = response.resultado.data[0];
      const boletosData = faturaData.BOLETOS || [];
      const parcelasData = faturaData.PARCELAS || [];

      const parcelaPorDocumento = {};
      parcelasData.forEach(parcela => {
        if (parcela.DOCUMENTO) {
          parcelaPorDocumento[parcela.DOCUMENTO] = parcela;
        }
      });

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

  const executarCancelamento = async () => {
    setCancelando(true);
    setStatus({ type: "", message: "" });
    
    const payload = {
      metodo: confirmData.tipo === "BOLETO" ? "INDIVIDUAL" : "TODOS",
      fatura: dadosFatura?.FATURA || fatura.trim(),
      documento: confirmData.tipo === "BOLETO" ? confirmData.documento : null,
      nossoNumero: confirmData.tipo === "BOLETO" ? confirmData.nossoNumero : null,
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
          if (dadosFatura) {
            setDadosFatura(prev => ({ 
              ...prev, 
              boletosAtivos: prev.boletosAtivos - 1,
              STATUS: prev.boletosAtivos - 1 <= 0 ? "C" : prev.STATUS
            }));
          }
        } else {
          setBoletos([]);
          setStatus({ 
            type: "success", 
            message: `Fatura #${fatura} e seus ${confirmData.quantidade} boleto(s) cancelados com sucesso!` 
          });
          if (dadosFatura) {
            setDadosFatura(prev => ({ ...prev, STATUS: "C" }));
          }
        }
      } else {
        setStatus({ 
          type: "error", 
          message: response.message || "Erro ao realizar o cancelamento." 
        });
      }
      
    } catch (err) {
      console.error("Erro no cancelamento:", err);
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || err.message || "Erro ao realizar o cancelamento." 
      });
    } finally {
      setCancelando(false);
      setConfirmOpen(false);
    }
  };

  const limpar = () => {
    setFatura("");
    setDadosFatura(null);
    setBoletos([]);
    setStatus({ type: "", message: "" });
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

  return (
    <PageLayout
      title="Cancelamentos FedBnk"
      subtitle="Consulte uma fatura e cancele boletos individualmente ou em lote"
      icon={<GiCancel />}
    >
      <S.Container>
        <S.Card>
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
                  disabled={buscando || cancelando}
                  onKeyPress={(e) => e.key === 'Enter' && buscarFatura()}
                />
                <S.SearchButton 
                  onClick={buscarFatura}
                  disabled={buscando || !fatura.trim()}
                >
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
                {boletos.length > 0 && (
                  <S.CancelAllButton onClick={abrirConfirmTodos} disabled={cancelando}>
                    <GiTrashCan /> Cancelar todos ({boletos.length})
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
                  <S.InfoValue>
                    {new Date(dadosFatura.VENCIMENTO).toLocaleDateString('pt-BR')}
                  </S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Status</S.InfoLabel>
                  <S.StatusBadge $status={dadosFatura.STATUS}>
                    {dadosFatura.STATUS === "A" ? "ATIVA" : dadosFatura.STATUS === "C" ? "CANCELADA" : "BAIXADA"}
                  </S.StatusBadge>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Qtd. Boletos</S.InfoLabel>
                  <S.InfoValue>{dadosFatura.QTD_BOLETOS || 0}</S.InfoValue>
                </S.InfoItem>
              </S.InfoGrid>
            </S.FaturaInfo>
          )}

          {/* Tabela de Boletos */}
          {boletos.length > 0 && (
            <S.BoletosSection>
              <S.BoletosTitle>Boletos Ativos para Cancelamento</S.BoletosTitle>
              <S.TableWrapper>
                <S.Table>
                  <thead>
                    <tr>
                      <th>Nosso Número</th>
                      <th>Documento</th>
                      <th>Sacado</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th style={{ width: "80px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletos.map((boleto, index) => (
                      <tr key={index}>
                        <S.MonoCell>{boleto.nossoNumero}</S.MonoCell>
                        <S.MonoCell>{boleto.documento}</S.MonoCell>
                        <td>{boleto.sacado}</td>
                        <td>{formatarMoeda(boleto.valor)}</td>
                        <td>
                          <S.StatusBadge $status="active">ATIVO</S.StatusBadge>
                        </td>
                        <td>
                          <S.IconButton
                            onClick={() => abrirConfirmIndividual(boleto)}
                            disabled={cancelando || boleto.desabilitado}
                            title={boleto.desabilitado ? "Este boleto não pode ser cancelado" : "Cancelar boleto"}
                          >
                            <GiCancel />
                          </S.IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </S.Table>
              </S.TableWrapper>
            </S.BoletosSection>
          )}

          {/* Botões de ação */}
          {(dadosFatura || boletos.length > 0) && (
            <S.ActionsFooter>
              <S.SecondaryButton onClick={limpar} disabled={cancelando}>
                Limpar consulta
              </S.SecondaryButton>
            </S.ActionsFooter>
          )}

          {/* Rodapé */}
          <S.Footer>
            <small>
              Solicitante: <strong>{user?.nome_completo || user?.usuario || user?.email || "Usuário"}</strong>
            </small>
          </S.Footer>
        </S.Card>

        {/* Modal de Confirmação */}
        {confirmOpen && (
          <S.ModalOverlay onClick={() => !cancelando && setConfirmOpen(false)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader>
                <GiCancel size={24} />
                <h3>Confirmar cancelamento</h3>
                <S.ModalClose onClick={() => !cancelando && setConfirmOpen(false)} disabled={cancelando}>
                  <FaTimes />
                </S.ModalClose>
              </S.ModalHeader>

              <S.ModalBody>
                {confirmData.tipo === "BOLETO" ? (
                  <>
                    <p>
                      Você está prestes a cancelar o <strong>boleto</strong>{' '}
                      <S.Highlight>{confirmData.documento}</S.Highlight>
                    </p>
                    <p>
                      <strong>Valor:</strong> {formatarMoeda(confirmData.boletoInfo?.valor)}
                    </p>
                  </>
                ) : (
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
                <S.SecondaryButton onClick={() => setConfirmOpen(false)} disabled={cancelando}>
                  Voltar
                </S.SecondaryButton>
                <S.DangerButton onClick={executarCancelamento} disabled={cancelando}>
                  {cancelando ? <FaSpinner className="spinner" /> : "Confirmar cancelamento"}
                </S.DangerButton>
              </S.ModalActions>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default FaturamentoCancelamentoFedBnk;