// src/hooks/usePessoasSearch.js

import { useState, useCallback, useRef } from 'react';
import { buscarPessoas } from '../services/pessoaService';

export const usePessoasSearch = () => {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const buscarPessoasPorNome = useCallback(async (termo) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!termo || termo.length < 2) {
      setResultados([]);
      return;
    }

    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await buscarPessoas({ 
          search: termo, 
          limit: 20 
        });
        
        let pessoas = [];
        if (response?.data && Array.isArray(response.data)) {
          pessoas = response.data;
        }
        
        setResultados(pessoas);
      } catch (err) {
        console.error('❌ Erro ao buscar pessoas:', err);
        setError(err.message);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  const limparResultados = useCallback(() => {
    setResultados([]);
    setError(null);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  return {
    resultados,
    loading,
    error,
    buscarPessoasPorNome,
    limparResultados,
  };
};