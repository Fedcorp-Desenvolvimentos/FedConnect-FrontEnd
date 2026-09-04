import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { CursoCipaService } from "../../../../services/cursoCipaService";
import { extrairMensagemApi } from "../../CursoCipa/hooks/useInscritos";

/**
 * Uma turma, pelo id da URL: carrega, edita e exclui. Os inscritos ficam no
 * `useInscritos`, compartilhado com a agenda — este hook cuida só da turma.
 */
export function useTurmaDetalhe(turmaId) {
  const { enqueueSnackbar } = useSnackbar();
  const [turma, setTurma] = useState(null);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const avisarErro = useCallback(
    (erro, fallback) =>
      enqueueSnackbar(extrairMensagemApi(erro?.response?.data) || fallback, {
        variant: "error",
      }),
    [enqueueSnackbar]
  );

  const recarregar = useCallback(async () => {
    if (!turmaId) return null;
    try {
      const dados = await CursoCipaService.obterTurma(turmaId);
      setTurma(dados);
      return dados;
    } catch (erro) {
      if (erro?.response?.status === 404) setNaoEncontrada(true);
      else avisarErro(erro, "Não foi possível carregar a turma.");
      return null;
    }
  }, [turmaId, avisarErro]);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setNaoEncontrada(false);
    Promise.all([recarregar(), CursoCipaService.listarLocais().catch(() => [])]).then(
      ([, lista]) => {
        if (!ativo) return;
        setLocais(lista || []);
        setCarregando(false);
      }
    );
    return () => {
      ativo = false;
    };
  }, [recarregar]);

  const atualizar = useCallback(
    async (dados) => {
      setSalvando(true);
      try {
        const atualizada = await CursoCipaService.atualizarTurma(turmaId, dados);
        setTurma(atualizada);
        enqueueSnackbar("Turma atualizada.", { variant: "success" });
        return atualizada;
      } catch (erro) {
        avisarErro(erro, "Não foi possível atualizar a turma.");
        return null;
      } finally {
        setSalvando(false);
      }
    },
    [turmaId, enqueueSnackbar, avisarErro]
  );

  const excluir = useCallback(async () => {
    try {
      await CursoCipaService.excluirTurma(turmaId);
      enqueueSnackbar("Turma excluída.", { variant: "success" });
      return true;
    } catch (erro) {
      avisarErro(erro, "Não foi possível excluir a turma.");
      return false;
    }
  }, [turmaId, enqueueSnackbar, avisarErro]);

  return { turma, locais, carregando, naoEncontrada, salvando, recarregar, atualizar, excluir };
}

export default useTurmaDetalhe;
