import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Card, CardHeader } from '../EmissaoRecibosVoucherStyles';
import styled from 'styled-components';

const WarningCard = styled(Card)`
  border: 1px solid #fed7aa;
  background: #fff7ed;
  margin-bottom: 16px;
`;

const WarningContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    margin-top: 3px;
    color: #f97316;
    font-size: 20px;
  }

  h2 {
    margin: 0;
    font-size: 17px;
    color: #92400e;
  }

  p {
    margin: 5px 0 0;
    color: #9a3412;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const RetentionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;

  label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: #334155;
    cursor: pointer;
    padding: 8px 10px;
    border: 1px solid #fed7aa;
    border-radius: 8px;
    background: #ffffffaa;

    input[type='checkbox'] {
      cursor: pointer;
    }
  }
`;

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

export function RetencoesPanel({ selectedRetentions, totals, onToggleRetention }) {
  const retentionOptions = [
    { id: 'iss', label: 'ISS', rate: 0.02 },
    { id: 'ir', label: 'IR', rate: 0.015 },
    { id: 'cofins', label: 'COFINS', rate: 0.03 },
    { id: 'csll', label: 'CSLL', rate: 0.01 },
    { id: 'pis', label: 'PIS', rate: 0.0065 },
    { id: 'inss', label: 'INSS', rate: 0.11 },
  ];

  return (
    <WarningCard>
      <CardHeader>
        <div>
          <FaExclamationTriangle />
          <h2>Retenções Tributárias</h2>
        </div>
      </CardHeader>

      <WarningContent>
        <div>
          <p>
            Total bruto: <strong>{formatMoney(totals.grossTotal)}</strong> | Total retido:{' '}
            <strong>{formatMoney(totals.retentionTotal)}</strong> | Líquido:{' '}
            <strong>{formatMoney(totals.netTotal)}</strong>
            {totals.count > 0 && ` | ${totals.count} comissão(ões) selecionada(s)`}
          </p>
        </div>
      </WarningContent>

      <RetentionList>
        {retentionOptions.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={selectedRetentions.includes(item.id)}
              onChange={() => onToggleRetention(item.id)}
            />
            {item.label} ({(item.rate * 100).toFixed(item.rate * 100 % 1 ? 2 : 0)}%)
          </label>
        ))}
      </RetentionList>
    </WarningCard>
  );
}
