// Comissoes.jsx
import React from 'react';
import { FaArrowLeft, FaInfoCircle, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmissaoRecibos } from './hooks/useComissoes';
import { SummaryCards } from './components/SummaryCards';
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
  InfoBanner,
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
    isUsingFilteredData,
    hasActiveFilters,
    cancelarComissao,
  } = useEmissaoRecibos();

  const canIssue = selectedComissoes.size > 0;
  const hasResults = comissoes.length > 0;
  const isEmpty = !loading && !loadingInitial && !hasResults && hasSearched;


  console.log("previewData", previewData)

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

      {/* Banner de informação */}
      <InfoBanner isFiltered={hasActiveFilters || isUsingFilteredData}>
        <FaInfoCircle />
        <div>
          <strong>
            {hasSearched
              ? isUsingFilteredData
                ? 'Resultado da consulta'
                : 'Comissões do período'
              : '  Aguardando consulta'}
          </strong>
          <span>
            {loadingInitial
              ? 'Carregando comissões...'
              : hasSearched && comissoes.length > 0
                ? `Exibindo ${comissoes.length} comissão(ões)${totalRegistros > comissoes.length ? ` de ${totalRegistros}` : ''}`
                : hasSearched && comissoes.length === 0
                  ? 'Nenhuma comissão encontrada para os filtros selecionados'
                  : 'Utilize os filtros abaixo para consultar comissões'}
          </span>
        </div>
      </InfoBanner>

      <SummaryCards
        totals={totals}
        count={comissoes.length}
        isUsingFilteredData={isUsingFilteredData}
        hasSearched={hasSearched}
      />

      {/*
        Layout principal: a coluna da esquerda concentra o fluxo de consulta
        (filtros -> lista de comissões). A barra lateral fixa mantém retenções
        e as ações de emissão sempre visíveis, sem precisar rolar a página
        depois de selecionar as comissões.
      */}
      <PageLayout>
        <MainColumn>
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
            />
          )}
        </MainColumn>

        <Sidebar>

          {documentType !== 'recibo' && (
            <RetencoesPanel
              selectedRetentions={selectedRetentions}
              totals={retentionSummary}
              onToggleRetention={toggleRetention}
              hasResults={hasResults}
              comissoes={comissoes}
            />
          )}

          <EmissaoPanel
            canIssue={canIssue && hasResults}
            documentType={documentType}
            loading={loading}
            lastEmission={lastEmission}
            totals={retentionSummary}
            onDocumentTypeChange={setDocumentType}
            onEmitir={emitirDocumento}
            onCancel={cancelarComissao}
            onPreview={previewDocument}
            onSair={() => navigate('/')}
            selectedComissoes={selectedComissoes}
            comissoes={comissoes}
          />
        </Sidebar>
      </PageLayout>

      <PreviewModalDetails open={previewOpen} data={previewData} onClose={closePreview} />
    </Container>
  );
}