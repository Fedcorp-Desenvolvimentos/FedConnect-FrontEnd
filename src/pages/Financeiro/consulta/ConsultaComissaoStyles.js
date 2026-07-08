import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 20px 24px 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: #fff;
  padding: 18px 22px;
  border-radius: 14px;
  border: 1px solid #e6ebf1;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #edf2f7;
  border: none;
  border-radius: 9px;
  color: #2d3748;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #e2e8f0;
    transform: translateX(-2px);
  }
`;

export const Title = styled.div`
  flex: 1;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 13.5px;
    color: #718096;
    margin: 4px 0 0 0;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e6ebf1;
  margin-bottom: 20px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6ebf1;
  gap: 12px;
  flex-wrap: wrap;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: #2b6cb0;
      font-size: 15px;
    }

    h2 {
      font-size: 15px;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  grid-column: ${(props) => (props.$span ? `span ${props.$span}` : 'auto')};

  label, > span {
    font-size: 12.5px;
    font-weight: 600;
    color: #4a5568;
  }

  input,
  select {
    height: 38px;
    padding: 0 12px;
    border: 1px solid #dbe2ea;
    border-radius: 8px;
    font-size: 13.5px;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: white;
    color: #1a202c;

    &:focus {
      outline: none;
      border-color: #2b6cb0;
      box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.12);
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 40px;

  &.primary {
    background: #2b6cb0;
    color: white;

    &:hover:not(:disabled) {
      background: #1a365d;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(43, 108, 176, 0.25);
    }
  }

  &.danger {
    background: #dd6b20;
    color: white;

    &:hover:not(:disabled) {
      background: #c05621;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(221, 107, 32, 0.25);
    }
  }

  &.ghost {
    background: transparent;
    color: #718096;
    border: 1px solid #e6ebf1;

    &:hover:not(:disabled) {
      background: #f7fafc;
      color: #2d3748;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

export const ResultsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;

  span {
    font-size: 13px;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }
`;

export const Table = styled.div`
  border: 1px solid #e6ebf1;
  border-radius: 12px;
  overflow: hidden;
`;

export const TableHead = styled.div`
  display: grid;
  grid-template-columns: 36px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 10px 14px;
  background: #f4f6f9;
  font-size: 11px;
  font-weight: 700;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 36px 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 11px 14px;
  border-top: 1px solid #e6ebf1;
  font-size: 13px;
  align-items: center;
  background: ${(props) => (props.$checked ? '#ebf8ff' : 'transparent')};
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${(props) => (props.$checked ? '#dbeefc' : '#f7fafc')};
  }

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 14px;
  }

  input[type='checkbox'] {
    width: 17px;
    height: 17px;
    cursor: pointer;
    accent-color: #2b6cb0;

    @media (max-width: 1024px) {
      align-self: flex-start;
    }
  }
`;

export const CellLabel = styled.span`
  display: none;
  font-size: 10.5px;
  color: #a0aec0;
  text-transform: uppercase;

  @media (max-width: 1024px) {
    display: inline;
    margin-right: 6px;
  }
`;

export const FavorecidoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    color: #2d3748;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    color: #a0aec0;
    font-size: 11px;
  }
`;

export const VoucherBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) => (props.$emitido ? '#e9f8ee' : '#fff4e8')};
  color: ${(props) => (props.$emitido ? '#1f9d55' : '#dd6b20')};
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${(props) =>
    props.$status === 'baixada' || props.$status === 'baixadas'
      ? '#e9f8ee'
      : '#fff4e8'};
  color: ${(props) =>
    props.$status === 'baixada' || props.$status === 'baixadas'
      ? '#1f9d55'
      : '#dd6b20'};
`;

export const MoneyCell = styled.span`
  font-weight: 700;
  color: #1a202c;
  font-variant-numeric: tabular-nums;
`;

export const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 14px 18px;
  background: #f4f6f9;
  border-radius: 10px;
  flex-wrap: wrap;
  gap: 10px;

  span {
    font-size: 13px;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 56px 20px;
  color: #a0aec0;
  font-size: 14px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #718096;

  svg {
    font-size: 28px;
    color: #2b6cb0;
    animation: ${spin} 1s linear infinite;
  }
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  margin-bottom: 18px;
  background: ${(props) => (props.$warning ? '#fffbeb' : '#ebf8ff')};
  border: 1px solid ${(props) => (props.$warning ? '#fde68a' : '#bee3f8')};
  border-radius: 12px;
  color: ${(props) => (props.$warning ? '#92400e' : '#2b6cb0')};
  font-size: 13px;
`;
