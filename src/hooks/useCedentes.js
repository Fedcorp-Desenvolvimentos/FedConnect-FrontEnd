// src/hooks/useCedentes.js

import { useState, useEffect, useCallback } from 'react';
import { buscarCedentes, buscarCedentePorNome } from '../services/cedenteService';

export const useCedentes = () => {
  const [cedentes, setCedentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarCedentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarCedentes();
      
      // console.log('📦 Resposta carregarCedentes:', response);
      
      let cedentesList = [];
      if (response?.status === 'success' && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (response?.sucesso && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (Array.isArray(response)) {
        cedentesList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        cedentesList = response.data;
      }
      
      // console.log('✅ Cedentes carregados:', cedentesList.length);
      setCedentes(cedentesList);
      return cedentesList;
    } catch (error) {
      console.error('❌ Erro ao carregar cedentes:', error);
      setError(error.message || 'Erro ao carregar cedentes');
      setCedentes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarCedentesPorNome = useCallback(async (nome) => {
    if (!nome || nome.length < 2) {
      return carregarCedentes();
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await buscarCedentePorNome(nome);
      
      // console.log(`🔍 Resposta buscarCedentesPorNome("${nome}"):`, response);
      // console.log(`🔍 Status:`, response?.status);
      // console.log(`🔍 Data:`, response?.data);
      // console.log(`🔍 Sucesso:`, response?.sucesso);
      
      let cedentesList = [];
      if (response?.status === 'success' && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (response?.sucesso && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (Array.isArray(response)) {
        cedentesList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        cedentesList = response.data;
      }
      
      // console.log(`✅ Encontrados ${cedentesList.length} cedentes para "${nome}"`);
      setCedentes(cedentesList);
      return cedentesList;
    } catch (error) {
      console.error('❌ Erro ao buscar cedentes por nome:', error);
      setError(error.message || 'Erro ao buscar cedentes');
      setCedentes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [carregarCedentes]);

  return {
    cedentes,
    loading,
    error,
    carregarCedentes,
    buscarCedentesPorNome
  };
};