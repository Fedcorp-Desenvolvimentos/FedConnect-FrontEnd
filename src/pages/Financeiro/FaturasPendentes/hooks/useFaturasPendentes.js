import { useCallback, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { FaturasPendentesService } from "../../../../services/faturasPendentesService";
import { extrairMensagemApi } from "../../../Condomed/CursoCipa/hooks/useInscritos";

/** Padrões do legado (spec relatorio-faturas-pendentes, RF-FIN-001). */
export const FILTROS_PADRAO = {
  fatura: "",
  seguradora: "",
  cedente: "",
  administradora: "",
  apolice: "",
  vencimento_ini: "",
  vencimento_fim: "",
  vigencia_ini: "",
  situacao: "vencidas",
  classificacao: "sem_obs_sem_deposito",
  ordenar_por: "vencimento",
};

export const SITUACOES = [
  { valor: "vencidas", rotulo: "Vencidas" },
  { valor: "a_vencer", rotulo: "A vencer" },
  { valor: "todas", rotulo: "Todas" },
];

export const CLASSIFICACOES = [
  { valor: "todas", rotulo: "Todas as faturas" },
  { valor: "com_obs", rotulo: "Somente com OBS preenchida" },
  { valor: "sem_obs_sem_deposito", rotulo: "OBS não preenchida e sem depósito em C/C" },
  { valor: "deposito_cc", rotulo: "Depósito em conta corrente" },
];

export const ORDENACOES = [
  { valor: "vencimento", rotulo: "Vencimento" },
  { valor: "fatura", rotulo: "Nº Fatura" },
  { valor: "administradora", rotulo: "Administradora" },
  { valor: "documento", rotulo: "Nº Documento" },
];

/**
 * Filtros digitados × aplicados: só os aplicados disparam requisição e
 * exportação — o que está na tela é o que sai no arquivo (RF-FIN-002).
 * Totais e agrupamentos vêm do backend; a tela não reconta.
 */
export function useFaturasPendentes() {
  const { enqueueSnackbar } = useSnackbar();
  const [filtros, setFiltros] = useState(FILTROS_PADRAO);
  const [aplicados, setAplicados] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [gerando, setGerando] = useState(""); // "" | "xlsx" | "pdf"

  const avisarErro = useCallback(
    (erro, fallback) =>
      enqueueSnackbar(extrairMensagemApi(erro?.response?.data) || fallback, { variant: "error" }),
    [enqueueSnackbar]
  );

  const alterar = useCallback((campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor })), []);
  const limpar = useCallback(() => setFiltros(FILTROS_PADRAO), []);

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await FaturasPendentesService.buscar(filtros);
      setResultado(dados);
      setAplicados({ ...filtros });
    } catch (erro) {
      avisarErro(erro, "Não foi possível consultar as faturas pendentes.");
    } finally {
      setCarregando(false);
    }
  }, [filtros, avisarErro]);

  const baixar = useCallback(
    async (tipo) => {
      if (!aplicados) return;
      setGerando(tipo);
      try {
        const { blob, nomeArquivo } =
          tipo === "pdf"
            ? await FaturasPendentesService.baixarPdf(aplicados)
            : await FaturasPendentesService.baixarPlanilha(aplicados);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        link.click();
        URL.revokeObjectURL(url);
      } catch (erro) {
        avisarErro(erro, tipo === "pdf" ? "Não foi possível gerar o PDF." : "Não foi possível gerar a planilha.");
      } finally {
        setGerando("");
      }
    },
    [aplicados, avisarErro]
  );

  /** Linhas agrupadas por administradora quando essa é a ordenação aplicada (RF-FIN-001). */
  const grupos = useMemo(() => {
    const linhas = resultado?.data || [];
    if (aplicados?.ordenar_por !== "administradora") return [{ chave: null, linhas }];
    const porAdm = new Map();
    linhas.forEach((l) => {
      const chave = l.administradora || "—";
      if (!porAdm.has(chave)) porAdm.set(chave, { chave, nome: l.administradora_nome, linhas: [] });
      porAdm.get(chave).linhas.push(l);
    });
    const subtotais = new Map((resultado?.totais?.por_administradora || []).map((g) => [g.administradora, g]));
    return [...porAdm.values()].map((g) => ({ ...g, subtotal: subtotais.get(g.chave) }));
  }, [resultado, aplicados]);

  const filtrosMudaram = useMemo(
    () => aplicados && JSON.stringify(aplicados) !== JSON.stringify(filtros),
    [aplicados, filtros]
  );

  return {
    filtros, alterar, limpar, buscar, carregando,
    resultado, aplicados, grupos, filtrosMudaram,
    baixar, gerando,
  };
}

export default useFaturasPendentes;
