import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import * as S from './HistoricoStyles';
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import SearchBar from './components/SearchBar';
import HistoricoTable from './components/HistoricoTable';
import Pagination from './components/Pagination';
import { useHistorico } from './hooks/useHistorico';
import { useDetalhesConsulta } from './hooks/useDetalhesConsulta';
import { useFiltroPaginacao } from './hooks/useFiltroPaginacao';

const Historico = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [porPagina] = useState(20);
  const [pagina, setPagina] = useState(1);
  
  const { 
    consultas, 
    loading, 
    error, 
    totalResultados,
    totalPaginas: totalPaginasAPI
  } = useHistorico(pagina, porPagina, enqueueSnackbar);
  
  const {
    selectedConsultaId,
    detalhesConsulta,
    loading: detalhesLoading,
    error: detalhesError,
    toggleDetalhes
  } = useDetalhesConsulta(enqueueSnackbar);
  
  const {
    filtro,
    consultasFiltradas,
    totalFiltrados,
    totalPaginas: totalPaginasFiltro,
    handleFiltroChange
  } = useFiltroPaginacao(consultas, porPagina);
  
  useEffect(() => {
    setPagina(1);
  }, [filtro]);
  
  const detalhesMap = {};
  const loadingMap = {};
  const errorMap = {};
  
  if (selectedConsultaId && detalhesConsulta) {
    detalhesMap[selectedConsultaId] = detalhesConsulta;
    loadingMap[selectedConsultaId] = detalhesLoading;
    errorMap[selectedConsultaId] = detalhesError;
  }
  
  const handlePageChange = (novaPagina) => {
    setPagina(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const totalPaginas = filtro ? totalPaginasFiltro : totalPaginasAPI;
  const resultadosExibidos = filtro ? consultasFiltradas : consultas;
  const totalExibidos = filtro ? totalFiltrados : totalResultados;

  if (loading && consultas.length === 0) {
    return (
      <PageTemplate
        title="Histórico de Consultas"
        subtitle="Visualize todas as consultas realizadas na plataforma"
      >
        <S.LoadingContainer>
          <FaSpinner className="spinner" />
          <p>Carregando histórico...</p>
        </S.LoadingContainer>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Histórico de Consultas"
      subtitle="Visualize todas as consultas realizadas na plataforma"
    >
      <S.Container>
        <SearchBar 
          value={filtro}
          onChange={handleFiltroChange}
        />
        
        {error && (
          <S.ErrorMessage>
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </S.ErrorMessage>
        )}
        
        {!error && (
          <>
            <HistoricoTable
              consultas={resultadosExibidos}
              expandedId={selectedConsultaId}
              onToggle={toggleDetalhes}
              detalhesMap={detalhesMap}
              loadingMap={loadingMap}
              errorMap={errorMap}
            />
            
            <Pagination
              currentPage={pagina}
              totalPages={totalPaginas}
              totalItems={totalExibidos}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </S.Container>
    </PageTemplate>
  );
};

export default Historico;