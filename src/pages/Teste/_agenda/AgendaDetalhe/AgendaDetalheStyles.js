import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Overlay = styled.div`
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
  z-index: 1000;
  padding: 1rem;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 450px;
  width: 100%;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 600px) {
    max-width: 95%;
    padding: 1.25rem;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;

  &:hover {
    color: #dc2626;
  }
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
  margin-bottom: 1.5rem;
  text-align: center;
  padding-right: 1.5rem;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;

  svg {
    color: #0F3D5D;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    color: white;
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const CloseButtonAction = styled.button`
  padding: 0.6rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Modal de confirmação
export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
`;

export const ConfirmModal = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 600px) {
    max-width: 90%;
    padding: 1.25rem;
  }
`;

export const ConfirmTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0F3D5D;
  margin-bottom: 1rem;
`;

export const ConfirmMessage = styled.p`
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  strong {
    color: #dc2626;
  }
`;

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const CancelConfirmButton = styled.button`
  padding: 0.6rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ConfirmDeleteButton = styled.button`
  padding: 0.6rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b91c1c;
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;