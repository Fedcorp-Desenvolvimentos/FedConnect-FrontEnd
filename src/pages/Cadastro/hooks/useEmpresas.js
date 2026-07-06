import { useState, useEffect } from 'react';
import { CompanyService } from '../../../services/companyService';
import { useLoading } from '../../../hooks/useLoading';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [error, setError] = useState(null);

  const { withLoading } = useLoading();

  const fetchEmpresas = async () => {
    try {
      await withLoading(async () => {
        const response = await CompanyService.getAllCompanies();
        // console.log('Empresas recebidas da API:', response);
        const empresasList = response.data || response || [];

        const uniqueEmpresas = [];
        const cnpjSet = new Set();

        for (const empresa of (Array.isArray(empresasList) ? empresasList : [])) {
          if (!cnpjSet.has(empresa.CNPJ)) {
            cnpjSet.add(empresa.CNPJ);
            uniqueEmpresas.push(empresa);
          }
        }

        setEmpresas(uniqueEmpresas);
      }, 'Carregando empresas...');

      setError(null);
    } catch (error) {
      console.error(error);
      setError('Erro ao carregar empresas');
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return {
    empresas,
    error,
    refetch: fetchEmpresas
  };
};