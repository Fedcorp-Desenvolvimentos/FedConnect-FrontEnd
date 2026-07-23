// src/pages/Financeiro/Santander/SantanderDetailsModal.jsx
import React from 'react';
import { FiX, FiCheckCircle, FiXCircle, FiClock, FiGlobe, FiLink, FiCode, FiHome } from 'react-icons/fi';
import { S } from './SantanderWorkspaceDetailsModalStyles';

const SantanderDetailsModal = ({ isOpen, onClose, workspace }) => {
  if (!isOpen || !workspace) return null;

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

  const getBooleanIcon = (value) => {
    return value ? 
      <FiCheckCircle color="#10b981" size={18} /> : 
      <FiXCircle color="#ef4444" size={18} />;
  };

  const getBooleanLabel = (value) => {
    return value ? 'Ativo' : 'Inativo';
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>
            <FiHome />
            Detalhes do Workspace
          </S.Title>
          <S.CloseButton onClick={onClose}>
            <FiX size={20} />
          </S.CloseButton>
        </S.Header>

        <S.Body>
          <S.Section>
            <S.SectionTitle>Informações Gerais</S.SectionTitle>
            <S.InfoGrid>
              <S.InfoItem>
                <S.InfoLabel>ID</S.InfoLabel>
                <S.InfoValue>
                  <code>{workspace.id}</code>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Descrição</S.InfoLabel>
                <S.InfoValue>{workspace.description || '-'}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Tipo</S.InfoLabel>
                <S.InfoValue>
                  <S.Badge>{workspace.type || 'BILLING'}</S.Badge>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Status</S.InfoLabel>
                <S.InfoValue>
                  <S.StatusBadge $color={getStatusColor(workspace.status)}>
                    <span className="dot" />
                    {getStatusLabel(workspace.status)}
                  </S.StatusBadge>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Criação</S.InfoLabel>
                <S.InfoValue>
                  <FiClock size={14} />
                  {formatDate(workspace.creationDate)}
                </S.InfoValue>
              </S.InfoItem>
            </S.InfoGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Convênios</S.SectionTitle>
            <S.CovenantList>
              {workspace.covenants?.map((covenant, index) => (
                <S.CovenantItem key={index}>
                  <FiCode size={14} />
                  {covenant.code}
                </S.CovenantItem>
              )) || <S.NoData>Nenhum convênio cadastrado</S.NoData>}
            </S.CovenantList>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Webhook</S.SectionTitle>
            <S.InfoItem>
              <S.InfoLabel>URL</S.InfoLabel>
              <S.InfoValue>
                <FiLink size={14} />
                <a href={workspace.webhookURL} target="_blank" rel="noopener noreferrer">
                  {workspace.webhookURL || '-'}
                </a>
              </S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>ID</S.InfoLabel>
              <S.InfoValue>
                <code>{workspace.webhookID || '-'}</code>
              </S.InfoValue>
            </S.InfoItem>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Configurações</S.SectionTitle>
            <S.SettingsGrid>
              <S.SettingItem>
                <S.SettingLabel>Boleto</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.bankSlipBillingWebhookActive)}
                  {getBooleanLabel(workspace.bankSlipBillingWebhookActive)}
                </S.SettingValue>
              </S.SettingItem>
              <S.SettingItem>
                <S.SettingLabel>PIX</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.pixBillingWebhookActive)}
                  {getBooleanLabel(workspace.pixBillingWebhookActive)}
                </S.SettingValue>
              </S.SettingItem>
              <S.SettingItem>
                <S.SettingLabel>Pagamentos PIX</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.pixPaymentsActive)}
                  {getBooleanLabel(workspace.pixPaymentsActive)}
                </S.SettingValue>
              </S.SettingItem>
              <S.SettingItem>
                <S.SettingLabel>Código de Barras</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.barCodePaymentsActive)}
                  {getBooleanLabel(workspace.barCodePaymentsActive)}
                </S.SettingValue>
              </S.SettingItem>
              <S.SettingItem>
                <S.SettingLabel>Transferência Bancária</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.bankTransferPaymentsActive)}
                  {getBooleanLabel(workspace.bankTransferPaymentsActive)}
                </S.SettingValue>
              </S.SettingItem>
              <S.SettingItem>
                <S.SettingLabel>Cartão de Crédito Santander</S.SettingLabel>
                <S.SettingValue>
                  {getBooleanIcon(workspace.santanderBankCreditCardsActive)}
                  {getBooleanLabel(workspace.santanderBankCreditCardsActive)}
                </S.SettingValue>
              </S.SettingItem>
            </S.SettingsGrid>
          </S.Section>
        </S.Body>

        <S.Footer>
          <S.CloseFooterButton onClick={onClose}>Fechar</S.CloseFooterButton>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
};

export default SantanderDetailsModal;