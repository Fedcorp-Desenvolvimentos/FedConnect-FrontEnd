import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { subMonths } from "date-fns";
import { CursoCipaService } from "../../../../services/cursoCipaService";
import { extrairMensagemApi } from "../../CursoCipa/hooks/useInscritos";
import { apenasDigitos } from "../../../../utils/formatters";

export const PAGINA = 25;

const hojeISO = () => new Date().toISOString().slice(0, 10);
const seisMesesAtrasISO = () => subMonths(new Date(), 6).toISOString().slice(0, 10);

/**
 * Filtros iniciais: os últimos seis meses, sem limite de fim — as turmas
 * futuras aparecem no topo, porque a lista é da mais recente para a mais
 * antiga. É histórico, mas quem abre a página quer ver também o que vem.
 */
export const FILTROS_TURMAS = () => ({
  data_inicio: seisMesesAtrasISO(),
  data_fim: "",
  local: "",
  status: "",
  busca: "",
});

export const FILTROS_PARTICIPANTES = () => ({
  busca: "",
  data_inicio: "",
  data_fim: "",
});

/** Só manda ao backend o que está preenchido; CPF vai sem máscara. */
function limparParams(filtros) {
  const params = {};
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor === "" || valor == null) return;
    params[chave] = valor;
  });
  if (params.busca && apenasDigitos(params.busca).length >= 3 && /^[\d.\-\s]+$/.test(params.busca)) {
    params.busca = apenasDigitos(params.busca);
  }
  return params;
}

/**
 * Uma aba por vez consulta o backend: a outra guarda o último resultado e
 * refaz a consulta ao ser aberta, para não disparar duas listagens paginadas
 * a cada troca de filtro.
 */
export function useHistoricoTurmas() {
  const { enqueueSnackbar } = useSnackbar();
  const [aba, setAba] = useState("turmas");

  const [filtrosTurmas, setFiltrosTurmas] = useState(FILTROS_TURMAS);
  const [filtrosParticipantes, setFiltrosParticipantes] = useState(
    FILTROS_PARTICIPANTES
  );
  // Filtros "aplicados" são os que geraram a última consulta: digitar não
  // consulta; Enter/Buscar consulta. Evita uma requisição por tecla.
  const [aplicadosTurmas, setAplicadosTurmas] = useState(FILTROS_TURMAS);
  const [aplicadosParticipantes, setAplicadosParticipantes] = useState(
    FILTROS_PARTICIPANTES
  );

  const [paginaTurmas, setPaginaTurmas] = useState(1);
  const [paginaParticipantes, setPaginaParticipantes] = useState(1);

  const [turmas, setTurmas] = useState({ count: 0, results: [] });
  const [participantes, setParticipantes] = useState({ count: 0, results: [] });
  const [carregando, setCarregando] = useState(false);

  const avisarErro = useCallback(
    (erro, fallback) =>
      enqueueSnackbar(extrairMensagemApi(erro?.response?.data) || fallback, {
        variant: "error",
      }),
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (aba !== "turmas") return;
    let ativo = true;
    setCarregando(true);
    CursoCipaService.listarHistorico({
      ...limparParams(aplicadosTurmas),
      page: paginaTurmas,
      page_size: PAGINA,
    })
      .then((dados) => ativo && setTurmas(dados))
      .catch((erro) => ativo && avisarErro(erro, "Não foi possível carregar o histórico."))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [aba, aplicadosTurmas, paginaTurmas, avisarErro]);

  useEffect(() => {
    if (aba !== "participantes") return;
    let ativo = true;
    setCarregando(true);
    CursoCipaService.listarParticipantes({
      ...limparParams(aplicadosParticipantes),
      page: paginaParticipantes,
      page_size: PAGINA,
    })
      .then((dados) => ativo && setParticipantes(dados))
      .catch((erro) => ativo && avisarErro(erro, "Não foi possível consultar os participantes."))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [aba, aplicadosParticipantes, paginaParticipantes, avisarErro]);

  const aplicarTurmas = useCallback(() => {
    setPaginaTurmas(1);
    setAplicadosTurmas({ ...filtrosTurmas });
  }, [filtrosTurmas]);

  const aplicarParticipantes = useCallback(() => {
    setPaginaParticipantes(1);
    setAplicadosParticipantes({ ...filtrosParticipantes });
  }, [filtrosParticipantes]);

  const limparTurmas = useCallback(() => {
    const limpos = FILTROS_TURMAS();
    setFiltrosTurmas(limpos);
    setAplicadosTurmas(limpos);
    setPaginaTurmas(1);
  }, []);

  const limparParticipantes = useCallback(() => {
    const limpos = FILTROS_PARTICIPANTES();
    setFiltrosParticipantes(limpos);
    setAplicadosParticipantes(limpos);
    setPaginaParticipantes(1);
  }, []);

  const totalPaginas = useCallback(
    (count) => Math.max(1, Math.ceil(count / PAGINA)),
    []
  );

  const hoje = useMemo(hojeISO, []);

  return {
    aba,
    setAba,
    hoje,
    carregando,
    // turmas
    filtrosTurmas,
    setFiltrosTurmas,
    aplicarTurmas,
    limparTurmas,
    turmas,
    paginaTurmas,
    setPaginaTurmas,
    totalPaginasTurmas: totalPaginas(turmas.count),
    // participantes
    filtrosParticipantes,
    setFiltrosParticipantes,
    aplicarParticipantes,
    limparParticipantes,
    participantes,
    paginaParticipantes,
    setPaginaParticipantes,
    totalPaginasParticipantes: totalPaginas(participantes.count),
  };
}

export default useHistoricoTurmas;
