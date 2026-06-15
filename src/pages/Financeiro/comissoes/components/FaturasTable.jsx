import { FaFileInvoiceDollar } from "react-icons/fa";
import {
  formatDate,
  formatMoney,
  getInvoiceStatusView,
} from "../utils/recibosComissoesUtils";

export function FaturasTable({ faturas, selectedInvoice, onSelectInvoice }) {
  return (
    <div className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaFileInvoiceDollar />
          <h2>2. Faturas</h2>
        </div>
      </div>

      {faturas.length === 0 ? (
        <div className="empty-state">Nenhuma fatura consultada.</div>
      ) : (
        <div className="table-wrapper">
          <table className="recibos-table">
            <thead>
              <tr>
                <th>Fatura</th>
                <th>Tipo</th>
                <th>Favorecido</th>
                <th>Vencimento</th>
                <th>Parcela</th>
                <th>Valor liquido</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {faturas.map((fatura) => {
                const status = getInvoiceStatusView(fatura.status);

                return (
                  <tr
                    key={fatura.id}
                    className={selectedInvoice?.id === fatura.id ? "selected-row" : ""}
                    onClick={() => onSelectInvoice(fatura)}
                  >
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
