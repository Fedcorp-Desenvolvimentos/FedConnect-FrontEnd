// pages/Historico/hooks/useDetalhesConsulta.js
import { useState, useCallback } from 'react';
import { ConsultaService } from '../../../../../services/consultaService';

export const useDetalhesConsulta = () => {
  const [selectedConsultaId, setSelectedConsultaId] = useState(null);
  const [detalhesConsulta, setDetalhesConsulta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetalhes = useCallback(async (consultaId) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await ConsultaService.getHistoryByID(consultaId);
      setDetalhesConsulta(data);
      return data;
    } catch (err) {
      console.error('Erro ao carregar detalhes:', err);
      setError('Não foi possível carregar os detalhes desta consulta.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDetalhes = useCallback(async (consultaId) => {
    if (selectedConsultaId === consultaId) {
      setSelectedConsultaId(null);
      setDetalhesConsulta(null);
      return;
    }
    
    setSelectedConsultaId(consultaId);
    await fetchDetalhes(consultaId);
  }, [selectedConsultaId, fetchDetalhes]);

  const clearDetalhes = useCallback(() => {
    setSelectedConsultaId(null);
    setDetalhesConsulta(null);
    setError('');
  }, []);

  return {
    selectedConsultaId,
    detalhesConsulta,
    loading: loading,
    error,
    toggleDetalhes,
    clearDetalhes
  };
};