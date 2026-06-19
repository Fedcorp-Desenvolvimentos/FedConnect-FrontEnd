import { FaReceipt } from "react-icons/fa";
import { formatDate, formatMoney } from "../utils/recibosComissoesUtils";

export function ComissoesPanel({
  comissoes,
  selectedCommissions,
  totals,
  allCommissionsSelected,
  onToggleAllCommissions,
  onToggleCommission,
}) {
  return (
    <div className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaReceipt />
          <h2>3. Comissões</h2>
        </div>

        {comissoes.length > 0 && (
          <button
            type="button"
            className="link-button"
            onClick={onToggleAllCommissions}
          >
            {allCommissionsSelected ? "Desmarcar todas" : "Selecionar todas"}
          </button>
        )}
      </div>

      {comissoes.length === 0 ? (
        <div className="empty-state">
          Nenhuma comissão encontrada para os filtros informados.
        </div>
      ) : (
        <>
          <div className="commission-toolbar">
            <strong>
              {comissoes.length} comissão(ões) encontrada(s)
            </strong>

            <span>
              {selectedCommissions.length} selecionada(s)
            </span>
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
                    Fatura {comissao.faturaNumero} | {comissao.cliente} |{" "}
                    {comissao.competencia} | {formatDate(comissao.data)}
                  </span>
                </div>

                <strong>{formatMoney(comissao.valor)}</strong>
              </label>
            ))}
          </div>

          <div className="commission-totals">
            <span>Bruto: {formatMoney(totals.grossTotal)}</span>
            <span>Retenções: {formatMoney(totals.retentionTotal)}</span>
            <strong>Líquido: {formatMoney(totals.netTotal)}</strong>
          </div>
        </>
      )}
    </div>
  );
}