import { useState, useEffect, useCallback } from 'react';
import { ConsultaService } from '../../../services/consultaService';
import { useLoading } from '../../../hooks/useLoading';

export const useHistorico = (pagina, porPagina, enqueueSnackbar) => {
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState('');
  const [totalResultados, setTotalResultados] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const { withLoading } = useLoading();

  const fetchHistorico = useCallback(async () => {
    setError('');

    try {
      await withLoading(async () => {
        const data = await ConsultaService.getConsultaHistory(pagina, porPagina);

        setConsultas(data.results || data);
        setTotalResultados(data.count || (data.results ? data.results.length : 0));

        if (data.count) {
          setTotalPaginas(Math.max(1, Math.ceil(data.count / porPagina)));
        } else {
          setTotalPaginas(1);
        }
      }, 'Carregando histórico...');
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Não foi possível carregar o histórico de consultas.');
      enqueueSnackbar('Erro ao carregar histórico', { variant: 'error' });
    }
  }, [pagina, porPagina, enqueueSnackbar]);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  return {
    consultas,
    error,
    totalResultados,
    totalPaginas,
    refetch: fetchHistorico
  };
};