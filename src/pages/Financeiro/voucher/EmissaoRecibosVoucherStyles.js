// src/pages/Financeiro/voucher/EmissaoRecibosVoucher/styles.js

import styled from 'styled-components';

export const Container = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const Header = styled.section`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #4a5568;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #2b6cb0;
  }
`;

export const Title = styled.div`
  flex: 1;

  span {
    font-size: 14px;
    color: #718096;
  }

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1a202c;
    margin: 4px 0 8px;
  }

  p {
    font-size: 14px;
    color: #4a5568;
    margin: 0;
  }
`;

export const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const SummaryCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .icon {
    font-size: 28px;
    color: #2b6cb0;
  }

  div {
    display: flex;
    flex-direction: column;

    span {
      font-size: 13px;
      color: #718096;
    }

    strong {
      font-size: 20px;
      font-weight: 600;
      color: #1a202c;
    }
  }
`;

export const Card = styled.section`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 24px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  > div {
    display: flex;
    align-items: center;
    gap: 12px;

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const FormGroup = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;

  input, select {
    height: 40px;
    padding: 0 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2b6cb0;
      box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.1);
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background: #2b6cb0;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #1a4f8b;
    }
  }

  &.secondary {
    background: #e2e8f0;
    color: #2d3748;

    &:hover:not(:disabled) {
      background: #cbd5e0;
    }
  }

  &.ghost {
    background: transparent;
    color: #4a5568;

    &:hover:not(:disabled) {
      background: #f7fafc;
    }
  }

  &.success {
    background: #38a169;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #2f855a;
    }
  }

  &.danger {
    background: #e53e3e;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #c53030;
    }
  }
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 12px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: #f7fafc;

    th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 2px solid #e2e8f0;
    }
  }

  tbody {
    tr {
      transition: background 0.15s;

      &:hover {
        background: #f7fafc;
      }

      &.selected {
        background: #ebf8ff;
      }

      td {
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
        color: #2d3748;
      }
    }
  }
`;

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;

  &.paid {
    background: #c6f6d5;
    color: #22543d;
  }

  &.pending {
    background: #fefcbf;
    color: #744210;
  }

  &.overdue {
    background: #fed7d7;
    color: #742a2a;
  }
`;

export const ComissaoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 12px;
`;

export const ComissaoItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.checked ? '#ebf8ff' : '#f7fafc'};
  border: 1px solid ${props => props.checked ? '#bee3f8' : '#e2e8f0'};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #90cdf4;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 14px;
      color: #2d3748;
    }

    span {
      font-size: 13px;
      color: #718096;
    }
  }

  .value {
    font-weight: 600;
    color: #2b6cb0;
  }
`;

export const TotalsBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 24px;
  padding: 12px 16px;
  margin-top: 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 14px;

  span {
    color: #4a5568;
  }

  strong {
    color: #1a202c;
  }

  .net {
    font-size: 16px;
    color: #2b6cb0;
  }
`;

export const EmissaoOptions = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4a5568;

    select {
      height: 36px;
      padding: 0 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
`;

export const EmissionResult = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #c6f6d5;
  border-radius: 8px;
  color: #22543d;
  font-size: 14px;
`;

export const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #718096;
  font-size: 14px;
`;

export const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #4a5568;
  font-size: 16px;

  .spinner {
    animation: spin 1s linear infinite;
    margin-right: 12px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;