import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// ============================================
// TABS PRINCIPAIS
// ============================================
export const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    background: transparent;
    gap: 0.75rem;
    padding: 0;
  }
`;

export const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#0F3D5D' : '#64748b'};
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'};

  svg {
    font-size: 1.125rem;
  }

  &:hover:not(:active) {
    background: ${props => props.$active ? 'white' : '#e2e8f0'};
    color: #0F3D5D;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    background: ${props => props.$active ? '#f8fafc' : 'transparent'};
    border: 1px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  }
`;

// ============================================
// SUB-TABS (CARDS DE OPÇÃO)
// ============================================
export const SubTabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const SubTabCard = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  color: ${props => props.$active ? '#0F3D5D' : '#64748b'};
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(15, 61, 93, 0.1)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    border-color: #0F3D5D;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const SubTabIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F3D5D;

  svg {
    font-size: 1.25rem;
  }
`;

// ============================================
// FORMULÁRIO CNPJ
// ============================================
export const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  margin-bottom: 1.25rem;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const FormButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

// ============================================
// FORMULÁRIO MASSA
// ============================================
export const MassContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
  margin-top: 1rem;
`;

export const MassLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const MassButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const MassButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const MassButtonOutline = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  color: #0F3D5D;
  border: 2px solid #0F3D5D;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #0F3D5D;
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e0f2fe;
  border-radius: 12px;
  color: #0369a1;
  font-weight: 500;
  margin-top: 1rem;

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const InfoMessage = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  background: ${props => props.$isError ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$isError ? '#b91c1c' : '#166534'};
  border: 1px solid ${props => props.$isError ? '#ef4444' : '#22c55e'};
`;

// ============================================
// RESULTADOS
// ============================================
export const ResultCard = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

export const CardBody = styled.div`
  width: 100%;
`;

export const RelTitle = styled.h6`
  color: #0F3D5D;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const RelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const RelListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RelInfo = styled.div`
  flex-grow: 1;
  color: #1e293b;
`;

export const RelType = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
`;

export const RelCpf = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #64748b;
`;

export const RelButton = styled.button`
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(15, 61, 93, 0.3);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

export const NoResultsMessage = styled.p`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-weight: 500;
`;

// ============================================
// MODAL (mesmo do original, mantido)
// ============================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  transition: color 0.2s;

  &:hover {
    color: #dc2626;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #0F3D5D;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const ModalLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: #0F3D5D;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-bottom: 1rem;
  }
`;

export const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ModalColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  strong {
    color: #0F3D5D;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #1e293b;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const ModalButton = styled.button`
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(15, 61, 93, 0.3);
  }
`;

// ============================================
// ERRO
// ============================================
export const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
`;