import { FaPrint } from "react-icons/fa";
import { formatDate, formatMoney } from "../utils/recibosComissoesUtils";

export function EmissaoPanel({
  canIssue,
  documentType,
  isIssuing,
  lastEmission,
  printPaidValue,
  selectedInvoice,
  totals,
  onDocumentTypeChange,
  onExit,
  onIssue,
  onPreview,
  onPrintPaidValueChange,
}) {
  return (
    <section className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaPrint />
          <h2>4. Emissao</h2>
        </div>
      </div>

      <div className="emissao-options">
        <label>
          Tipo de documento
          <select
            value={documentType}
            onChange={(event) => onDocumentTypeChange(event.target.value)}
          >
            <option value="recibo">Recibo</option>
            <option value="voucher">Voucher</option>
          </select>
        </label>

        <label className="checkbox-inline">
          <input
            type="checkbox"
            checked={printPaidValue}
            onChange={(event) => onPrintPaidValueChange(event.target.checked)}
          />
          Imprimir valor quitado
        </label>
      </div>

      <div className="emissao-review">
        {/* <div>
          <span>Fatura</span>
          <strong>{selectedInvoice?.numero || "-"}</strong>
        </div> */}
        <div>
          <span>Total bruto</span>
          <strong>{formatMoney(totals.grossTotal)}</strong>
        </div>
        <div>
          <span>Total retido</span>
          <strong>{formatMoney(totals.retentionTotal)}</strong>
        </div>
        <div>
          <span>Total liquido</span>
          <strong>{formatMoney(totals.netTotal)}</strong>
        </div>
      </div>

      {lastEmission && (
        <div className="emissao-result">
          Documento {lastEmission.numero} emitido em {formatDate(lastEmission.emitidoEm)}.
        </div>
      )}

      <div className="recibos-actions">
        <button
          type="button"
          className="primary-button"
          disabled={!canIssue || isIssuing}
          onClick={onIssue}
        >
          <FaPrint />
          {isIssuing ? "Emitindo" : "Emitir documento"}
        </button>

        <button
          type="button"
          className="secondary-button"
          disabled={!canIssue}
          onClick={onPreview}
        >
          Pre-visualizar
        </button>

        <button type="button" className="ghost-button" onClick={onExit}>
          Sair
        </button>
      </div>
    </section>
  );
}
