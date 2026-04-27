// src/context/GlobalContext.jsx
import { createContext, useContext, useState } from "react";
import Loading from "../components/Loading/Loading";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // mudei pra false (não começa carregando)
  const [loadingMessage, setLoadingMessage] = useState("Carregando...");
  const [loadingProgress, setLoadingProgress] = useState(0); // NOVO

  return (
    <GlobalContext.Provider value={{ 
      loading, 
      setLoading, 
      loadingMessage, 
      setLoadingMessage,
      loadingProgress,      // NOVO
      setLoadingProgress    // NOVO
    }}>
      {children}

      {loading && (
        <Loading 
          fullScreen 
          message={loadingMessage}
          progress={loadingProgress}  // NOVO - passa o progresso real
        />
      )}
    </GlobalContext.Provider>
  );
};