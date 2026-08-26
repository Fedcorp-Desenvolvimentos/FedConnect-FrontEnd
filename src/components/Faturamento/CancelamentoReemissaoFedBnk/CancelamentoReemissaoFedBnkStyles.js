import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  color: #64748b;
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// Card Principal
export const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.75rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

// Abas de modo (Cancelamento | Reemissão)
export const ModeTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const ModeTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$active && css`
    color: #0F3D5D;
    border-bottom-color: #0F3D5D;
  `}

  &:hover:not(:disabled) {
    color: #0F3D5D;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Seção de Busca
export const SearchSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const SearchInputGroup = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

// Alertas
export const Alert = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  ${props => props.$type === 'success' && css`
    background: #dcfce7;
    border: 1px solid #a3e9a3;
    color: #166534;
  `}

  ${props => props.$type === 'error' && css`
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #991b1b;
  `}

  ${props => props.$type === 'warning' && css`
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  `}
`;

// Informações da Fatura
export const FaturaInfo = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

export const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const InfoTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const InfoLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;

  /* Status da fatura */
  ${props => props.$status === 'A' && css`
    background: #dcfce7;
    color: #16a34a;
  `}

  ${props => props.$status === 'C' && css`
    background: #fee2e2;
    color: #dc2626;
  `}

  /* Situação do boleto */
  ${props => props.$status === 'ativo' && css`
    background: #dbeafe;
    color: #1e40af;
  `}

  ${props => props.$status === 'registrado' && css`
    background: #dcfce7;
    color: #16a34a;
  `}

  ${props => props.$status === 'nao_registrado' && css`
    background: #dbeafe;
    color: #1e40af;
  `}

  ${props => props.$status === 'cancelado' && css`
    background: #fee2e2;
    color: #dc2626;
  `}

  ${props => props.$status === 'pago' && css`
    background: #f1f5f9;
    color: #475569;
  `}

  ${props => props.$status === 'desconhecido' && css`
    background: #fffbeb;
    color: #92400e;
  `}

  ${props => props.$status === 'sem_parcela' && css`
    background: #fef3c7;
    color: #b45309;
  `}
`;

// Boletos
export const BoletosSection = styled.div`
  margin-top: 1.5rem;
`;

export const BoletosTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th {
    text-align: left;
    padding: 0.875rem 1rem;
    background: #f8fafc;
    color: #0F3D5D;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }

  td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: #f8fafc;
  }

  input[type="checkbox"] {
    width: 1.05rem;
    height: 1.05rem;
    accent-color: #0F3D5D;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;

    th, td {
      padding: 0.625rem 0.75rem;
    }
  }
`;

export const MonoCell = styled.td`
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  font-weight: 500;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #fee2e2;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.125rem;
  }
`;

// Formulário de alterações (reemissão)
export const AlteracoesSection = styled.div`
  margin-top: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
`;

export const AlteracoesTitulo = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
`;

export const AlteracoesSubtitulo = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.8rem;
  color: #64748b;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const AdminDivider = styled.div`
  grid-column: 1 / -1;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #cbd5e1;
  font-size: 0.72rem;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Resultado do tratamento
export const ResultadoSection = styled.div`
  margin-top: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
`;

export const PendenciaProblema = styled.div`
  font-weight: 600;
  color: #991b1b;
`;

export const PendenciaAcao = styled.div`
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: #475569;
`;

// Botões
export const CancelAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
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

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

// Footer
export const ActionsFooter = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const Footer = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
  font-size: 0.7rem;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${modalIn} 0.2s ease;
  overflow: hidden;

  @media (max-width: 640px) {
    max-width: 95%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0F3D5D;
    flex: 1;
  }

  svg {
    color: ${props => (props.$variant === 'danger' ? '#dc2626' : '#0F3D5D')};
  }
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #1e293b;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;

  p {
    margin: 0 0 1rem 0;
    line-height: 1.5;
    color: #334155;
  }

  ul {
    margin: 0 0 1rem 0;
    padding-left: 1.25rem;
    color: #334155;
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;

export const Highlight = styled.span`
  background: #fef3c7;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
  color: #92400e;
`;

export const WarningBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;

  svg {
    color: #dc2626;
    flex-shrink: 0;
  }

  div {
    font-size: 0.875rem;
    color: #991b1b;
    line-height: 1.4;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;
