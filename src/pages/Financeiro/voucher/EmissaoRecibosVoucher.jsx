// EmissaoRecibosVoucher.jsx - VERSÃO REFATORADA
import React, { useEffect } from 'react';
import { FaArrowLeft, FaInfoCircle, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEmissaoRecibos } from './hooks/useEmissaoRecibos';
import { SummaryCards } from './components/SummaryCards';
import { FilterForm } from './components/FilterForm';
import { ComissoesPanel } from './components/ComissoesPanel';
import { EmissaoPanel } from './components/EmissaoPanel';
import { RetencoesPanel } from './components/RetencoesPanel';
import {
  Container,
  Header,
  BackButton,
  Title,
  SingleColumnGrid,
  SkeletonCard,
  SkeletonRow,
  InfoBanner,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
} from './EmissaoRecibosVoucherStyles';

export default function EmissaoRecibosVoucher() {
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
    dataCorte,
    dataCorteFormatada,
    totalRegistros,
    hasSearched,
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
    isUsingFilteredData,
    hasActiveFilters,
  } = useEmissaoRecibos();

  // 🔥 NÃO CARREGA MAIS AUTOMATICAMENTE - APENAS QUANDO O USUÁRIO CLICAR EM "BUSCAR"
  // useEffect removido!

  const canIssue = selectedComissoes.size > 0;
  const hasResults = comissoes.length > 0;
  const isEmpty = !loading && !loadingInitial && !hasResults && hasSearched;

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
            Consulte comissões, aplique retenções e prepare recibos ou vouchers
            com base no período de corte.
          </p>
        </Title>
      </Header>

      {/* Banner de informação - mostra estado atual */}
      <InfoBanner isFiltered={hasActiveFilters || isUsingFilteredData}>
        <FaInfoCircle />
        <div>
          <strong>
            {hasSearched
              ? isUsingFilteredData
                ? '✅ Resultado da consulta'
                : '✅ Comissões do período'
              : '🔍 Aguardando consulta'}
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
        hasResults={hasResults}
      />

      <SingleColumnGrid>
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
                ? 'Tente ajustar os filtros ou alterar a data de corte'
                : 'Selecione uma data de corte e clique em "Buscar" para consultar as comissões'}
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
            dataCorte={dataCorte}
            dataCorteFormatada={dataCorteFormatada}
            isUsingFilteredData={isUsingFilteredData}
            hasSearched={hasSearched}
          />
        )}
      </SingleColumnGrid>

      <EmissaoPanel
        canIssue={canIssue && hasResults}
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