// pages/Historico/Historico.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import PageLayout from '../../../PageLayout/PageLayout';
import { useHistorico } from './hooks/useHistorico';
import { useDetalhesConsulta } from './hooks/useDetalhesConsulta';
import { useFiltroPaginacao } from './hooks/useFiltroPaginacao';
import SearchBar from './SearchBar';
import HistoricoTable from './HistoricoTable';
import Pagination from './Pagination';
import './styles/Historico.css';

const Historico = () => {
  const { user } = useAuth();
  const [porPagina] = useState(20);
  const [pagina, setPagina] = useState(1);
  
  const { 
    consultas, 
    loading, 
    error, 
    totalResultados,
    totalPaginas: totalPaginasAPI
  } = useHistorico(user, pagina, porPagina);
  
  const {
    selectedConsultaId,
    detalhesConsulta,
    loading: detalhesLoading,
    error: detalhesError,
    toggleDetalhes
  } = useDetalhesConsulta();
  
  const {
    filtro,
    consultasFiltradas,
    totalFiltrados,
    totalPaginas: totalPaginasFiltro,
    handleFiltroChange
  } = useFiltroPaginacao(consultas, porPagina);
  
  // Reset pagination when filter changes
  useEffect(() => {
    setPagina(1);
  }, [filtro]);
  
  // Create maps for quick lookup of detalhes
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
  
  return (
    <PageLayout
      title="Histórico de Consultas"
      subtitle="Visualize todas as consultas realizadas na plataforma"
    >
      <div className="historico-container">
        <SearchBar 
          value={filtro}
          onChange={handleFiltroChange}
          placeholder="Buscar por tipo, parâmetro ou email..."
        />
        
        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando histórico...</p>
          </div>
        )}
        
        {!loading && !error && (
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
      </div>
    </PageLayout>
  );
};

export default Historico;