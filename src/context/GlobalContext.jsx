import { createContext, useContext, useState } from "react";
import Loading from "../components/Loading/Loading";

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Carregando...");

  return (
    <GlobalContext.Provider value={{ loading, setLoading, loadingMessage, setLoadingMessage }}>
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