// src/hooks/useLoading.js

import { useGlobal } from '../context/GlobalContext';

export const useLoading = () => {
  const { loading, setLoading, loadingMessage, setLoadingMessage } = useGlobal();

  const startLoading = (message = 'Carregando...') => {
    setLoadingMessage(message);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
    setLoadingMessage('Carregando...');
  };

  const withLoading = async (callback, message = 'Carregando...') => {
    try {
      startLoading(message);
      const result = await callback();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  };
};