// src/hooks/useBancos.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { buscarBancos } from '../services/bancoService';

export const useBancos = () => {
  const [bancos, setBancos] = useState([]);
  const [filteredBancos, setFilteredBancos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  // Carrega TODOS os bancos uma única vez
  const carregarBancos = useCallback(async () => {
    if (hasLoadedRef.current) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await buscarBancos({ limit: 500, offset: 0 });
      
      let bancosList = [];
      if (response?.data && Array.isArray(response.data)) {
        bancosList = response.data;
      }
      
      setBancos(bancosList);
      setFilteredBancos(bancosList);
      hasLoadedRef.current = true;
      return bancosList;
    } catch (error) {
      console.error('❌ Erro ao carregar bancos:', error);
      setError(error.message);
      setBancos([]);
      setFilteredBancos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtro local (client-side) como o Cedente
  const buscarBancosPorNome = useCallback((termo) => {
    if (!termo || termo.length < 2) {
      setFilteredBancos(bancos);
      return bancos;
    }

    const termoLower = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const termoDigits = termo.replace(/\D/g, '');
    
    const resultados = bancos.filter(banco => {
      const nome = (banco.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const codigo = String(banco.codigo || '');
      return nome.includes(termoLower) || codigo.includes(termo);
    });

    setFilteredBancos(resultados);
    return resultados;
  }, [bancos]);

  useEffect(() => {
    carregarBancos();
  }, [carregarBancos]);

  return {
    bancos: filteredBancos,
    loading,
    error,
    carregarBancos,
    buscarBancosPorNome,
  };
};