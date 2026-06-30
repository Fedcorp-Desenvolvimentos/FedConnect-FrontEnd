import React from 'react';
import { FaFileInvoiceDollar, FaReceipt, FaCheckCircle, FaFilter } from 'react-icons/fa';
import { SummaryGrid, SummaryCard } from '../EmissaoRecibosVoucherStyles';

export const SummaryCards = ({ totals, count, isUsingFilteredData }) => {
  const cards = [
    {
      label: 'Comissões exibidas',
      value: count || 0,
      icon: <FaReceipt />,
      color: '#2b6cb0',
      helper: isUsingFilteredData ? 'Resultado filtrado' : 'Base padrão',
    },
    {
      label: 'Selecionadas',
      value: totals.count || 0,
      icon: <FaFilter />,
      color: '#805ad5',
      helper: 'Prontas para emissão',
    },
    {
      label: 'Valor bruto',
      value: `R$ ${(totals.grossTotal || 0).toFixed(2).replace('.', ',')}`,
      icon: <FaFileInvoiceDollar />,
      color: '#38a169',
      helper: 'Soma das selecionadas',
    },
    {
      label: 'Valor líquido',
      value: `R$ ${(totals.netTotal || 0).toFixed(2).replace('.', ',')}`,
      icon: <FaCheckCircle />,
      color: '#2b6cb0',
      helper: 'Após retenções',
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
            <small>{card.helper}</small>
          </div>
        </SummaryCard>
      ))}
    </SummaryGrid>
  );
};
