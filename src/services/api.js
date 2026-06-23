// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://fedconnect-backend-d6kgr.ondigitalocean.app/",
  // baseURL: "http://localhost:8000/",
});

// Intercepta todas as requisições Axios teste
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Se o token existir, adicione-o ao cabeçalho Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const publicRoutes = ["/", "/login", "/esqueci-senha", "/resetar-senha", "/404"];

const isPublic = publicRoutes.some((route) =>
  window.location.pathname.startsWith(route)
);

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
