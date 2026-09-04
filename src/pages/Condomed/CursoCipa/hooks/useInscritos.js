import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import { CursoCipaService } from "../../../../services/cursoCipaService";

/** Extrai a mensagem de erro da API, seja em `detail` ou em erros de campo. */
export function extrairMensagemApi(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (data.detail) return String(data.detail);
  const primeiro = Object.values(data)[0];
  if (Array.isArray(primeiro)) return String(primeiro[0]);
  return primeiro ? String(primeiro) : "";
}

/**
 * Operações sobre os inscritos de UMA turma: carregar, adicionar, editar,
 * remover e checar CPF em outras turmas.
 *
 * Fonte única (regra do CLAUDE.md): a agenda usa este hook dentro do
 * `useCursoCipa`, e a página de detalhe da turma usa direto. Antes cada tela
 * teria a própria cópia destas cinco funções — e cópia dessincroniza.
 *
 * `aoMudar` roda depois de qualquer gravação, para quem chamou atualizar a
 * própria visão (a agenda recarrega o mês; o detalhe recarrega a turma).
 */
export function useInscritos({ turma, aoMudar }) {
  const { enqueueSnackbar } = useSnackbar();
  const [inscritos, setInscritos] = useState([]);

  const avisarErro = useCallback(
    (erro, fallback) => {
      enqueueSnackbar(extrairMensagemApi(erro?.response?.data) || fallback, {
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  const carregar = useCallback(
    async (turmaId = turma?.id) => {
      if (!turmaId) return [];
      try {
        const lista = await CursoCipaService.listarInscritos(turmaId);
        setInscritos(lista);
        return lista;
      } catch (erro) {
        setInscritos([]);
        avisarErro(erro, "Não foi possível carregar os inscritos.");
        return [];
      }
    },
    [turma?.id, avisarErro]
  );

  const limpar = useCallback(() => setInscritos([]), []);

  const adicionar = useCallback(
    async (dados) => {
      if (!turma) return false;
      // A capacidade do local não barra a inscrição (ADR-0008): chega
      // funcionário extra de última hora e a turma recebe. O aviso abaixo
      // sinaliza o excesso; a decisão é do operador.
      try {
        await CursoCipaService.criarInscrito(turma.id, dados);
        const lista = await carregar(turma.id);
        await aoMudar?.();
        const excesso = lista.length - turma.capacidade;
        enqueueSnackbar(
          excesso > 0
            ? `Inscrito adicionado. A turma está ${excesso} acima da capacidade do local (${turma.capacidade}).`
            : "Inscrito adicionado.",
          { variant: excesso > 0 ? "warning" : "success" }
        );
        return true;
      } catch (erro) {
        avisarErro(erro, "Não foi possível adicionar o inscrito.");
        return false;
      }
    },
    [turma, carregar, aoMudar, enqueueSnackbar, avisarErro]
  );

  /**
   * Turmas onde este CPF já está inscrito, fora desta. Serve para avisar antes
   * de gravar — a duplicidade entre turmas é permitida (ADR-0003). Falha na
   * consulta devolve lista vazia: o aviso é conveniência, não trava o cadastro.
   */
  const verificarCpf = useCallback(
    async (cpf) => {
      if (!turma) return [];
      try {
        return await CursoCipaService.verificarCpf(cpf, turma.id);
      } catch {
        return [];
      }
    },
    [turma]
  );

  const editar = useCallback(
    async (inscricaoId, dados) => {
      if (!turma) return false;
      try {
        await CursoCipaService.atualizarInscrito(turma.id, inscricaoId, dados);
        await carregar(turma.id);
        await aoMudar?.();
        enqueueSnackbar("Inscrito atualizado.", { variant: "success" });
        return true;
      } catch (erro) {
        avisarErro(erro, "Não foi possível salvar as alterações.");
        return false;
      }
    },
    [turma, carregar, aoMudar, enqueueSnackbar, avisarErro]
  );

  const remover = useCallback(
    async (inscricaoId) => {
      if (!turma) return false;
      try {
        await CursoCipaService.excluirInscrito(turma.id, inscricaoId);
        await carregar(turma.id);
        await aoMudar?.();
        return true;
      } catch (erro) {
        avisarErro(erro, "Não foi possível remover o inscrito.");
        return false;
      }
    },
    [turma, carregar, aoMudar, avisarErro]
  );

  return { inscritos, carregar, limpar, adicionar, editar, remover, verificarCpf };
}

export default useInscritos;
