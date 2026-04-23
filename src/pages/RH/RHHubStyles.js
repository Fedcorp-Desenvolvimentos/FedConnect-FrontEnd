import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
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

// ============================================
// QUICK ACTIONS
// ============================================
export const QuickActionsSection = styled.div`
  margin-bottom: 2rem;
`;

export const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const QuickActionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.$color || '#0F3D5D'};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const QuickActionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => `${props.$color}10` || '#e8f0fe'};
  border-radius: 12px;
  color: ${props => props.$color || '#0F3D5D'};

  svg {
    font-size: 1.5rem;
  }
`;

export const QuickActionLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
`;

// ============================================
// STATS CARDS
// ============================================
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.$bgColor || 'white'};
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.onClick ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.onClick ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

export const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  color: ${props => props.$color || '#0F3D5D'};

  svg {
    font-size: 1.5rem;
  }
`;

export const StatInfo = styled.div`
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
`;

export const StatTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ============================================
// STATS SMALL
// ============================================
export const StatsGridSmall = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCardSmall = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
`;

export const StatIconSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => `${props.$color}10` || '#e8f0fe'};
  border-radius: 10px;
  color: ${props => props.$color || '#0F3D5D'};

  svg {
    font-size: 1.25rem;
  }
`;

export const StatSmallInfo = styled.div`
  flex: 1;
`;

export const StatSmallValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
`;

export const StatSmallTitle = styled.div`
  font-size: 0.65rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// ============================================
// SEÇÃO
// ============================================
export const Section = styled.div`
  margin-bottom: 2rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;

  svg {
    font-size: 1rem;
  }
`;

export const SectionLink = styled.button`
  background: none;
  border: none;
  color: #0F3D5D;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #64748b;

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

// ============================================
// SOLICITAÇÕES
// ============================================
export const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RequestCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    border-color: #0F3D5D;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const RequestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const RequestTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => `${props.$color}10` || '#f1f5f9'};
  border-radius: 10px;
  color: ${props => props.$color || '#64748b'};

  svg {
    font-size: 1.125rem;
  }
`;

export const RequestInfo = styled.div`
  flex: 1;
`;

export const RequestTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0F3D5D;
`;

export const RequestMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: #64748b;

  span {
    display: inline-flex;
    align-items: center;
  }
`;

export const RequestBadges = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`;

export const TaskBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  background: ${props => props.$bgColor || '#f1f5f9'};
  color: ${props => props.$color || '#64748b'};
`;

export const UrgenciaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  background: ${props => props.$bgColor || '#f1f5f9'};
  color: ${props => props.$color || '#64748b'};
`;

// ============================================
// FERIADOS
// ============================================
export const HolidaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const HolidayCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const HolidayDate = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
  margin-bottom: 0.5rem;
`;

export const HolidayName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

export const HolidayType = styled.div`
  font-size: 0.7rem;
  color: #64748b;
`;

// ============================================
// DOCUMENTOS
// ============================================
export const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

export const DocCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const DocIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #e8f0fe;
  border-radius: 10px;
  color: #0F3D5D;

  svg {
    font-size: 1.25rem;
  }
`;

export const DocInfo = styled.div`
  flex: 1;
`;

export const DocTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

export const DocDesc = styled.div`
  font-size: 0.7rem;
  color: #64748b;
`;

export const DocAction = styled.div`
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #0F3D5D;
  }

  svg {
    font-size: 1.125rem;
  }
`;