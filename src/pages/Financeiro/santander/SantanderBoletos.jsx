// src/pages/Financeiro/Santander/Boletos/SantanderBoletos.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { 
  FiRefreshCw, 
  FiSearch, 
  FiArrowLeft,
  FiGlobe,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiTrash2,
  FiPlus,
  FiDownload
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import PageLayout from '../../../Layouts/PageLayout/PageLayout';
import { S } from './SantanderBoletosStyles';
import { 
  listarBoletos,
  consultarSonda,
  baixarBoleto
} from '../../../services/fedcorpPayService';
import SantanderBoletoModal from './SantanderBoletoModal';
import SantanderBoletoDetailsModal from './SantanderBoletoDetailsModal';

const SantanderBoletos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuth();
  const empresaId = user?.empresa_id || 'fedcorp';

  const [boletos, setBoletos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState(null);
  const [selectedBankNumber, setSelectedBankNumber] = useState('');
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtros, setFiltros] = useState({
    _limit: 20,
    _offset: 0,
    status: 'LIQUIDADO',
    paymentDateInitial: '',
    paymentDateFinal: '',
  });
  const hasLoaded = useRef(false);

  const showToast = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  const carregarBoletos = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      // Filtra parâmetros vazios
      const params = {};
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
          params[key] = filtros[key];
        }
      });
      
      const response = await listarBoletos(empresaId, params);
      
      if (response.success) {
        setBoletos(response._content || []);
        setTotalRegistros(response.total_registros || 0);
        
        if (response._content?.length === 0 && showLoading) {
          showToast('Nenhum boleto encontrado.', { variant: 'info' });
        }
      } else if (showLoading) {
        showToast('Erro ao carregar boletos', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao carregar boletos:', error);
      if (showLoading) {
        showToast('Erro ao carregar boletos: ' + error.message, { variant: 'error' });
      }
    } finally {
      if (showLoading) setLoading(false);
      setInitialLoading(false);
    }
  }, [empresaId, filtros, showToast]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      carregarBoletos(true);
    }
  }, [carregarBoletos]);

  const handleRefresh = () => {
    carregarBoletos(true);
  };

  const handleVoltar = () => {
    navigate('/financeiro/santander');
  };

  const handleFiltroChange = (field, value) => {
    setFiltros(prev => ({ ...prev, [field]: value, _offset: 0 }));
  };

  const handleBuscar = () => {
    carregarBoletos(true);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      _limit: 20,
      _offset: 0,
      status: 'LIQUIDADO',
      paymentDateInitial: '',
      paymentDateFinal: '',
    });
  };

  const handleVerDetalhes = async (bankNumber) => {
    try {
      setLoading(true);
      const response = await consultarSonda(empresaId, bankNumber);
      if (response.success) {
        // Pega o primeiro item do content
        const dados = response.data?._content?.[0] || response.data;
        setSelectedBoleto(dados);
        setSelectedBankNumber(bankNumber);
        setDetailsModalOpen(true);
      } else {
        showToast('Erro ao buscar detalhes do boleto', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      showToast('Erro ao buscar detalhes: ' + error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarBoleto = async (bankNumber) => {
    if (!window.confirm(`Tem certeza que deseja cancelar o boleto ${bankNumber}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await baixarBoleto(empresaId, bankNumber);
      
      if (response.success) {
        showToast('Boleto cancelado com sucesso!', { variant: 'success' });
        await carregarBoletos(false);
      } else {
        showToast('Erro ao cancelar boleto: ' + (response.detail || 'Erro desconhecido'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao cancelar boleto:', error);
      showToast('Erro ao cancelar boleto: ' + error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    if (status === 'LIQUIDADO') return '#10b981';
    if (status === 'PENDENTE') return '#f59e0b';
    if (status === 'CANCELADO') return '#ef4444';
    if (status === 'VENCIDO') return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    if (!status) return <FiAlertCircle />;
    if (status === 'LIQUIDADO') return <FiCheckCircle />;
    if (status === 'PENDENTE') return <FiAlertCircle />;
    if (status === 'CANCELADO') return <FiXCircle />;
    if (status === 'VENCIDO') return <FiAlertCircle />;
    return <FiAlertCircle />;
  };

  if (initialLoading) {
    return (
      <PageLayout 
        title="Boletos Santander" 
        subtitle="Gerenciamento de Boletos"
        icon={<FiGlobe />}
      >
        <S.Container>
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando boletos...</p>
          </S.LoadingContainer>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Boletos Santander" 
      subtitle="Gerenciamento de Boletos"
      icon={<FiGlobe />}
    >
      <S.Container>
        <S.BackButton onClick={handleVoltar}>
          <FiArrowLeft />
          Voltar
        </S.BackButton>

        {/* Filtros */}
        <S.FiltrosCard>
          <S.FiltrosGrid>
            <S.FiltroGroup>
              <S.FiltroLabel>Status</S.FiltroLabel>
              <S.FiltroSelect
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
              >
                <option value="LIQUIDADO">LIQUIDADO</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="VENCIDO">VENCIDO</option>
                <option value="CANCELADO">CANCELADO</option>
              </S.FiltroSelect>
            </S.FiltroGroup>

            <S.FiltroGroup>
              <S.FiltroLabel>Data Pagamento (de)</S.FiltroLabel>
              <S.FiltroInput
                type="date"
                value={filtros.paymentDateInitial}
                onChange={(e) => handleFiltroChange('paymentDateInitial', e.target.value)}
              />
            </S.FiltroGroup>

            <S.FiltroGroup>
              <S.FiltroLabel>Data Pagamento (até)</S.FiltroLabel>
              <S.FiltroInput
                type="date"
                value={filtros.paymentDateFinal}
                onChange={(e) => handleFiltroChange('paymentDateFinal', e.target.value)}
              />
            </S.FiltroGroup>

            <S.FiltroGroup>
              <S.FiltroLabel>Limite por página</S.FiltroLabel>
              <S.FiltroSelect
                value={filtros._limit}
                onChange={(e) => handleFiltroChange('_limit', Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </S.FiltroSelect>
            </S.FiltroGroup>
          </S.FiltrosGrid>

          <S.FiltroActions>
            <S.FiltroButton variant="secondary" onClick={handleLimparFiltros}>
              Limpar Filtros
            </S.FiltroButton>
            <S.FiltroButton variant="primary" onClick={handleBuscar}>
              <FiSearch />
              Buscar
            </S.FiltroButton>
          </S.FiltroActions>
        </S.FiltrosCard>

        {/* Header com ações */}
        <S.Header>
          <S.HeaderLeft>
            <S.Title>Boletos</S.Title>
            <S.Subtitle>
              {totalRegistros > 0 
                ? `Total: ${totalRegistros} boletos encontrados` 
                : 'Nenhum boleto encontrado'}
            </S.Subtitle>
          </S.HeaderLeft>
          <S.HeaderRight>
            <S.RefreshButton onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
              Atualizar
            </S.RefreshButton>
            <S.CreateButton onClick={() => setCreateModalOpen(true)}>
              <FiPlus />
              Novo Boleto
            </S.CreateButton>
          </S.HeaderRight>
        </S.Header>

        {/* Lista de Boletos */}
        {loading && boletos.length === 0 ? (
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando boletos...</p>
          </S.LoadingContainer>
        ) : boletos.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <FiAlertCircle />
            </S.EmptyIcon>
            <h3>Nenhum boleto encontrado</h3>
            <p>Não há boletos com os filtros selecionados.</p>
          </S.EmptyState>
        ) : (
          <>
            <S.Grid>
              {boletos.map((boleto) => (
                <S.Card key={boleto.bankNumber}>
                  <S.CardHeader>
                    <S.CardTitle>
                      <FiFileText />
                      Boleto {boleto.bankNumber}
                    </S.CardTitle>
                    <S.StatusBadge $color={getStatusColor(boleto.status)}>
                      {getStatusIcon(boleto.status)}
                      {boleto.status || 'Desconhecido'}
                    </S.StatusBadge>
                  </S.CardHeader>

                  <S.CardBody>
                    <S.InfoGrid>
                      <S.InfoItem>
                        <S.InfoLabel>Nosso Número</S.InfoLabel>
                        <S.InfoValue>
                          <code>{boleto.bankNumber}</code>
                        </S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>Seu Número</S.InfoLabel>
                        <S.InfoValue>{boleto.clientNumber || '-'}</S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>Pagador</S.InfoLabel>
                        <S.InfoValue>
                          <FiUser size={14} />
                          {boleto.payer?.name || '-'}
                        </S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>CNPJ/CPF</S.InfoLabel>
                        <S.InfoValue>{boleto.payer?.documentNumber || '-'}</S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>Valor</S.InfoLabel>
                        <S.InfoValue>
                          <FiDollarSign size={14} />
                          {formatCurrency(Number(boleto.nominalValue))}
                        </S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>Vencimento</S.InfoLabel>
                        <S.InfoValue>
                          <FiCalendar size={14} />
                          {formatDate(boleto.dueDate)}
                        </S.InfoValue>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoLabel>Data Emissão</S.InfoLabel>
                        <S.InfoValue>
                          <FiCalendar size={14} />
                          {formatDate(boleto.issueDate)}
                        </S.InfoValue>
                      </S.InfoItem>
                      {boleto.payment && (
                        <>
                          <S.InfoItem>
                            <S.InfoLabel>Valor Pago</S.InfoLabel>
                            <S.InfoValue>
                              <FiDollarSign size={14} />
                              {formatCurrency(Number(boleto.payment?.paidValue))}
                            </S.InfoValue>
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>Data Pagamento</S.InfoLabel>
                            <S.InfoValue>
                              <FiCalendar size={14} />
                              {formatDateTime(boleto.payment?.date)}
                            </S.InfoValue>
                          </S.InfoItem>
                        </>
                      )}
                    </S.InfoGrid>

                    <S.CardActions>
                      <S.ActionButton 
                        variant="details" 
                        onClick={() => handleVerDetalhes(boleto.bankNumber)}
                        title="Ver detalhes"
                      >
                        <FiEye size={16} />
                      </S.ActionButton>
                      {boleto.status !== 'LIQUIDADO' && (
                        <S.ActionButton 
                          variant="delete" 
                          onClick={() => handleCancelarBoleto(boleto.bankNumber)}
                          title="Cancelar boleto"
                        >
                          <FiTrash2 size={16} />
                        </S.ActionButton>
                      )}
                    </S.CardActions>
                  </S.CardBody>
                </S.Card>
              ))}
            </S.Grid>

            {/* Paginação simples */}
            {totalRegistros > filtros._limit && (
              <S.Pagination>
                <S.PaginationInfo>
                  Mostrando {boletos.length} de {totalRegistros} boletos
                </S.PaginationInfo>
                <S.PaginationButtons>
                  <S.PaginationButton
                    disabled={filtros._offset === 0}
                    onClick={() => {
                      setFiltros(prev => ({ ...prev, _offset: Math.max(0, prev._offset - prev._limit) }));
                      setTimeout(() => carregarBoletos(true), 100);
                    }}
                  >
                    Anterior
                  </S.PaginationButton>
                  <S.PaginationButton
                    disabled={boletos.length < filtros._limit}
                    onClick={() => {
                      setFiltros(prev => ({ ...prev, _offset: prev._offset + prev._limit }));
                      setTimeout(() => carregarBoletos(true), 100);
                    }}
                  >
                    Próxima
                  </S.PaginationButton>
                </S.PaginationButtons>
              </S.Pagination>
            )}
          </>
        )}
      </S.Container>

      {/* Modal de Detalhes */}
      <SantanderBoletoDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        boleto={selectedBoleto}
        bankNumber={selectedBankNumber}
        companyId={empresaId}
      />

      {/* Modal de Criação */}
      <SantanderBoletoModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        companyId={empresaId}
        onSuccess={() => carregarBoletos(true)}
      />
    </PageLayout>
  );
};

export default SantanderBoletos;