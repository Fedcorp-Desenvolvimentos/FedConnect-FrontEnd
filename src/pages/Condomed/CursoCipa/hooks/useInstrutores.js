import { useEffect, useState } from "react";
import { CursoCipaService } from "../../../../services/cursoCipaService";

/**
 * Instrutores que assinam o certificado, para o select da turma.
 *
 * Vem do cadastro de palestrantes (RF-CIP-006; só os ativos). Fonte única
 * entre o formulário de turma e a importação por planilha — os dois mostram o
 * mesmo select.
 */
export function useInstrutores(ativo = true) {
  const [instrutores, setInstrutores] = useState([]);

  useEffect(() => {
    if (!ativo || instrutores.length) return;
    let vivo = true;
    CursoCipaService.listarInstrutores()
      .then((lista) => vivo && setInstrutores(lista || []))
      .catch(() => vivo && setInstrutores([]));
    return () => {
      vivo = false;
    };
  }, [ativo, instrutores.length]);

  return instrutores;
}

export default useInstrutores;
