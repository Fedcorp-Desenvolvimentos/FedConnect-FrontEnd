// pages/Historico/hooks/useFiltroPaginacao.js
import { useState, useMemo, useEffect } from 'react';

export const useFiltroPaginacao = (consultas, initialItemsPerPage = 20) => {
  const [filtro, setFiltro] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(initialItemsPerPage);

  const consultasFiltradas = useMemo(() => {
    const termo = filtro.toLowerCase().trim();
    if (!termo) return consultas;
    
    return consultas.filter((consulta) => {
      return (
        (consulta.tipo_consulta_display || consulta.tipo_consulta || '').toLowerCase().includes(termo) ||
        (consulta.parametro_consulta || '').toLowerCase().includes(termo) ||
        (consulta.usuario_email || '').toLowerCase().includes(termo)
      );
    });
  }, [consultas, filtro]);

  const totalFiltrados = consultasFiltradas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalFiltrados / porPagina));

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;
  const consultasPaginadas = consultasFiltradas.slice(inicio, fim);

  const handleFiltroChange = (novoFiltro) => {
    setFiltro(novoFiltro);
    setPagina(1);
  };

  return {
    filtro,
    pagina,
    porPagina,
    consultasFiltradas: consultasPaginadas,
    totalFiltrados,
    totalPaginas,
    setPagina,
    handleFiltroChange
  };
};