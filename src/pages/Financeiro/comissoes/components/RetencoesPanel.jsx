import { FaExclamationTriangle } from "react-icons/fa";
import { retentionOptions } from "../data/recibosComissoesMock";
import { formatMoney } from "../utils/recibosComissoesUtils";

export function RetencoesPanel({ selectedRetentions, totals, onToggleRetention }) {
  return (
    <section className="recibos-card warning-card">
      <div>
        <FaExclamationTriangle />
        <div>
          <h2>Retencoes tributarias</h2>
          <p>Total retido: {formatMoney(totals.retentionTotal)}</p>
        </div>
      </div>

      <div className="retencoes-list">
        {retentionOptions.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={selectedRetentions.includes(item.id)}
              onChange={() => onToggleRetention(item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </section>
  );
}
