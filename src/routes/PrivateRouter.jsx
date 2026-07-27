// src/routes/PrivateRouter.js
import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;