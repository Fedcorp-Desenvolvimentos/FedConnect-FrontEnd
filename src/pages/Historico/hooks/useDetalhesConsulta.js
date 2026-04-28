import { useState, useCallback } from 'react';
import { ConsultaService } from '../../../services/consultaService';
import { useLoading } from '../../../hooks/useLoading';

export const useDetalhesConsulta = (enqueueSnackbar) => {
  const [selectedConsultaId, setSelectedConsultaId] = useState(null);

  const [detalhesMap, setDetalhesMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const { withLoading } = useLoading();

  const fetchDetalhes = useCallback(async (consultaId) => {
    setErrorMap(prev => ({ ...prev, [consultaId]: '' }));

    try {
      await withLoading(async () => {
        const data = await ConsultaService.getHistoryByID(consultaId);

        setDetalhesMap(prev => ({
          ...prev,
          [consultaId]: data
        }));
      }, 'Carregando detalhes...');
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);

      setErrorMap(prev => ({
        ...prev,
        [consultaId]: 'Não foi possível carregar os detalhes desta consulta.'
      }));

      enqueueSnackbar('Erro ao carregar detalhes', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  const toggleDetalhes = useCallback(async (consultaId) => {
    const id = String(consultaId);

    if (selectedConsultaId === id) {
      setSelectedConsultaId(null);
      return;
    }

    setSelectedConsultaId(id);

    if (!detalhesMap[id]) {
      await fetchDetalhes(id);
    }
  }, [selectedConsultaId, detalhesMap, fetchDetalhes]);

  return {
    selectedConsultaId,
    detalhesMap,
    errorMap,
    toggleDetalhes
  };
};