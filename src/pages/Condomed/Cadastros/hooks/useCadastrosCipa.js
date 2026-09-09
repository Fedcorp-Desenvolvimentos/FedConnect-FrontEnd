import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { CursoCipaService } from "../../../../services/cursoCipaService";
import { extrairMensagemApi } from "../../CursoCipa/hooks/useInscritos";

/**
 * Cadastros da Condomed (RF-CIP-006/007): palestrantes e locais do curso.
 *
 * Um estado por lista, sempre com os inativos (a tela filtra), e as operações
 * criar/editar/desativar/excluir devolvendo o registro salvo ou `null` — quem
 * chama decide se fecha o modal. As regras (registro MTE duplicado, nome
 * repetido, só uma sala da agenda, tamanho da assinatura) são do backend; aqui
 * só se mostra a mensagem que ele mandou.
 */
export function useCadastrosCipa() {
  const { enqueueSnackbar } = useSnackbar();
  const [instrutores, setInstrutores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [errosCampos, setErrosCampos] = useState({});

  const avisarErro = useCallback(
    (erro, fallback) => {
      const dados = erro?.response?.data;
      // Erros por campo vão para o formulário; o resto vira snackbar.
      if (dados && typeof dados === "object" && !Array.isArray(dados) && !dados.detail) {
        setErrosCampos(
          Object.fromEntries(
            Object.entries(dados).map(([campo, msgs]) => [
              campo,
              Array.isArray(msgs) ? msgs.join(" ") : String(msgs),
            ])
          )
        );
      }
      enqueueSnackbar(extrairMensagemApi(dados) || fallback, { variant: "error" });
    },
    [enqueueSnackbar]
  );

  const recarregar = useCallback(async () => {
    const [i, l] = await Promise.all([
      CursoCipaService.listarInstrutores({ todos: true }).catch(() => null),
      CursoCipaService.listarLocais({ todos: true }).catch(() => null),
    ]);
    if (i) setInstrutores(i);
    if (l) setLocais(l);
    if (!i || !l) enqueueSnackbar("Não foi possível carregar os cadastros.", { variant: "error" });
  }, [enqueueSnackbar]);

  useEffect(() => {
    let vivo = true;
    recarregar().finally(() => vivo && setCarregando(false));
    return () => {
      vivo = false;
    };
  }, [recarregar]);

  /** Executa uma gravação com o padrão salvando/erro/recarregar. */
  const gravar = useCallback(
    async (acao, sucesso, fallback) => {
      setSalvando(true);
      setErrosCampos({});
      try {
        const resultado = await acao();
        enqueueSnackbar(sucesso, { variant: "success" });
        await recarregar();
        return resultado ?? true;
      } catch (erro) {
        avisarErro(erro, fallback);
        return null;
      } finally {
        setSalvando(false);
      }
    },
    [enqueueSnackbar, recarregar, avisarErro]
  );

  const salvarInstrutor = useCallback(
    (id, dados) =>
      gravar(
        () =>
          id
            ? CursoCipaService.atualizarInstrutor(id, dados)
            : CursoCipaService.criarInstrutor(dados),
        id ? "Palestrante atualizado." : "Palestrante cadastrado.",
        "Não foi possível salvar o palestrante."
      ),
    [gravar]
  );

  const alternarAtivoInstrutor = useCallback(
    (item) =>
      gravar(
        () => CursoCipaService.atualizarInstrutor(item.id, { ativo: !item.ativo }),
        item.ativo ? "Palestrante desativado." : "Palestrante reativado.",
        "Não foi possível alterar o palestrante."
      ),
    [gravar]
  );

  const excluirInstrutor = useCallback(
    (item) =>
      gravar(
        () => CursoCipaService.excluirInstrutor(item.id),
        "Palestrante excluído.",
        "Não foi possível excluir o palestrante."
      ),
    [gravar]
  );

  const salvarLocal = useCallback(
    (id, dados) =>
      gravar(
        () => (id ? CursoCipaService.atualizarLocal(id, dados) : CursoCipaService.criarLocal(dados)),
        id ? "Local atualizado." : "Local cadastrado.",
        "Não foi possível salvar o local."
      ),
    [gravar]
  );

  const alternarAtivoLocal = useCallback(
    (item) =>
      gravar(
        () => CursoCipaService.atualizarLocal(item.id, { ativo: !item.ativo }),
        item.ativo ? "Local desativado." : "Local reativado.",
        "Não foi possível alterar o local."
      ),
    [gravar]
  );

  const excluirLocal = useCallback(
    (item) =>
      gravar(
        () => CursoCipaService.excluirLocal(item.id),
        "Local excluído.",
        "Não foi possível excluir o local."
      ),
    [gravar]
  );

  return {
    instrutores, locais, carregando, salvando, errosCampos, setErrosCampos,
    recarregar,
    salvarInstrutor, alternarAtivoInstrutor, excluirInstrutor,
    salvarLocal, alternarAtivoLocal, excluirLocal,
  };
}

export default useCadastrosCipa;
