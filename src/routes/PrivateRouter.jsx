// src/routes/PrivateRouter.js
import { Outlet, Navigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { useAuth } from '../context/AuthContext';

/**
 * Guarda de rota.
 *
 * `allowed` é opcional: sem ela o comportamento é o de sempre (só autenticação).
 * Com ela, o nível do usuário precisa estar na lista — é a guarda real que faltava
 * para rotas restritas, hoje escondidas apenas no menu.
 */
const PrivateRoute = ({ allowed }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowed && !allowed.includes(user?.nivel_acesso)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
