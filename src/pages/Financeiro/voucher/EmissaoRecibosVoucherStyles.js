import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f7fafc;
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #edf2f7;
  border: none;
  border-radius: 8px;
  color: #2d3748;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    transform: translateX(-2px);
  }
`;

export const Title = styled.div`
  flex: 1;

  span {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: #718096;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: #718096;
    margin: 4px 0 0 0;
  }
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  margin-bottom: 20px;
  background: ${(props) => (props.isFiltered ? '#fffbeb' : '#ebf8ff')};
  border: 1px solid ${(props) => (props.isFiltered ? '#fde68a' : '#bee3f8')};
  border-radius: 10px;
  color: ${(props) => (props.isFiltered ? '#92400e' : '#2b6cb0')};

  svg {
    font-size: 20px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 14px;
    }

    span {
      font-size: 13px;
      color: ${(props) => (props.isFiltered ? '#78350f' : '#2c5282')};
    }
  }
`;

export const SingleColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f7;
  gap: 12px;
  flex-wrap: wrap;

  > div {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    h2 {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    span {
      font-size: 13px;
      color: #718096;
    }
  }

  .link-button {
    background: none;
    border: none;
    color: #2b6cb0;
    font-size: 13px;
    cursor: pointer;
    text-decoration: underline;
    padding: 4px 8px;

    &:hover {
      color: #1a365d;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background: #ebf8ff;
    color: #2b6cb0;
  }
`;

export const SkeletonCard = styled(Card)`
  padding: 20px;
`;

export const SkeletonRow = styled.div`
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: ${pulse} 1.5s ease-in-out infinite;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    font-size: 24px;
    color: #2b6cb0;
    background: #ebf8ff;
    padding: 10px;
    border-radius: 8px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;

    span {
      font-size: 13px;
      color: #718096;
    }

    strong {
      font-size: 20px;
      font-weight: 700;
      color: #1a202c;
    }

    small {
      font-size: 11px;
      color: #a0aec0;
      margin-top: 4px;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

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
  gap: 4px;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #4a5568;
  }

  input,
  select {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
    background: white;

    &:focus {
      outline: none;
      border-color: #2b6cb0;
      box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.1);
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }
  }

  small {
    color: #a0aec0;
    font-size: 11px;
  }
`;

export const ComissaoList = styled.div`
  max-height: 560px;
  overflow-y: auto;
  border: 1px solid #edf2f7;
  border-radius: 10px;
`;

export const ComissaoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #edf2f7;
  transition: background 0.15s;
  background: ${(props) => (props.checked ? '#ebf8ff' : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.checked ? '#dbeafe' : '#f7fafc')};
  }

  &:last-child {
    border-bottom: none;
  }

  input[type='checkbox'] {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #2b6cb0;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;

    strong {
      font-size: 14px;
      color: #2d3748;
    }

    span {
      font-size: 13px;
      color: #4a5568;
      word-break: break-word;
    }
  }

  .value {
    font-weight: 700;
    color: #2b6cb0;
    font-size: 15px;
    white-space: nowrap;
  }
`;

export const TotalsBar = styled.div`
  display: flex;
  gap: 24px;
  padding: 12px 16px;
  margin-top: 12px;
  background: #f7fafc;
  border-radius: 8px;
  flex-wrap: wrap;

  span {
    font-size: 14px;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }

  .net {
    color: #2b6cb0;
    font-weight: 600;
  }
`;

export const EmissaoOptions = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4a5568;
    flex-wrap: wrap;

    select {
      height: 36px;
      padding: 0 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      background: white;
    }
  }
`;

export const EmissionResult = styled.div`
  padding: 12px 16px;
  margin: 12px 0;
  background: #c6f6d5;
  border-radius: 8px;
  color: #22543d;
  font-size: 14px;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 42px;

  &.primary {
    background: #2b6cb0;
    color: white;

    &:hover:not(:disabled) {
      background: #1a365d;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(43, 108, 176, 0.2);
    }
  }

  &.secondary {
    background: #edf2f7;
    color: #2d3748;

    &:hover:not(:disabled) {
      background: #e2e8f0;
    }
  }

  &.ghost {
    background: transparent;
    color: #718096;

    &:hover:not(:disabled) {
      background: #f7fafc;
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

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #a0aec0;
  font-size: 14px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: #718096;

  svg,
  .spin {
    font-size: 28px;
    color: #2b6cb0;
    animation: ${spin} 1s linear infinite;
  }
`;

// styles/EmissaoRecibosVoucherStyles.js - ADICIONAR NOVOS ESTILOS

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: #cbd5e0;
  margin-bottom: 16px;

  svg {
    display: inline-block;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: #718096;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;

  strong {
    color: #2b6cb0;
  }
`;
