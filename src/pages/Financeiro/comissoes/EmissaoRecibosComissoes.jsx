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
    pessoas,
    previewDocument,
    printPaidValue,
    retentionSummary,
    searchInvoices,

    selectedInvoices,
    selectedCommissions,
    selectedRetentions,

    allInvoicesSelected,
    allCommissionsSelected,

    setDocumentType,
    setPrintPaidValue,
    setShowAdvancedFilters,
    showAdvancedFilters,

    summary,

    toggleAllInvoices,
    toggleInvoice,
    toggleAllCommissions,
    toggleCommission,
    toggleRetention,
    updateFilter,
  } = useEmissaoRecibosComissoes();

  const canIssue =
    selectedInvoices.length > 0 || selectedCommissions.length > 0;

  return (
    <main className="recibos-page">
      <section className="recibos-header">
        <button
          type="button"
          className="recibos-back"
          onClick={() => navigate("/financeiro")}
        >
          <FaArrowLeft />
          Voltar
        </button>

        <div className="recibos-title">
          <span>Financeiro / Comissões</span>
          <h1>Emissão de Recibos de Comissões</h1>
          <p>
            Consulte faturas, selecione comissões, aplique retenções e emita
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
        pessoas={pessoas}
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
          selectedInvoices={selectedInvoices}
          allInvoicesSelected={allInvoicesSelected}
          onToggleInvoice={toggleInvoice}
          onToggleAllInvoices={toggleAllInvoices}
        />

        <ComissoesPanel
          comissoes={comissoes}
          selectedCommissions={selectedCommissions}
          allCommissionsSelected={allCommissionsSelected}
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
        selectedInvoices={selectedInvoices}
        selectedCommissions={selectedCommissions}
        totals={retentionSummary}
        onDocumentTypeChange={setDocumentType}
        onExit={() => navigate("/financeiro")}
        onIssue={issueDocument}
        onPreview={previewDocument}
        onPrintPaidValueChange={setPrintPaidValue}
      />
    </main>
  );
}