import React, { useEffect } from 'react';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
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
} from './EmissaoRecibosVoucherStyles';

export default function EmissaoRecibosVoucher() {
  const navigate = useNavigate();

  const {
    loading,
    loadingInitial,
    loadingMore,
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
    hasMore,
    buscarTudo,
    carregarMais,
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

  useEffect(() => {
    buscarTudo({ forceDefault: true });
  }, []); // eslint-disable-line

  const canIssue = selectedComissoes.size > 0;

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

      <InfoBanner isFiltered={hasActiveFilters || isUsingFilteredData}>
        <FaInfoCircle />
        <div>
          <strong>
            {isUsingFilteredData ? 'Resultado filtrado' : 'Base padrão do período'}: {dataCorteFormatada}
          </strong>
          <span>
            {loadingInitial
              ? 'Carregando comissões do período...'
              : comissoes.length > 0
                ? `Exibindo ${comissoes.length} comissão(ões)${
                    totalRegistros > comissoes.length ? ` de ${totalRegistros}` : ''
                  }`
                : 'Nenhuma comissão encontrada para este período'}
          </span>
        </div>
      </InfoBanner>

      <SummaryCards
        totals={totals}
        count={comissoes.length}
        isUsingFilteredData={isUsingFilteredData}
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
      />

      <SingleColumnGrid>
        {loadingInitial ? (
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
            totals={retentionSummary}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={carregarMais}
            totalRegistros={totalRegistros}
            dataCorte={dataCorte}
            dataCorteFormatada={dataCorteFormatada}
            isUsingFilteredData={isUsingFilteredData}
          />
        )}
      </SingleColumnGrid>

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
