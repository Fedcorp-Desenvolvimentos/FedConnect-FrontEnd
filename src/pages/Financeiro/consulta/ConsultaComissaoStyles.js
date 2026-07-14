import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ================================================================
// CONTAINER PRINCIPAL
// ================================================================

export const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f7fafc;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// ================================================================
// HEADER
// ================================================================

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);

  @media (max-width: 640px) {
    flex-wrap: wrap;
    padding: 16px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #e2e8f0;
    transform: translateX(-2px);
  }

  @media (max-width: 640px) {
    padding: 8px 14px;
    font-size: 13px;
  }
`;

export const Title = styled.div`
  flex: 1;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.01em;

    @media (max-width: 640px) {
      font-size: 18px;
    }
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 4px 0 0 0;

    @media (max-width: 640px) {
      font-size: 13px;
    }
  }
`;

// ================================================================
// CARD
// ================================================================

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  gap: 12px;
  flex-wrap: wrap;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: #2563eb;
      font-size: 16px;
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
`;

// ================================================================
// FORMULÁRIO
// ================================================================

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  grid-column: ${(props) => (props.$span ? `span ${props.$span}` : 'auto')};

  @media (max-width: 1024px) {
    grid-column: ${(props) => (props.$span === 2 ? 'span 2' : 'auto')};
  }

  @media (max-width: 640px) {
    grid-column: 1;
  }

  > span, > label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }

  input,
  select {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    background: #ffffff;
    color: #0f172a;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &:disabled {
      background: #f8fafc;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
    
    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

// ================================================================
// BOTÕES
// ================================================================

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 42px;

  &.primary {
    background: #2563eb;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  }

  &.danger {
    background: #dc2626;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #b91c1c;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
  }

  &.ghost {
    background: transparent;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover:not(:disabled) {
      background: #f8fafc;
      color: #0f172a;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

// ================================================================
// RESULTADOS
// ================================================================

export const ResultsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;

  span {
    font-size: 14px;
    color: #475569;
  }
`;

export const TotalSelected = styled.span`
  font-weight: 600;
  color: #2563eb !important;
`;

// ================================================================
// TABELA
// ================================================================

export const TableContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  overflow-x: auto;
`;

export const Table = styled.div`
  min-width: 900px;
`;

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 0.8fr 1fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2563eb;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableBody = styled.div``;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr 1fr 0.8fr 1fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  align-items: center;
  background: ${(props) => (props.$checked ? '#eff6ff' : 'transparent')};
  cursor: pointer;
  transition: all 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(props) => (props.$checked ? '#dbeafe' : '#f8fafc')};
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

export const CheckboxCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2563eb;
  }
`;

export const Cell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    padding: 2px 0;
  }
`;

export const CellLabel = styled.span`
  display: none;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    display: inline-block;
  }
`;

export const FavorecidoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    color: #0f172a;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    color: #94a3b8;
    font-size: 12px;
  }
`;

export const MoneyCell = styled.span`
  font-weight: 700;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
`;

// ================================================================
// BADGES
// ================================================================

export const VoucherBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.$hasVoucher ? '#dcfce7' : '#fef3c7')};
  color: ${(props) => (props.$hasVoucher ? '#16a34a' : '#d97706')};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: ${(props) => props.$bgColor || '#f1f5f9'};
  color: ${(props) => props.$color || '#475569'};
  border: 1px solid ${(props) => props.$borderColor || '#e2e8f0'};
`;

// ================================================================
// ESTADOS VAZIOS E LOADING
// ================================================================

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #94a3b8;

  svg {
    font-size: 32px;
    color: #cbd5e1;
  }

  p {
    font-size: 15px;
    margin: 0;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: #64748b;

  svg {
    font-size: 32px;
    color: #2563eb;
    animation: ${spin} 1s linear infinite;
  }

  span {
    font-size: 15px;
  }
`;

// ================================================================
// BOTTOM BAR
// ================================================================

export const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 10px;
  flex-wrap: wrap;
  gap: 12px;
  padding: 13px 18px;
  margin-bottom: 18px;
  background: ${(props) => (props.$warning ? '#fffbeb' : '#ebf8ff')};
  border: 1px solid ${(props) => (props.$warning ? '#fde68a' : '#bee3f8')};
  border-radius: 12px;
  color: ${(props) => (props.$warning ? '#92400e' : '#2b6cb0')};
  font-size: 13px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalCard = styled.div`
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e6ebf1;

  h3 {
    margin: 0 0 6px;
    font-size: 16px;
    color: #1a202c;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #718096;
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e6ebf1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
