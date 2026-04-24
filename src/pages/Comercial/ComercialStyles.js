import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: #0F3D5D;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

// ============================================
// FILTROS
// ============================================
export const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterInput = styled.input`
  flex: 2;
  padding: 0.625rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const FilterSelect = styled.select`
  flex: 1;
  padding: 0.625rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
  }
`;

export const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
`;

export const MonthButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0F3D5D;
    color: white;
    border-color: #0F3D5D;
  }
`;

export const MonthDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F3D5D;
`;

export const MonthInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.75rem;
  background: white;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ClearButton = styled.button`
  padding: 0.625rem 1rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    border-color: #0F3D5D;
    color: #0F3D5D;
  }
`;

// ============================================
// STATS CARDS
// ============================================
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${props => props.$status === 'agendadas' && css`
    border-left: 4px solid #f59e0b;
  `}
  ${props => props.$status === 'realizadas' && css`
    border-left: 4px solid #10b981;
  `}
  ${props => props.$status === 'canceladas' && css`
    border-left: 4px solid #ef4444;
  `}
`;

export const StatIcon = styled.div`
  font-size: 2rem;
`;

export const StatInfo = styled.div`
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ============================================
// GRÁFICO
// ============================================
export const GraphSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const GraphWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ============================================
// KANBAN
// ============================================
export const KanbanSection = styled.div`
  margin-top: 0.5rem;
`;

// ============================================
// KANBAN
// ============================================
export const KanbanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const KanbanColumn = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
`;

export const KanbanColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => `${props.$color}10` || '#f8fafc'};
  border-bottom: 2px solid ${props => props.$color || '#e2e8f0'};

  h4 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.$color || '#475569'};
  }

  span {
    background: ${props => props.$color || '#e2e8f0'};
    color: white;
    padding: 0.125rem 0.5rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
  }
`;

export const KanbanColumnBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const KanbanCard = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const KanbanCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #0F3D5D;
  margin-bottom: 0.5rem;

  svg {
    font-size: 0.875rem;
  }
`;

export const KanbanCardInfo = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

export const KanbanCardResponsavel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #64748b;
`;

export const EmptyColumn = styled.div`
  text-align: center;
  padding: 1rem;
  color: #64748b;
  font-size: 0.75rem;
`;

// ============================================
// MODAL DETALHES
// ============================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
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
  max-width: 500px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease;

  @media (max-width: 640px) {
    max-width: 95%;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ModalClose = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
`;

export const CloseModalButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  color: #64748b;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const InfoValue = styled.span`
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;

  ${props => props.$status === 'agendado' && css`
    background: #fffbeb;
    color: #d97706;
  `}
  ${props => props.$status === 'realizada' && css`
    background: #ecfdf5;
    color: #059669;
  `}
  ${props => props.$status === 'cancelada' && css`
    background: #fef2f2;
    color: #dc2626;
  `}
`;

export const WarningRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 10px;
  margin-top: 1rem;

  svg {
    color: #dc2626;
    flex-shrink: 0;
  }

  div {
    flex: 1;
  }

  strong {
    font-size: 0.75rem;
    color: #dc2626;
  }

  p {
    margin: 0.25rem 0 0 0;
    font-size: 0.75rem;
    color: #991b1b;
  }
`;

// ============================================
// CHART
// ============================================
export const ChartContainer = styled.div`
  width: 100%;
  height: 200px;

  @media (max-width: 768px) {
    height: 180px;
  }
`;