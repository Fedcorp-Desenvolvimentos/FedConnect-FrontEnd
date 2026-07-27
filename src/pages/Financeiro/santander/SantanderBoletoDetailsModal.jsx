// src/pages/Financeiro/Santander/Boletos/SantanderBoletoDetailsModal.jsx
import React from 'react';
import { FiX, FiCheckCircle, FiXCircle, FiClock, FiUser, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';
import { S } from './SantanderBoletoDetailsModalStyles';

const SantanderBoletoDetailsModal = ({ isOpen, onClose, boleto, bankNumber, companyId }) => {
  if (!isOpen || !boleto) return null;

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

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    if (status === 'Liquidado' || status === 'LIQUIDADO') return '#10b981';
    if (status === 'PENDENTE' || status === 'Pendente') return '#f59e0b';
    if (status === 'CANCELADO' || status === 'Cancelado') return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    if (!status) return <FiXCircle />;
    if (status === 'Liquidado' || status === 'LIQUIDADO') return <FiCheckCircle />;
    if (status === 'PENDENTE' || status === 'Pendente') return <FiClock />;
    if (status === 'CANCELADO' || status === 'Cancelado') return <FiXCircle />;
    return <FiXCircle />;
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>
            <FiFileText />
            Detalhes do Boleto
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
                <S.InfoLabel>Nosso Número</S.InfoLabel>
                <S.InfoValue>
                  <code>{boleto.bankNumber || bankNumber}</code>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Seu Número</S.InfoLabel>
                <S.InfoValue>{boleto.clientNumber || '-'}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Status</S.InfoLabel>
                <S.InfoValue>
                  <S.StatusBadge $color={getStatusColor(boleto.status)}>
                    {getStatusIcon(boleto.status)}
                    {boleto.status || 'Desconhecido'}
                  </S.StatusBadge>
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Código do Convênio</S.InfoLabel>
                <S.InfoValue>{boleto.covenantCode || '-'}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Documento</S.InfoLabel>
                <S.InfoValue>{boleto.documentNumber || '-'}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Código do Beneficiário</S.InfoLabel>
                <S.InfoValue>{boleto.beneficiaryCode || '-'}</S.InfoValue>
              </S.InfoItem>
            </S.InfoGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Valores e Datas</S.SectionTitle>
            <S.InfoGrid>
              <S.InfoItem>
                <S.InfoLabel>Valor Nominal</S.InfoLabel>
                <S.InfoValue>
                  <FiDollarSign size={14} />
                  {formatCurrency(boleto.nominalValue)}
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Data Emissão</S.InfoLabel>
                <S.InfoValue>
                  <FiCalendar size={14} />
                  {formatDate(boleto.issueDate)}
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Data Vencimento</S.InfoLabel>
                <S.InfoValue>
                  <FiCalendar size={14} />
                  {formatDate(boleto.dueDate)}
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Valor Pago</S.InfoLabel>
                <S.InfoValue>
                  <FiDollarSign size={14} />
                  {formatCurrency(boleto.paidValue || boleto.payment?.paidValue)}
                </S.InfoValue>
              </S.InfoItem>
            </S.InfoGrid>
          </S.Section>

          {(boleto.payment || boleto.paidValue) && (
            <S.Section>
              <S.SectionTitle>Informações de Pagamento</S.SectionTitle>
              <S.InfoGrid>
                <S.InfoItem>
                  <S.InfoLabel>Data Pagamento</S.InfoLabel>
                  <S.InfoValue>
                    <FiCalendar size={14} />
                    {formatDate(boleto.payment?.date || boleto.paymentDate)}
                  </S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Valor Pago</S.InfoLabel>
                  <S.InfoValue>
                    <FiDollarSign size={14} />
                    {formatCurrency(boleto.payment?.paidValue || boleto.paidValue)}
                  </S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Tipo de Pagamento</S.InfoLabel>
                  <S.InfoValue>{boleto.payment?.type || '-'}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Banco</S.InfoLabel>
                  <S.InfoValue>{boleto.payment?.bankCode || '-'}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Juros</S.InfoLabel>
                  <S.InfoValue>{formatCurrency(boleto.payment?.interestValue || boleto.interestValue)}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Multa</S.InfoLabel>
                  <S.InfoValue>{formatCurrency(boleto.payment?.fineValue || boleto.fineValue)}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Desconto</S.InfoLabel>
                  <S.InfoValue>{formatCurrency(boleto.payment?.rebateValue || boleto.discountValue)}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem>
                  <S.InfoLabel>Data Crédito</S.InfoLabel>
                  <S.InfoValue>
                    <FiCalendar size={14} />
                    {formatDate(boleto.payment?.creditDate)}
                  </S.InfoValue>
                </S.InfoItem>
              </S.InfoGrid>
            </S.Section>
          )}

          <S.Section>
            <S.SectionTitle>Pagador</S.SectionTitle>
            <S.InfoGrid>
              <S.InfoItem>
                <S.InfoLabel>Nome</S.InfoLabel>
                <S.InfoValue>
                  <FiUser size={14} />
                  {boleto.payer?.name || '-'}
                </S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Documento</S.InfoLabel>
                <S.InfoValue>{boleto.payer?.documentNumber || '-'}</S.InfoValue>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoLabel>Tipo Documento</S.InfoLabel>
                <S.InfoValue>{boleto.payer?.documentType || '-'}</S.InfoValue>
              </S.InfoItem>
            </S.InfoGrid>
          </S.Section>

          {boleto.returnCode && (
            <S.Section>
              <S.SectionTitle>Retorno</S.SectionTitle>
              <S.ReturnCode>{boleto.returnCode}</S.ReturnCode>
            </S.Section>
          )}
        </S.Body>

        <S.Footer>
          <S.CloseFooterButton onClick={onClose}>Fechar</S.CloseFooterButton>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
};

export default SantanderBoletoDetailsModal;