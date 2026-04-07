// pages/Cadastro/hooks/useEmpresas.js
import { useState, useEffect, useCallback } from 'react';
import { CompanyService } from '../../../../../services/companyService';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CompanyService.getAllCompanies();
      const empresasList = response.data || response || [];
      setEmpresas(Array.isArray(empresasList) ? empresasList : []);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setError('Erro ao carregar a lista de empresas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  return {
    empresas,
    loading,
    error,
    refetch: fetchEmpresas
  };
};