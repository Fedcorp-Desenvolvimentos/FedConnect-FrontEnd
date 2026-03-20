// PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading/Loading';

const PrivateRoute = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    
    let isMounted = true;

    const verifyAuthentication = async () => {
      try {
        await api.get('users/me/');
        if (isMounted) {
          setAuthState({ isAuthenticated: true, isLoading: false });
        }
      } catch (error) {
        if (isMounted) {
          setAuthState({ isAuthenticated: false, isLoading: false });
        }
      }
    };

    verifyAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);


  if (authState.isLoading) {
    return <Loading fullScreen message="Carregando..." />;
  }

  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;