import { useEffect, useState } from "react";
import { CursoCipaService } from "../../../../services/cursoCipaService";
import { registrarCoresLocais } from "../CursoCipaStyles";

/**
 * Locais do curso, do cadastro (RF-CIP-007). `todos` inclui os desativados —
 * o histórico precisa deles para filtrar turmas antigas.
 */
export function useLocaisCipa({ todos = false } = {}) {
  const [locais, setLocais] = useState([]);

  useEffect(() => {
    let vivo = true;
    CursoCipaService.listarLocais({ todos })
      .then((lista) => {
        if (!vivo) return;
        registrarCoresLocais(lista || []);
        setLocais(lista || []);
      })
      .catch(() => vivo && setLocais([]));
    return () => {
      vivo = false;
    };
  }, [todos]);

  return locais;
}

export default useLocaisCipa;
