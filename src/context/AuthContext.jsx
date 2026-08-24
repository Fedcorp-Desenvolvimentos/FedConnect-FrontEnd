// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useGlobal } from './GlobalContext.jsx';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { setLoading, setLoadingMessage } = useGlobal();
    const navigate = useNavigate();
    const authCheckedRef = useRef(false); 

    const login = useCallback(async (credentials) => {
        setLoadingMessage("Fazendo login...");
        setLoading(true);
        try {
            const response = await api.post('/login/', credentials);
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            const userResponse = await api.get('/users/me/');
            setUser(userResponse.data);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
            setUser(null);

            return {
                success: false,
                error:
                    typeof error.response?.data?.detail === 'string'
                        ? error.response.data.detail
                        : JSON.stringify(error.response?.data?.detail) || "Falha ao tentar fazer login."
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const loginGoogle = useCallback(async (credential) => {
        try {
            setLoading(true);

            const response = await api.post('/google-login/', {
                credential
            });

            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            const userResponse = await api.get('/users/me/');

            setUser(userResponse.data);
            setIsAuthenticated(true);

            return { success: true };

        } catch (error) {
            console.error(error);

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false);
            setUser(null);

            return {
                success: false,
                error: error.response?.data?.detail || 'Erro login Google'
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setLoadingMessage("Fazendo logout...");
        setLoading(true);
        // Best-effort: blacklista o refresh no backend; falha não trava o logout
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
            api.post('/logout/', { refresh }).catch(() => {});
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
        setLoading(false);
    }, [navigate]);

    // Sessão expirada detectada pelo interceptor do api.js (refresh falhou)
    useEffect(() => {
        const aoExpirarSessao = () => {
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login', { replace: true, state: { sessaoExpirada: true } });
        };
        window.addEventListener('auth:sessao-expirada', aoExpirarSessao);
        return () => window.removeEventListener('auth:sessao-expirada', aoExpirarSessao);
    }, [navigate]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (authCheckedRef.current) {
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('accessToken');
            const currentPath = window.location.pathname;
            
            const publicRoutes = [
                "/login",
                "/recuperar-senha",
                "/404"
            ];
            
            const isPublicRoute = publicRoutes.some(route => currentPath === route) || 
                                 currentPath.startsWith("/resetar-senha/") ||
                                 currentPath === "/";

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
                authCheckedRef.current = true;

                if (!isPublicRoute) {
                    navigate("/login", { replace: true });
                }
                return;
            }

            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
                setIsAuthenticated(true);
                
                if (isPublicRoute) {
                    navigate('/home', { replace: true });
                }
            } catch (error) {
                console.error("Erro ao validar token:", error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsAuthenticated(false);

                if (!isPublicRoute) {
                    navigate("/login", { replace: true, state: { sessaoExpirada: true } });
                }
            } finally {
                setIsLoading(false);
                authCheckedRef.current = true;
            }
        };
        
        checkAuthStatus();
    }, [navigate]);

    const isAuthenticatedCheck = useCallback(() => isAuthenticated, [isAuthenticated]);

    const authContextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        login,
        loginGoogle,
        logout,
        isAuthenticatedCheck
    }), [user, isAuthenticated, isLoading, login, loginGoogle, logout]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;