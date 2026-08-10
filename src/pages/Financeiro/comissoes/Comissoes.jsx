// src/pages/Financeiro/comissoes/Comissoes.jsx

import React from 'react';
import { FaArrowLeft, FaSearch, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmissaoRecibos } from './hooks/useComissoes';
import { FilterForm } from './components/FilterForm';
import { ComissoesPanel } from './components/ComissoesPanel';
import { EmissaoPanel } from './components/EmissaoPanel';
import { RetencoesPanel } from './components/RetencoesPanel';
import { PreviewModalDetails } from './components/PreviewModalDetails';
import {
  Container,
  Header,
  BackButton,
  Title,
  PageLayout,
  MainColumn,
  Sidebar,
  SkeletonCard,
  SkeletonRow,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
} from './ComissoesStyles';

export default function Comissoes() {
  const navigate = useNavigate();

  const {
    loading,
    loadingInitial,
    filters,
    showAdvancedFilters,
    comissoes,
    pessoas,
    selectedComissoes,
    selectedRetentions,
    documentType,
    lastEmission,
    totals,
    retentionSummary,
    produtos,
    totalRegistros,
    hasSearched,
    previewOpen,
    previewData,
    buscarTudo,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleRetention,
    setDocumentType,
    emitirDocumento,
    previewDocument,
    closePreview,
    handleExportExcel,
    isUsingFilteredData,
    hasActiveFilters,
    retencoesVerificadas,
    loadingPreview,
  } = useEmissaoRecibos();

  const canIssue = selectedComissoes?.size > 0;
  const hasResults = comissoes?.length > 0;
  const isEmpty = !loading && !loadingInitial && !hasResults && hasSearched;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
          Voltar
        </BackButton>

        <Title>
          <span>Financeiro / Comissões</span>
          <h1>Comissões</h1>
          <p>
            Consulte comissões, aplique retenções e prepare recibos ou vouchers
            com base no período de corte.
          </p>
        </Title>
      </Header>

      <PageLayout>
        <MainColumn>
          <FilterForm
            filters={filters}
            pessoas={pessoas}
            produtos={produtos}
            loading={loading}
            showAdvanced={showAdvancedFilters}
            onFilterChange={updateFilter}
            onSearch={buscarTudo}
            onClear={clearFilters}
            onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
          />

          {loadingInitial ? (
            <SkeletonCard>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </SkeletonCard>
          ) : isEmpty ? (
            <EmptyStateContainer>
              <EmptyStateIcon>
                <FaSearch />
              </EmptyStateIcon>
              <EmptyStateTitle>Nenhuma comissão encontrada</EmptyStateTitle>
              <EmptyStateText>
                {hasActiveFilters
                  ? 'Tente ajustar os filtros'
                  : 'Clique em "Buscar" para consultar as comissões'}
              </EmptyStateText>
            </EmptyStateContainer>
          ) : !hasSearched ? (
            <EmptyStateContainer>
              <EmptyStateIcon>
                <FaSearch />
              </EmptyStateIcon>
              <EmptyStateTitle>Faça uma consulta</EmptyStateTitle>
              <EmptyStateText>
                Preencha os filtros acima e clique em <strong>Buscar</strong> para visualizar as comissões
              </EmptyStateText>
            </EmptyStateContainer>
          ) : (
            <ComissoesPanel
              comissoes={comissoes}
              selectedComissoes={selectedComissoes}
              onToggleComissao={toggleComissao}
              onToggleAllComissoes={toggleAllComissoes}
              totals={retentionSummary}
              loading={loading}
              totalRegistros={totalRegistros}
              isUsingFilteredData={isUsingFilteredData}
              hasSearched={hasSearched}
              onExportExcel={handleExportExcel}
              hasResults={hasResults}
            />
          )}
        </MainColumn>

        <Sidebar>
          <RetencoesPanel
            selectedRetentions={selectedRetentions}
            totals={retentionSummary}
            onToggleRetention={toggleRetention}
            hasResults={hasResults}
            comissoes={comissoes}
            retencoesVerificadas={retencoesVerificadas}
            loading={loading}
            selectedComissoes={selectedComissoes}
            documentType={documentType}
          />

          <EmissaoPanel
            canIssue={canIssue && hasResults}
            documentType={documentType}
            loading={loading}
            loadingPreview={loadingPreview}
            lastEmission={lastEmission}
            totals={retentionSummary}
            onDocumentTypeChange={setDocumentType}
            onEmitir={emitirDocumento}
            onPreview={previewDocument}
            onSair={() => navigate('/')}
            selectedComissoes={selectedComissoes}
            comissoes={comissoes}
          />
        </Sidebar>
      </PageLayout>

      <PreviewModalDetails open={previewOpen} data={previewData} onClose={closePreview} onEmitir={emitirDocumento} loading={loading} />
    </Container>
  );
}