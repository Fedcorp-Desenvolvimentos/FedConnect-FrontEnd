// PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isAuthenticatedCheck } = useAuth();
  const [ isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      isAuthenticatedCheck();
    }
    setIsAuthChecked(true);
  }, [isAuthenticated]);

  if (!isAuthChecked) {
    return <Loading fullScreen message="Carregando..." />;
  }

  // Adiciona redirecionamento se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;