// src/pages/Financeiro/voucher/EmissaoRecibosVoucher.jsx

import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmissaoRecibos } from './hooks/useEmissaoRecibos';
import { SummaryCards } from './components/SummaryCards';
import { FilterForm } from './components/FilterForm';
import { FaturasTable } from './components/FaturasTable';
import { ComissoesPanel } from './components/ComissoesPanel';
import { EmissaoPanel } from './components/EmissaoPanel';
import { RetencoesPanel } from './components/RetencoesPanel';
import {
  Container,
  Header,
  BackButton,
  Title,
  WorkflowGrid,
  SkeletonCard,
  SkeletonRow,
} from './EmissaoRecibosVoucherStyles';

export default function EmissaoRecibosVoucher() {
  const navigate = useNavigate();
  const {
    loading,
    loadingFaturas,
    loadingMore,
    filters,
    showAdvancedFilters,
    comissoes,
    faturas,
    pessoas,
    selectedComissoes,
    selectedFaturas,
    selectedRetentions,
    documentType,
    lastEmission,
    totals,
    retentionSummary,
    dataCorte,
    totalRegistros,
    hasMore,
    buscarTudo,
    carregarMais,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleFatura,
    toggleAllFaturas,
    toggleRetention,
    setDocumentType,
    emitirDocumento,
    previewDocument,
  } = useEmissaoRecibos();

  useEffect(() => {
    buscarTudo();
  }, []); // eslint-disable-line

  const canIssue = selectedComissoes.size > 0 || selectedFaturas.size > 0;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/financeiro')}>
          <FaArrowLeft />
          Voltar
        </BackButton>

        <Title>
          <span>Financeiro / Comissões</span>
          <h1>Emissão de Recibos de Comissões</h1>
          <p>
            Consulte faturas, selecione comissões, aplique retenções e emita recibos ou vouchers.
            <br />
            <small>Data de corte: {dataCorte}</small>
            <br />
            <small>Total de registros: {totalRegistros} comissões</small>
          </p>
        </Title>
      </Header>

      <SummaryCards totals={totals} count={comissoes.length} />

      <FilterForm
        filters={filters}
        pessoas={pessoas}
        loading={loading}
        showAdvanced={showAdvancedFilters}
        onFilterChange={updateFilter}
        onSearch={buscarTudo}
        onClear={clearFilters}
        onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
      />

      <RetencoesPanel
        selectedRetentions={selectedRetentions}
        totals={retentionSummary}
        onToggleRetention={toggleRetention}
      />

      <WorkflowGrid>
        {loadingFaturas ? (
          <SkeletonCard>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </SkeletonCard>
        ) : (
          <FaturasTable
            faturas={faturas}
            selectedFaturas={selectedFaturas}
            onToggleFatura={toggleFatura}
            onToggleAllFaturas={toggleAllFaturas}
            loading={loadingFaturas}
          />
        )}

        {loading ? (
          <SkeletonCard>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </SkeletonCard>
        ) : (
          <ComissoesPanel
            comissoes={comissoes}
            selectedComissoes={selectedComissoes}
            onToggleComissao={toggleComissao}
            onToggleAllComissoes={toggleAllComissoes}
            totals={totals}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={carregarMais}
            totalRegistros={totalRegistros}
          />
        )}
      </WorkflowGrid>

      <EmissaoPanel
        canIssue={canIssue}
        documentType={documentType}
        loading={loading}
        lastEmission={lastEmission}
        totals={retentionSummary}
        onDocumentTypeChange={setDocumentType}
        onEmitir={emitirDocumento}
        onPreview={previewDocument}
        onSair={() => navigate('/financeiro')}
      />
    </Container>
  );
}