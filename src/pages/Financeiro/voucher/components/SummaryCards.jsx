// src/pages/Financeiro/voucher/components/SummaryCards.jsx

import React from 'react';
import { FaFileInvoiceDollar, FaReceipt, FaCheckCircle, FaSlidersH } from 'react-icons/fa';
import { SummaryGrid, SummaryCard } from '../EmissaoRecibosVoucherStyles';

export const SummaryCards = ({ totals, count }) => {
  const cards = [
    {
      label: 'Comissões encontradas',
      value: count || 0,
      icon: <FaReceipt />,
    },
    {
      label: 'Valor Bruto',
      value: `R$ ${totals.grossTotal?.toFixed(2) || '0,00'}`,
      icon: <FaFileInvoiceDollar />,
    },
    {
      label: 'Retenções',
      value: `R$ ${totals.retentionTotal?.toFixed(2) || '0,00'}`,
      icon: <FaSlidersH />,
    },
    {
      label: 'Valor Líquido',
      value: `R$ ${totals.netTotal?.toFixed(2) || '0,00'}`,
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <SummaryGrid>
      {cards.map((card) => (
        <SummaryCard key={card.label}>
          <span className="icon">{card.icon}</span>
          <div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        </SummaryCard>
      ))}
    </SummaryGrid>
  );
};