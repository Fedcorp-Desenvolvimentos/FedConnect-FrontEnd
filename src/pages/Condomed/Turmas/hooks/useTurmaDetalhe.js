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

  /** Grava o lote de presença; a turma volta do backend já Realizada. */
  const [salvandoPresenca, setSalvandoPresenca] = useState(false);
  const registrarPresenca = useCallback(
    async (presencas) => {
      setSalvandoPresenca(true);
      try {
        const atualizada = await CursoCipaService.registrarPresenca(turmaId, presencas);
        setTurma(atualizada);
        enqueueSnackbar(
          `Presença registrada: ${atualizada.presentes} presentes, ${atualizada.ausentes} ausentes.`,
          { variant: "success" }
        );
        return atualizada;
      } catch (erro) {
        avisarErro(erro, "Não foi possível registrar a presença.");
        return null;
      } finally {
        setSalvandoPresenca(false);
      }
    },
    [turmaId, enqueueSnackbar, avisarErro]
  );

  /** Salva um blob com o nome que o backend sugeriu. */
  const salvarArquivo = ({ blob, nomeArquivo }) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(url);
  };

  /** Baixa a lista de presença em PDF; o navegador salva com o nome do backend. */
  const [baixandoLista, setBaixandoLista] = useState(false);
  const baixarListaPresenca = useCallback(async () => {
    setBaixandoLista(true);
    try {
      salvarArquivo(await CursoCipaService.baixarListaPresenca(turmaId));
      return true;
    } catch (erro) {
      avisarErro(erro, "Não foi possível gerar a lista de presença.");
      return false;
    } finally {
      setBaixandoLista(false);
    }
  }, [turmaId, avisarErro]);

  /** Emite certificados em lote (RF-HIS-006); a turma volta atualizada dentro do lote. */
  const [emitindo, setEmitindo] = useState(false);
  const emitirCertificados = useCallback(async () => {
    setEmitindo(true);
    try {
      const lote = await CursoCipaService.emitirCertificados(turmaId);
      if (lote.turma) setTurma(lote.turma);
      const n = lote.emitidos.length;
      enqueueSnackbar(
        n
          ? `${n} ${n === 1 ? "certificado emitido" : "certificados emitidos"}${
              lote.impedidos.length ? `; ${lote.impedidos.length} sem CNPJ ficaram de fora.` : "."
            }`
          : lote.impedidos.length
          ? "Nenhum certificado emitido: os presentes pendentes estão sem CNPJ."
          : "Nada a emitir: todos os presentes aptos já têm certificado.",
        { variant: n ? "success" : "warning" }
      );
      return lote;
    } catch (erro) {
      avisarErro(erro, "Não foi possível emitir os certificados.");
      return null;
    } finally {
      setEmitindo(false);
    }
  }, [turmaId, enqueueSnackbar, avisarErro]);

  /** `baixandoCertificado`: "todos", o número em download, ou null. */
  const [baixandoCertificado, setBaixandoCertificado] = useState(null);
  const baixarCertificados = useCallback(async () => {
    setBaixandoCertificado("todos");
    try {
      salvarArquivo(await CursoCipaService.baixarCertificadosTurma(turmaId));
    } catch (erro) {
      avisarErro(erro, "Não foi possível gerar os certificados.");
    } finally {
      setBaixandoCertificado(null);
    }
  }, [turmaId, avisarErro]);
  const baixarCertificado = useCallback(async (numero) => {
    setBaixandoCertificado(numero);
    try {
      salvarArquivo(await CursoCipaService.baixarCertificado(numero));
    } catch (erro) {
      avisarErro(erro, "Não foi possível gerar o certificado.");
    } finally {
      setBaixandoCertificado(null);
    }
  }, [avisarErro]);

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

  return {
    turma, locais, carregando, naoEncontrada, salvando,
    recarregar, atualizar, excluir,
    baixarListaPresenca, baixandoLista,
    registrarPresenca, salvandoPresenca,
    emitirCertificados, emitindo,
    baixarCertificados, baixarCertificado, baixandoCertificado,
  };
}

export default useTurmaDetalhe;
