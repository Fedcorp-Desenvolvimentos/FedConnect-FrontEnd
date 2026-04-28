// src/hooks/useLoading.js
import { useGlobal } from '../context/GlobalContext';
import { useCallback } from 'react';

export const useLoading = () => {
  const { 
    loading, 
    setLoading, 
    loadingMessage, 
    setLoadingMessage,
    loadingProgress,
    setLoadingProgress
  } = useGlobal();

  const startLoading = useCallback((message = 'Carregando...') => {
    setLoadingMessage(message);
    setLoadingProgress(0);
    setLoading(true);
  }, [setLoading, setLoadingMessage, setLoadingProgress]);

  const updateProgress = useCallback((progress, message = null) => {
    const newProgress = Math.min(100, Math.max(0, progress));
    setLoadingProgress(newProgress);
    if (message) setLoadingMessage(message);
  }, [setLoadingProgress, setLoadingMessage]);

  const stopLoading = useCallback(() => {
    setLoadingProgress(100);
    setTimeout(() => {
      setLoading(false);
      setLoadingMessage('Carregando...');
      setLoadingProgress(0);
    }, 300);
  }, [setLoading, setLoadingMessage, setLoadingProgress]);

  const withLoading = useCallback(async (callback, message = 'Carregando...') => {
    startLoading(message);
    try {
      const result = await callback();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    loadingMessage,
    loadingProgress,
    startLoading,
    updateProgress,
    stopLoading,
    withLoading
  };
};