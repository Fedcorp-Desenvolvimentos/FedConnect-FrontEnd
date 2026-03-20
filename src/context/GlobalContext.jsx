// GlobalContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import Loading from "../components/Loading/Loading";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // ← MUDE PARA TRUE para teste
  const [loadingMessage, setLoadingMessage] = useState("Carregando...");

  // Remova o loading após 3 segundos para teste
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <GlobalContext.Provider value={{ 
      loading, 
      setLoading, 
      loadingMessage, 
      setLoadingMessage 
    }}>
      {children}

      {loading && (
        <Loading 
          fullScreen 
          message={loadingMessage}
        />
      )}
    </GlobalContext.Provider>
  );
};