// src/pages/Financeiro/voucher/index.jsx

import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmissaoRecibos } from './hooks/useEmissaoRecibos';
import { SummaryCards } from './components/SummaryCards';
import { FilterForm } from './components/FilterForm';
import { FaturasTable } from './components/FaturasTable';
import { ComissoesPanel } from './components/ComissoesPanel';
import { EmissaoPanel } from './components/EmissaoPanel';
import {
  Container,
  Header,
  BackButton,
  Title,
  WorkflowGrid,
  LoadingOverlay,
} from './EmissaoRecibosVoucherStyles';

export default function EmissaoRecibosVoucher() {
  const navigate = useNavigate();
  const {
    loading,
    filters,
    showAdvancedFilters,
    comissoes,
    faturas,
    pessoas,
    selectedComissoes,
    selectedFaturas,
    documentType,
    lastEmission,
    totals,
    dataCorte,
    buscarTudo,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleFatura,
    toggleAllFaturas,
    setDocumentType,
    emitirDocumento,
    previewDocument,
  } = useEmissaoRecibos();

  // Carrega os dados ao montar
  useEffect(() => {
    buscarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canIssue = selectedComissoes.length > 0 || selectedFaturas.length > 0;

  if (loading && comissoes.length === 0 && faturas.length === 0) {
    return (
      <Container>
        <LoadingOverlay>
          <span className="spinner">⏳</span>
          Carregando dados...
        </LoadingOverlay>
      </Container>
    );
  }

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
            Consulte faturas, selecione comissões e emita recibos ou vouchers.
            <br />
            <small>Data de corte: {dataCorte}</small>
            <br />
            <small>Total de registros: {comissoes.length} comissões</small>
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

      <WorkflowGrid>
        <FaturasTable
          faturas={faturas}
          selectedFaturas={selectedFaturas}
          onToggleFatura={toggleFatura}
          onToggleAllFaturas={toggleAllFaturas}
          loading={loading}
        />

        <ComissoesPanel
          comissoes={comissoes}
          selectedComissoes={selectedComissoes}
          onToggleComissao={toggleComissao}
          onToggleAllComissoes={toggleAllComissoes}
          totals={totals}
          loading={loading}
        />
      </WorkflowGrid>

      <EmissaoPanel
        canIssue={canIssue}
        documentType={documentType}
        loading={loading}
        lastEmission={lastEmission}
        onDocumentTypeChange={setDocumentType}
        onEmitir={emitirDocumento}
        onPreview={previewDocument}
        onSair={() => navigate('/financeiro')}
      />
    </Container>
  );
}