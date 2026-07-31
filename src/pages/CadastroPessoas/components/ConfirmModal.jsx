// src/pages/CadastroPessoas/components/ConfirmModal.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.25s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 600;
  color: #0f3d5d;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;

  svg {
    font-size: 1.3rem;
    color: ${props => props.$danger ? '#ef4444' : '#f59e0b'};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: #475569;
  }
`;

const ModalBody = styled.div`
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;

  p {
    margin: 0 0 0.5rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #0f3d5d;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.55rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f1f5f9;
  color: #475569;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f3d5d;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${props => props.$danger ? '#ef4444' : '#22c55e'};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => props.$danger ? '#dc2626' : '#16a34a'};
    box-shadow: ${props => props.$danger 
      ? '0 4px 12px rgba(239,68,68,0.3)' 
      : '0 4px 12px rgba(34,197,94,0.3)'};
  }
`;

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirmar ação',
  message = 'Tem certeza que deseja realizar esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onCancel}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle $danger={danger}>
            <FaExclamationTriangle />
            {title}
          </ModalTitle>
          <CloseButton onClick={onCancel} disabled={loading}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {typeof message === 'string' ? <p>{message}</p> : message}
        </ModalBody>

        <ModalActions>
          <CancelButton onClick={onCancel} disabled={loading}>
            {cancelText}
          </CancelButton>
          <ConfirmButton $danger={danger} onClick={onConfirm} disabled={loading}>
            {loading ? '⏳ Carregando...' : confirmText}
          </ConfirmButton>
        </ModalActions>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmModal;