// src/hooks/useBancos.js

import { useState, useEffect, useCallback } from 'react';
import { buscarBancos, buscarBancoPorNome } from '../services/bancoService';

export const useBancos = () => {
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carregarBancos = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarBancos({ search, limit: 200 });
      
      let bancosList = [];
      if (response?.data && Array.isArray(response.data)) {
        bancosList = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        bancosList = response.data;
      }
      
      setBancos(bancosList);
      return bancosList;
    } catch (error) {
      console.error('❌ Erro ao carregar bancos:', error);
      setError(error.message);
      setBancos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarBancosPorNome = useCallback(async (nome) => {
    if (!nome || nome.length < 2) {
      return carregarBancos();
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await buscarBancoPorNome(nome);
      
      let bancosList = [];
      if (response?.data && Array.isArray(response.data)) {
        bancosList = response.data;
      }
      
      setBancos(bancosList);
      return bancosList;
    } catch (error) {
      console.error('❌ Erro ao buscar bancos por nome:', error);
      setError(error.message);
      setBancos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [carregarBancos]);

  useEffect(() => {
    carregarBancos();
  }, [carregarBancos]);

  return {
    bancos,
    loading,
    error,
    carregarBancos,
    buscarBancosPorNome,
  };
};