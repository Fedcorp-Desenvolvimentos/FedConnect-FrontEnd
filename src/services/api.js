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

// Rotas onde 401 é resposta legítima (credencial/refresh inválido) — nunca renovar
const ROTAS_AUTH = ["login/", "google-login/", "login/refresh/"];

const isRotaAuth = (url) => {
  const limpa = String(url || "").replace(/^\//, "");
  return ROTAS_AUTH.includes(limpa);
};

// Calculada no momento do erro (spec auth-refresh-token — o cálculo no load
// do módulo congelava o pathname da primeira página)
const rotaPublicaAgora = () => {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/resetar-senha")) return true;
  return ["/", "/login", "/recuperar-senha", "/404"].includes(pathname);
};

// Renovação single-flight: N requisições com 401 simultâneo compartilham a
// mesma Promise de refresh. Axios cru para não passar pelos interceptors.
let refreshEmAndamento = null;

const renovarAccess = () => {
  if (!refreshEmAndamento) {
    const refresh = localStorage.getItem("refreshToken");
    refreshEmAndamento = axios
      .post(`${api.defaults.baseURL}login/refresh/`, { refresh })
      .then((response) => {
        const { access, refresh: novoRefresh } = response.data;
        localStorage.setItem("accessToken", access);
        // Rotação ativa no backend: o refresh usado foi blacklistado
        if (novoRefresh) {
          localStorage.setItem("refreshToken", novoRefresh);
        }
        return access;
      })
      .finally(() => {
        refreshEmAndamento = null;
      });
  }
  return refreshEmAndamento;
};

const encerrarSessao = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (!rotaPublicaAgora()) {
    window.dispatchEvent(new CustomEvent("auth:sessao-expirada"));
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (error.response?.status !== 401 || !config || isRotaAuth(config.url)) {
      return Promise.reject(error);
    }

    // Retry único por requisição; sem refresh armazenado não há o que renovar
    if (config._retry || !localStorage.getItem("refreshToken")) {
      encerrarSessao();
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      const access = await renovarAccess();
      config.headers.Authorization = `Bearer ${access}`;
      return api(config);
    } catch (refreshError) {
      encerrarSessao();
      return Promise.reject(error);
    }
  }
);

export default api;
