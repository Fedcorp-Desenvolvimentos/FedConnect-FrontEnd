import { FaReceipt } from "react-icons/fa";
import { formatDate, formatMoney } from "../utils/recibosComissoesUtils";

export function ComissoesPanel({
  comissoes,
  selectedCommissions,
  selectedInvoice,
  totals,
  onToggleAllCommissions,
  onToggleCommission,
}) {
  const allSelected =
    comissoes.length > 0 && selectedCommissions.length === comissoes.length;

  return (
    <div className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaReceipt />
          <h2>3. Comissoes</h2>
        </div>
      </div>

      {!selectedInvoice ? (
        <div className="empty-state">Selecione uma fatura.</div>
      ) : comissoes.length === 0 ? (
        <div className="empty-state">Nenhuma comissao disponivel.</div>
      ) : (
        <>
          <div className="commission-toolbar">
            <strong>Fatura selecionada: {selectedInvoice.numero}</strong>

            <button
              type="button"
              className="link-button"
              onClick={onToggleAllCommissions}
            >
              {allSelected ? "Desmarcar todas" : "Selecionar todas"}
            </button>
          </div>

          <div className="commission-list">
            {comissoes.map((comissao) => (
              <label key={comissao.id} className="commission-item">
                <input
                  type="checkbox"
                  checked={selectedCommissions.includes(comissao.id)}
                  onChange={() => onToggleCommission(comissao.id)}
                />

                <div>
                  <strong>{comissao.produto}</strong>
                  <span>
                    {comissao.cliente} | {comissao.competencia} |{" "}
                    {formatDate(comissao.data)}
                  </span>
                </div>

                <strong>{formatMoney(comissao.valor)}</strong>
              </label>
            ))}
          </div>

          <div className="commission-totals">
            <span>Bruto: {formatMoney(totals.grossTotal)}</span>
            <span>Retencoes: {formatMoney(totals.retentionTotal)}</span>
            <strong>Liquido: {formatMoney(totals.netTotal)}</strong>
          </div>
        </>
      )}
    </div>
  );
}
