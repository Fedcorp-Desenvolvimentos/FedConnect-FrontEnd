import React from 'react';
import { FaPercentage } from 'react-icons/fa';
import {
  RetentionCard,
  CardHeader,
  RetentionStats,
  RetentionOptionList,
  RetentionOption,
} from '../ComissoesStyles';

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const formatRate = (rate) => `${(rate * 100).toFixed(rate * 100 % 1 ? 2 : 0)}%`;

export function RetencoesPanel({ selectedRetentions, totals, onToggleRetention, hasResults }) {
  return (
    <RetentionCard>
      <CardHeader>
        <div>
          <FaPercentage />
          <h2>Retenções</h2>
          <span>Aplicadas sobre o total selecionado</span>
        </div>
      </CardHeader>

      <RetentionStats>
        <div>
          <span>Bruto</span>
          <strong>{formatMoney(totals.grossTotal)}</strong>
        </div>
        <div className="retained">
          <span>Retido</span>
          <strong>{formatMoney(totals.retentionTotal)}</strong>
        </div>
        <div className="net" style={{ gridColumn: '1 / -1' }}>
          <span>Líquido a repassar</span>
          <strong>{formatMoney(totals.netTotal)}</strong>
        </div>
      </RetentionStats>

      <RetentionOptionList>
        {RETENTION_OPTIONS.map((item) => {
          const checked = selectedRetentions.includes(item.id);
          const value = hasResults ? totals.grossTotal * item.rate : 0;

          return (
            <RetentionOption key={item.id} checked={checked}>
              <span className="left">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleRetention(item.id)}
                />
                <span className="name">{item.label}</span>
                <span className="rate">{formatRate(item.rate)}</span>
              </span>
              <span className="amount">{checked ? `- ${formatMoney(value)}` : formatMoney(0)}</span>
            </RetentionOption>
          );
        })}
      </RetentionOptionList>
    </RetentionCard>
  );
}