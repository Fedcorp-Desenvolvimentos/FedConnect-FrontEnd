// src/pages/Financeiro/Santander/Empresas/SantanderEmpresas.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { 
  FiRefreshCw, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiArrowLeft,
  FiGlobe,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../Layouts/PageLayout/PageLayout';
import { S } from './SantanderEmpresasStyles';
import { listarEmpresas } from '../../../services/fedcorpPayService';

const SantanderEmpresas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasLoaded = useRef(false);

  const showToast = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  const carregarEmpresas = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await listarEmpresas();
      
      if (response.success) {
        setEmpresas(response.empresas || []);
        setResumo(response.resumo || null);
        
        if (response.empresas?.length === 0 && showLoading) {
          showToast('Nenhuma empresa encontrada.', { variant: 'info' });
        }
      } else if (showLoading) {
        showToast('Erro ao carregar empresas', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      if (showLoading) {
        showToast('Erro ao carregar empresas: ' + error.message, { variant: 'error' });
      }
    } finally {
      if (showLoading) setLoading(false);
      setInitialLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      carregarEmpresas(true);
    }
  }, [carregarEmpresas]);

  const handleRefresh = () => {
    carregarEmpresas(true);
  };

  const handleVoltar = () => {
    navigate('/financeiro/santander');
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    if (status === 'VÁLIDO') return '#10b981';
    if (status === 'EXPIRADO') return '#ef4444';
    if (status === 'PENDENTE') return '#f59e0b';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    if (!status) return <FiAlertCircle />;
    if (status === 'VÁLIDO') return <FiCheckCircle />;
    if (status === 'EXPIRADO') return <FiXCircle />;
    if (status === 'PENDENTE') return <FiAlertTriangle />;
    return <FiAlertCircle />;
  };

  const getDiasRestantesColor = (dias) => {
    if (dias === null || dias === undefined) return '#6b7280';
    if (dias > 60) return '#10b981';
    if (dias > 30) return '#f59e0b';
    return '#ef4444';
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

  if (initialLoading) {
    return (
      <PageLayout 
        title="Empresas Santander" 
        subtitle="Gerenciamento de Empresas e Certificados"
        icon={<FiGlobe />}
      >
        <S.Container>
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando empresas...</p>
          </S.LoadingContainer>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Empresas Santander" 
      subtitle="Gerenciamento de Empresas e Certificados"
      icon={<FiGlobe />}
    >
      <S.Container>
        <S.BackButton onClick={handleVoltar}>
          <FiArrowLeft />
          Voltar
        </S.BackButton>

        {/* Resumo */}
        {resumo && (
          <S.ResumoCard>
            <S.ResumoGrid>
              <S.ResumoItem>
                <S.ResumoValor>{resumo.total}</S.ResumoValor>
                <S.ResumoLabel>Total de Empresas</S.ResumoLabel>
              </S.ResumoItem>
              <S.ResumoItem>
                <S.ResumoValor color="#10b981">{resumo.certificados_validos}</S.ResumoValor>
                <S.ResumoLabel>Certificados Válidos</S.ResumoLabel>
              </S.ResumoItem>
              <S.ResumoItem>
                <S.ResumoValor color="#ef4444">{resumo.certificados_expirados}</S.ResumoValor>
                <S.ResumoLabel>Certificados Expirados</S.ResumoLabel>
              </S.ResumoItem>
            </S.ResumoGrid>
          </S.ResumoCard>
        )}

        {/* Header com ações */}
        <S.Header>
          <S.HeaderLeft>
            <S.Title>Empresas Cadastradas</S.Title>
            <S.Subtitle>
              Gerencie as empresas integradas ao Santander
            </S.Subtitle>
          </S.HeaderLeft>
          <S.HeaderRight>
            <S.RefreshButton onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
              Atualizar
            </S.RefreshButton>
          </S.HeaderRight>
        </S.Header>

        {/* Lista de Empresas */}
        {loading && empresas.length === 0 ? (
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando empresas...</p>
          </S.LoadingContainer>
        ) : empresas.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <FiAlertCircle />
            </S.EmptyIcon>
            <h3>Nenhuma empresa encontrada</h3>
            <p>Não há empresas cadastradas no sistema.</p>
          </S.EmptyState>
        ) : (
          <S.Grid>
            {empresas.map((empresa) => (
              <S.Card key={empresa.id}>
                <S.CardHeader>
                  <S.CardTitle>
                    <FiGlobe />
                    {empresa.nome || empresa.id}
                  </S.CardTitle>
                  <S.StatusBadge $color={getStatusColor(empresa.status_certificado)}>
                    {getStatusIcon(empresa.status_certificado)}
                    {empresa.status_certificado || 'Desconhecido'}
                  </S.StatusBadge>
                </S.CardHeader>

                <S.CardBody>
                  <S.InfoGrid>
                    <S.InfoItem>
                      <S.InfoLabel>ID</S.InfoLabel>
                      <S.InfoValue><code>{empresa.id}</code></S.InfoValue>
                    </S.InfoItem>
                    <S.InfoItem>
                      <S.InfoLabel>CNPJ</S.InfoLabel>
                      <S.InfoValue>{empresa.cnpj || '-'}</S.InfoValue>
                    </S.InfoItem>
                    <S.InfoItem>
                      <S.InfoLabel>Ambiente</S.InfoLabel>
                      <S.InfoValue>
                        <S.EnvironmentBadge $ambiente={empresa.ambiente}>
                          {empresa.ambiente === 'producao' ? 'Produção' : 'Homologação'}
                        </S.EnvironmentBadge>
                      </S.InfoValue>
                    </S.InfoItem>
                    <S.InfoItem>
                      <S.InfoLabel>Workspace</S.InfoLabel>
                      <S.InfoValue>
                        <code>{empresa.workspace?.slice(0, 8)}...</code>
                      </S.InfoValue>
                    </S.InfoItem>
                  </S.InfoGrid>

                  <S.Divider />

                  <S.CertificadoInfo>
                    <S.CertificadoTitle>
                      <FiInfo />
                      Certificado
                    </S.CertificadoTitle>
                    <S.CertificadoGrid>
                      <S.CertificadoItem>
                        <span>Arquivo S3:</span>
                        <code>{empresa.certificado_s3 || '-'}</code>
                      </S.CertificadoItem>
                      {/* <S.CertificadoItem>
                        <span>Local:</span>
                        <code>{empresa.certificado_local || 'PENDENTE'}</code>
                      </S.CertificadoItem> */}
                      <S.CertificadoItem>
                        <span>Validade:</span>
                        <span>
                          <FiCalendar size={14} />
                          {formatDate(empresa.validade_certificado)}
                        </span>
                      </S.CertificadoItem>
                      {empresa.dias_restantes !== null && empresa.dias_restantes !== undefined && (
                        <S.CertificadoItem>
                          <span>Dias Restantes:</span>
                          <S.DiasRestantes $color={getDiasRestantesColor(empresa.dias_restantes)}>
                            <FiClock size={14} />
                            {empresa.dias_restantes} dias
                          </S.DiasRestantes>
                        </S.CertificadoItem>
                      )}
                    </S.CertificadoGrid>
                    {empresa.alerta && (
                      <S.AlertaCard $color={getStatusColor(empresa.status_certificado)}>
                        <FiAlertTriangle />
                        {empresa.alerta}
                      </S.AlertaCard>
                    )}
                  </S.CertificadoInfo>
                </S.CardBody>
              </S.Card>
            ))}
          </S.Grid>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default SantanderEmpresas;