// src/hooks/usePessoasSearch.js

import { useState, useCallback, useRef, useEffect } from 'react';
import { buscarPessoas } from '../services/pessoaService';

export const usePessoasSearch = () => {
  const [allPessoas, setAllPessoas] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  // Carrega TODAS as pessoas uma única vez
  const carregarTodasPessoas = useCallback(async () => {
    if (hasLoadedRef.current) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await buscarPessoas({ limit: 1000, offset: 0 });
      
      let pessoasList = [];
      if (response?.data && Array.isArray(response.data)) {
        pessoasList = response.data;
      }
      
      setAllPessoas(pessoasList);
      setResultados(pessoasList);
      hasLoadedRef.current = true;
      return pessoasList;
    } catch (err) {
      console.error('❌ Erro ao carregar pessoas:', err);
      setError(err.message);
      setAllPessoas([]);
      setResultados([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtro local (client-side) como o Cedente
  const buscarPessoasPorNome = useCallback((termo) => {
    if (!termo || termo.length < 2) {
      setResultados(allPessoas);
      return allPessoas;
    }

    const termoLower = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const termoDigits = termo.replace(/\D/g, '');
    
    const resultadosFiltrados = allPessoas.filter(pessoa => {
      const nome = (pessoa.nome || pessoa.NOME || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cpfCnpj = (pessoa.cpf_cnpj || pessoa.CPF_CNPJ || '').replace(/\D/g, '');
      const codigo = String(pessoa.pessoa || pessoa.PESSOA || pessoa.codigo || '');
      
      return nome.includes(termoLower) || 
             (termoDigits && cpfCnpj.includes(termoDigits)) ||
             codigo.includes(termo);
    });

    setResultados(resultadosFiltrados);
    return resultadosFiltrados;
  }, [allPessoas]);

  const limparResultados = useCallback(() => {
    setResultados(allPessoas);
    setError(null);
  }, [allPessoas]);

  useEffect(() => {
    carregarTodasPessoas();
  }, [carregarTodasPessoas]);

  return {
    resultados,
    loading,
    error,
    carregarTodasPessoas,
    buscarPessoasPorNome,
    limparResultados,
  };
};