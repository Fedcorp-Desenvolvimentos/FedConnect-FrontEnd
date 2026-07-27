// src/services/api.js
import axios from "axios";

const ambiente = "dev";

const api = axios.create({
  baseURL: "https://fedconnect-backend-d6kgr.ondigitalocean.app/",
  // baseURL: "http://localhost:8000/",
});

// Intercepta todas as requisições Axios
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// CORREÇÃO: Verificação correta de rotas públicas
const publicRoutes = ["/", "/login", "/recuperar-senha", "/resetar-senha", "/404"];

const isPublic = publicRoutes.some((route) => {
  const pathname = window.location.pathname;

  // Caso especial para /resetar-senha/:token
  if (route === "/resetar-senha") {
    return pathname.startsWith("/resetar-senha/") || pathname === "/resetar-senha";
  }

  // Para as outras rotas, verificação exata
  return pathname === route;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isPublic) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
)

export default api;