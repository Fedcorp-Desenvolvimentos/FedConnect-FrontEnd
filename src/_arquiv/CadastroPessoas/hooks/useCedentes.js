// src/pages/CadastroPessoas/hooks/useCedentes.js

import { useState, useEffect, useCallback } from 'react';
import { buscarCedentes, buscarCedentePorNome } from '../../../services/cedenteService';

export const useCedentes = () => {
  const [cedentes, setCedentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarCedentes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarCedentes();
      console.log("📦 Cedentes carregados:", response);
      
      // Extrai o array da resposta
      let cedentesList = [];
      if (response?.sucesso && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (Array.isArray(response)) {
        cedentesList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        cedentesList = response.data;
      }
      
      setCedentes(cedentesList);
      return cedentesList;
    } catch (error) {
      console.error('❌ Erro ao carregar cedentes:', error);
      setError(error.message);
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
      
      let cedentesList = [];
      if (response?.sucesso && Array.isArray(response.data)) {
        cedentesList = response.data;
      } else if (Array.isArray(response)) {
        cedentesList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        cedentesList = response.data;
      }
      
      setCedentes(cedentesList);
      return cedentesList;
    } catch (error) {
      console.error('❌ Erro ao buscar cedentes por nome:', error);
      setError(error.message);
      setCedentes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [carregarCedentes]);

  useEffect(() => {
    carregarCedentes();
  }, [carregarCedentes]);

  return {
    cedentes,
    loading,
    error,
    carregarCedentes,
    buscarCedentesPorNome
  };
};