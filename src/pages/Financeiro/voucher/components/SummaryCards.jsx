// src/pages/Financeiro/voucher/components/SummaryCards.jsx

import React from 'react';
import { FaFileInvoiceDollar, FaReceipt, FaSlidersH, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';
import { SummaryGrid, SummaryCard } from '../EmissaoRecibosVoucherStyles';

export const SummaryCards = ({ totals, count }) => {
  const cards = [
    {
      label: 'Comissões encontradas',
      value: count || 0,
      icon: <FaReceipt />,
      color: '#2b6cb0'
    },
    {
      label: 'Faturas selecionadas',
      value: totals.selectedFaturasCount || 0,
      icon: <FaFileInvoice />,
      color: '#805ad5'
    },
    {
      label: 'Valor Bruto',
      value: `R$ ${(totals.grossTotal || 0).toFixed(2).replace('.', ',')}`,
      icon: <FaFileInvoiceDollar />,
      color: '#38a169'
    },
    {
      label: 'Valor Líquido',
      value: `R$ ${(totals.netTotal || 0).toFixed(2).replace('.', ',')}`,
      icon: <FaCheckCircle />,
      color: '#2b6cb0'
    },
  ];

  return (
    <SummaryGrid>
      {cards.map((card) => (
        <SummaryCard key={card.label}>
          <div className="icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
            {card.icon}
          </div>
          <div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        </SummaryCard>
      ))}
    </SummaryGrid>
  );
};