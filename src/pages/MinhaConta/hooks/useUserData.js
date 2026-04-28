import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../../../services/userService';
import { useLoading } from '../../../hooks/useLoading';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userId: null,
    nomeCompleto: '',
    cpf: '',
    email: ''
  });

  const [error, setError] = useState(null);
  const { withLoading } = useLoading();

  const fetchUserData = useCallback(async () => {
    try {
      await withLoading(async () => {
        const data = await UserService.getMe();

        setUserData({
          userId: data.id,
          nomeCompleto: data.nome_completo || '',
          email: data.email || '',
          cpf: data.cpf || ''
        });
      }, 'Carregando dados do usuário...');

      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Erro ao carregar dados do usuário');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    error,
    refreshUserData: fetchUserData
  };
};