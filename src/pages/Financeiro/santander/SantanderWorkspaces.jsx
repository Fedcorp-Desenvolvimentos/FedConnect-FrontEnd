// src/pages/Financeiro/Santander/Workspaces/SantanderWorkspaces.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiRefreshCw,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiHome,
  FiGlobe,
  FiArrowLeft
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../Layouts/PageLayout/PageLayout';
import { S } from './SantanderWorkspacesStyles';
import { 
  listarWorkspaces, 
  criarWorkspace, 
  atualizarWorkspace, 
  deletarWorkspace,
  obterWorkspaceConfigurado
} from '../../../services/fedcorpPayService';
import { useAuth } from '../../../context/AuthContext';
import SantanderWorkspaceModal from './SantanderWorkspaceModal';
import SantanderWorkspaceDetailsModal from './SantanderWorkspaceDetailsModal';

const SantanderWorkspaces = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useAuth();
  const empresaId = user?.empresa_id || 'fedcorp';

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [workspaceConfigurado, setWorkspaceConfigurado] = useState(null);
  
  // Use ref para controlar se já carregou na montagem
  const hasLoaded = useRef(false);

  const showToast = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  const carregarWorkspaces = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await listarWorkspaces(empresaId);
      
      if (response.success && response.data) {
        const lista = response.data.content || [];
        setWorkspaces(lista);
        
        if (lista.length === 0 && showLoading) {
          showToast('Nenhum workspace encontrado para esta empresa.', { variant: 'info' });
        }
      } else if (showLoading) {
        showToast('Erro ao carregar workspaces', { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
      if (showLoading) {
        showToast('Erro ao carregar workspaces: ' + error.message, { variant: 'error' });
      }
    } finally {
      if (showLoading) setLoading(false);
      setInitialLoading(false);
    }
  }, [empresaId, showToast]);

  const carregarWorkspaceConfigurado = useCallback(async () => {
    try {
      const response = await obterWorkspaceConfigurado(empresaId);
      if (response.success) {
        setWorkspaceConfigurado(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar workspace configurado:', error);
    }
  }, [empresaId]);

  // Carregamento inicial - apenas uma vez
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      const loadData = async () => {
        await Promise.all([
          carregarWorkspaces(true),
          carregarWorkspaceConfigurado()
        ]);
      };
      loadData();
    }
  }, [carregarWorkspaces, carregarWorkspaceConfigurado]);

  const handleCriar = async (data) => {
    try {
      setLoading(true);
      const response = await criarWorkspace(empresaId, data);
      
      if (response.success) {
        showToast('Workspace criado com sucesso!', { variant: 'success' });
        setModalOpen(false);
        await carregarWorkspaces(false);
        return true;
      } else {
        showToast('Erro ao criar workspace: ' + (response.message || 'Erro desconhecido'), { variant: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Erro ao criar workspace:', error);
      showToast('Erro ao criar workspace: ' + error.message, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizar = async (id, data) => {
    try {
      setLoading(true);
      const response = await atualizarWorkspace(id, empresaId, data);
      
      if (response.success) {
        showToast('Workspace atualizado com sucesso!', { variant: 'success' });
        setModalOpen(false);
        await carregarWorkspaces(false);
        return true;
      } else {
        showToast('Erro ao atualizar workspace: ' + (response.message || 'Erro desconhecido'), { variant: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar workspace:', error);
      showToast('Erro ao atualizar workspace: ' + error.message, { variant: 'error' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id, description) => {
    if (!window.confirm(`Tem certeza que deseja excluir o workspace "${description}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await deletarWorkspace(id, empresaId);
      
      if (response.success) {
        showToast('Workspace excluído com sucesso!', { variant: 'success' });
        await carregarWorkspaces(false);
      } else {
        showToast('Erro ao excluir workspace: ' + (response.message || 'Erro desconhecido'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao excluir workspace:', error);
      showToast('Erro ao excluir workspace: ' + error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    carregarWorkspaces(true);
  };

  const handleAbrirModalCriar = () => {
    setSelectedWorkspace(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleAbrirModalEditar = (workspace) => {
    setSelectedWorkspace(workspace);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleAbrirDetalhes = (workspace) => {
    setSelectedWorkspace(workspace);
    setDetailsModalOpen(true);
  };

  const handleVoltar = () => {
    navigate('/financeiro/santander');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#10b981';
      case 'INACTIVE': return '#ef4444';
      case 'PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'INACTIVE': return 'Inativo';
      case 'PENDING': return 'Pendente';
      default: return status || 'Desconhecido';
    }
  };

  const formatDate = (dateString) => {
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

  // Se ainda está carregando inicialmente
  if (initialLoading) {
    return (
      <PageLayout 
        title="Workspaces Santander" 
        subtitle="Gerenciamento de Workspaces"
        icon={<FiGlobe />}
      >
        <S.Container>
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando workspaces...</p>
          </S.LoadingContainer>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Workspaces Santander" 
      subtitle="Gerenciamento de Workspaces"
      icon={<FiGlobe />}
    >
      <S.Container>
        {/* Botão Voltar */}
        <S.BackButton onClick={handleVoltar}>
          <FiArrowLeft />
          Voltar
        </S.BackButton>

        {/* Workspace Configurado */}
        {workspaceConfigurado && (
          <S.ConfigCard>
            <S.ConfigHeader>
              <S.ConfigIcon>
                <FiCheckCircle />
              </S.ConfigIcon>
              <S.ConfigInfo>
                <S.ConfigTitle>Workspace Configurado</S.ConfigTitle>
                <S.ConfigSubtitle>
                  {workspaceConfigurado.company_name} - {workspaceConfigurado.cnpj}
                </S.ConfigSubtitle>
              </S.ConfigInfo>
              <S.ConfigBadge>
                {workspaceConfigurado.environment === 'producao' ? 'Produção' : 'Homologação'}
              </S.ConfigBadge>
            </S.ConfigHeader>
            <S.ConfigDetails>
              <S.ConfigItem>
                <span>Workspace ID:</span>
                <code>{workspaceConfigurado.workspace_id}</code>
              </S.ConfigItem>
              <S.ConfigItem>
                <span>Código do Convênio:</span>
                <code>{workspaceConfigurado.covenant_code}</code>
              </S.ConfigItem>
            </S.ConfigDetails>
          </S.ConfigCard>
        )}

        {/* Header com ações */}
        <S.Header>
          <S.HeaderLeft>
            <S.Title>
              <FiHome />
              Workspaces
            </S.Title>
            <S.Subtitle>
              Gerencie os workspaces do Santander para sua empresa
            </S.Subtitle>
          </S.HeaderLeft>
          <S.HeaderRight>
            <S.RefreshButton onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw className={loading ? 'spinning' : ''} />
              Atualizar
            </S.RefreshButton>
            <S.CreateButton onClick={handleAbrirModalCriar}>
              <FiPlus />
              Novo Workspace
            </S.CreateButton>
          </S.HeaderRight>
        </S.Header>

        {/* Lista de Workspaces */}
        {loading && workspaces.length === 0 ? (
          <S.LoadingContainer>
            <S.LoadingSpinner />
            <p>Carregando workspaces...</p>
          </S.LoadingContainer>
        ) : workspaces.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>
              <FiAlertCircle />
            </S.EmptyIcon>
            <h3>Nenhum workspace encontrado</h3>
            <p>Clique em "Novo Workspace" para criar o primeiro workspace para sua empresa.</p>
          </S.EmptyState>
        ) : (
          <S.Grid>
            {workspaces.map((workspace) => (
              <S.Card key={workspace.id}>
                <S.CardHeader>
                  <S.CardTitle>
                    <BsFillBuildingFill />
                    {workspace.description || 'Workspace'}
                  </S.CardTitle>
                  <S.StatusBadge $color={getStatusColor(workspace.status)}>
                    <span className="dot" />
                    {getStatusLabel(workspace.status)}
                  </S.StatusBadge>
                </S.CardHeader>

                <S.CardBody>
                  <S.CardInfo>
                    <S.InfoRow>
                      <span>ID:</span>
                      <code>{workspace.id?.slice(0, 8)}...</code>
                    </S.InfoRow>
                    <S.InfoRow>
                      <span>Tipo:</span>
                      <span>{workspace.type || 'BILLING'}</span>
                    </S.InfoRow>
                    <S.InfoRow>
                      <span>Convênios:</span>
                      <span>
                        {workspace.covenants?.map(c => c.code).join(', ') || '-'}
                      </span>
                    </S.InfoRow>
                    <S.InfoRow>
                      <span>Criado em:</span>
                      <span>{formatDate(workspace.creationDate)}</span>
                    </S.InfoRow>
                    <S.InfoRow>
                      <span>Webhook:</span>
                      <S.WebhookStatus $active={workspace.bankSlipBillingWebhookActive}>
                        {workspace.bankSlipBillingWebhookActive ? (
                          <>
                            <FiCheckCircle size={14} />
                            Ativo
                          </>
                        ) : (
                          <>
                            <FiXCircle size={14} />
                            Inativo
                          </>
                        )}
                      </S.WebhookStatus>
                    </S.InfoRow>
                  </S.CardInfo>

                  <S.CardActions>
                    <S.ActionButton 
                      variant="details" 
                      onClick={() => handleAbrirDetalhes(workspace)}
                      title="Ver detalhes"
                    >
                      <FiInfo size={16} />
                    </S.ActionButton>
                    <S.ActionButton 
                      variant="edit" 
                      onClick={() => handleAbrirModalEditar(workspace)}
                      title="Editar"
                    >
                      <FiEdit2 size={16} />
                    </S.ActionButton>
                    <S.ActionButton 
                      variant="delete" 
                      onClick={() => handleDeletar(workspace.id, workspace.description)}
                      title="Excluir"
                    >
                      <FiTrash2 size={16} />
                    </S.ActionButton>
                  </S.CardActions>
                </S.CardBody>
              </S.Card>
            ))}
          </S.Grid>
        )}
      </S.Container>

      {/* Modal de Criação/Edição */}
      <SantanderWorkspaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCriar : handleAtualizar}
        mode={modalMode}
        initialData={selectedWorkspace}
        loading={loading}
      />

      {/* Modal de Detalhes */}
      <SantanderWorkspaceDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        workspace={selectedWorkspace}
      />
    </PageLayout>
  );
};

export default SantanderWorkspaces;