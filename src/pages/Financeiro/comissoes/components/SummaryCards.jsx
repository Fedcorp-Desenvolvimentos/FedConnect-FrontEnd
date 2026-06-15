import {
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaReceipt,
  FaSlidersH,
} from "react-icons/fa";

export function SummaryCards({ summary }) {
  const cards = [
    {
      label: "Faturas encontradas",
      value: summary.invoices,
      icon: <FaFileInvoiceDollar />,
    },
    {
      label: "Comissoes selecionadas",
      value: summary.selectedCommissions,
      icon: <FaReceipt />,
    },
    {
      label: "Total liquido",
      value: summary.netTotal,
      icon: <FaCheckCircle />,
    },
    {
      label: "Status",
      value: summary.status,
      icon: <FaSlidersH />,
    },
  ];

  return (
    <section className="recibos-summary-grid" aria-label="Resumo da emissao">
      {cards.map((card) => (
        <div className="recibos-summary-card" key={card.label}>
          {card.icon}
          <div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}
