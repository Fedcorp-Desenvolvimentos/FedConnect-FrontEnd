import { useState, useEffect, useCallback } from 'react';
import { pessoaService } from '../../../services/cedenteService';

export const useCedentes = () => {
  const [cedentes, setCedentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const carregarCedentes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await pessoaService.buscarCedentes();
      if (response.sucesso) {
        setCedentes(response.data || []);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar cedentes:', error);
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
    try {
      const response = await pessoaService.buscarCedentePorNome(nome);
      if (response.sucesso) {
        setCedentes(response.data || []);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar cedentes por nome:', error);
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
    searchTerm,
    setSearchTerm,
    carregarCedentes,
    buscarCedentesPorNome
  };
};