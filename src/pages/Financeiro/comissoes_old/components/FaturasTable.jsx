import { FaFileInvoiceDollar } from "react-icons/fa";
import {
  formatDate,
  formatMoney,
  getInvoiceStatusView,
} from "../utils/recibosComissoesUtils";

export function FaturasTable({
  faturas,
  selectedInvoices,
  allInvoicesSelected,
  onToggleInvoice,
  onToggleAllInvoices,
}) {
  return (
    <div className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaFileInvoiceDollar />
          <h2>2. Faturas</h2>
        </div>

        {/* {faturas.length > 0 && (
          <button
            type="button"
            className="link-button"
            onClick={onToggleAllInvoices}
          >
            {allInvoicesSelected ? "Desmarcar todas" : "Selecionar todas"}
          </button>
        )} */}
      </div>

      {faturas.length === 0 ? (
        <div className="empty-state">Nenhuma fatura consultada.</div>
      ) : (
        <div className="table-wrapper">
          <table className="recibos-table">
            <thead>
              <tr>
                {/* <th>
                  <input
                    type="checkbox"
                    checked={allInvoicesSelected}
                    onChange={onToggleAllInvoices}
                    aria-label="Selecionar todas as faturas"
                  />
                </th> */}
                <th>Fatura</th>
                <th>Tipo</th>
                <th>Favorecido</th>
                <th>Vencimento</th>
                <th>Parcela</th>
                <th>Valor líquido</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {faturas.map((fatura) => {
                const status = getInvoiceStatusView(fatura.status);
                const isSelected = selectedInvoices.includes(fatura.id);

                return (
                  <tr
                    key={fatura.id}
                    className={isSelected ? "selected-row" : ""}
                  >
                    {/* <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleInvoice(fatura.id)}
                        aria-label={`Selecionar fatura ${fatura.numero}`}
                      />
                    </td> */}

                    <td>{fatura.numero}</td>
                    <td>{fatura.tipo}</td>
                    <td>{fatura.favorecido}</td>
                    <td>{formatDate(fatura.vencimento)}</td>
                    <td>{fatura.parcela}</td>
                    <td>{formatMoney(fatura.valorLiquido)}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}