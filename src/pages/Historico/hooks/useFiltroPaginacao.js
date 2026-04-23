import { useState, useMemo } from 'react';

export const useFiltroPaginacao = (consultas, initialItemsPerPage = 20) => {
  const [filtro, setFiltro] = useState('');
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

  const handleFiltroChange = (novoFiltro) => {
    setFiltro(novoFiltro);
  };

  return {
    filtro,
    consultasFiltradas,
    totalFiltrados,
    totalPaginas,
    handleFiltroChange
  };
};