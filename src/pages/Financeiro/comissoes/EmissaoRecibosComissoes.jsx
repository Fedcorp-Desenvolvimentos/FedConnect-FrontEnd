import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ComissoesPanel } from "./components/ComissoesPanel";
import { ConsultaRecibosForm } from "./components/ConsultaRecibosForm";
import { EmissaoPanel } from "./components/EmissaoPanel";
import { FaturasTable } from "./components/FaturasTable";
import { RetencoesPanel } from "./components/RetencoesPanel";
import { SummaryCards } from "./components/SummaryCards";
import { useEmissaoRecibosComissoes } from "./hooks/useEmissaoRecibosComissoes";
import "./EmissaoRecibosComissoes.css";

export default function EmissaoRecibosComissoes() {
  const navigate = useNavigate();
  const {
    clearAll,
    comissoes,
    documentType,
    filters,
    faturas,
    isIssuing,
    isSearching,
    issueDocument,
    lastEmission,
    previewDocument,
    printPaidValue,
    retentionSummary,
    searchInvoices,
    selectedCommissions,
    selectedInvoice,
    selectedRetentions,
    setDocumentType,
    setPrintPaidValue,
    setShowAdvancedFilters,
    showAdvancedFilters,
    selectInvoice,
    summary,
    toggleAllCommissions,
    toggleCommission,
    toggleRetention,
    updateFilter,
  } = useEmissaoRecibosComissoes();

  const canIssue = Boolean(selectedInvoice && selectedCommissions.length > 0);

  return (
    <main className="recibos-page">
      <section className="recibos-header">
        <button
          type="button"
          className="recibos-back"
          onClick={() => navigate("/financeiero")}
        >
          <FaArrowLeft />
          Voltar
        </button>

        <div className="recibos-title">
          <span>Financeiro / Comissoes</span>
          <h1>Emissao de Recibos de Comissoes</h1>
          <p>
            Consulte faturas, selecione comissoes, aplique retencoes e emita
            recibos ou vouchers.
          </p>
        </div>
      </section>

      <SummaryCards summary={summary} />

      <ConsultaRecibosForm
        filters={filters}
        isSearching={isSearching}
        onClear={clearAll}
        onFilterChange={updateFilter}
        onSearch={searchInvoices}
        onToggleAdvanced={() => setShowAdvancedFilters((current) => !current)}
        showAdvancedFilters={showAdvancedFilters}
      />

      <RetencoesPanel
        selectedRetentions={selectedRetentions}
        totals={retentionSummary}
        onToggleRetention={toggleRetention}
      />

      <section className="recibos-workflow-grid">
        <FaturasTable
          faturas={faturas}
          selectedInvoice={selectedInvoice}
          onSelectInvoice={selectInvoice}
        />

        <ComissoesPanel
          comissoes={comissoes}
          selectedCommissions={selectedCommissions}
          selectedInvoice={selectedInvoice}
          totals={retentionSummary}
          onToggleAllCommissions={toggleAllCommissions}
          onToggleCommission={toggleCommission}
        />
      </section>

      <EmissaoPanel
        canIssue={canIssue}
        documentType={documentType}
        isIssuing={isIssuing}
        lastEmission={lastEmission}
        printPaidValue={printPaidValue}
        selectedInvoice={selectedInvoice}
        totals={retentionSummary}
        onDocumentTypeChange={setDocumentType}
        onExit={() => navigate(ROUTES.FINANCEIRO)}
        onIssue={issueDocument}
        onPreview={previewDocument}
        onPrintPaidValueChange={setPrintPaidValue}
      />
    </main>
  );
}
