// src/pages/Condomed/CursoCipa/hooks/useCursoCipa.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { CursoCipaService } from "../../../../services/cursoCipaService";
import { extrairMensagemApi, useInscritos } from "./useInscritos";

// Quem importava daqui continua funcionando; a definição mora em useInscritos.
export { extrairMensagemApi };

export const AUDITORIO = "AUDITORIO";
export const SALA_REUNIAO = "SALA_REUNIAO";
export const ORDEM_LOCAIS = [AUDITORIO, SALA_REUNIAO];

export const STATUS_TURMA = [
  { valor: "agendada", rotulo: "Agendada" },
  { valor: "realizada", rotulo: "Realizada" },
  { valor: "cancelada", rotulo: "Cancelada" },
];

const FILTROS_LIMPOS = { local: "", status: "", busca: "" };

const paraISO = (data) => {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
};

export const semAcento = (texto) =>
  String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Estado, filtros, chamadas e tratamento de erro (409/400) da tela. */
export function useCursoCipa() {
  const { enqueueSnackbar } = useSnackbar();

  const hoje = useMemo(() => paraISO(new Date()), []);
  const inicial = useMemo(() => new Date(), []);
  const [mes, setMes] = useState(inicial.getMonth() + 1);
  const [ano, setAno] = useState(inicial.getFullYear());
  const [filtros, setFiltros] = useState(FILTROS_LIMPOS);

  const [locais, setLocais] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const avisarErro = useCallback(
    (erro, fallback) => {
      const mensagem = extrairMensagemApi(erro?.response?.data) || fallback;
      enqueueSnackbar(mensagem, { variant: "error" });
    },
    [enqueueSnackbar]
  );

  // Os locais e suas capacidades mudam raramente: carregados uma vez.
  useEffect(() => {
    let ativo = true;
    CursoCipaService.listarLocais()
      .then((lista) => {
        if (ativo) setLocais(lista || []);
      })
      .catch((erro) => avisarErro(erro, "Não foi possível carregar os locais."));
    return () => {
      ativo = false;
    };
  }, [avisarErro]);

  // O mês inteiro vem numa requisição; local, status e busca filtram na tela.
  const carregarTurmas = useCallback(async () => {
    setCarregando(true);
    try {
      setTurmas(await CursoCipaService.listarTurmas({ mes, ano }));
    } catch (erro) {
      // Mantém o último estado do calendário se a API cair.
      avisarErro(erro, "Não foi possível carregar as turmas.");
    } finally {
      setCarregando(false);
    }
  }, [mes, ano, avisarErro]);

  useEffect(() => {
    carregarTurmas();
  }, [carregarTurmas]);

  const alterarFiltro = useCallback((campo, valor) => {
    setFiltros((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const limparFiltros = useCallback(() => setFiltros(FILTROS_LIMPOS), []);
  const temFiltro = filtros.local !== "" || filtros.status !== "" || filtros.busca !== "";

  const irParaMesAnterior = useCallback(() => {
    setMes((atual) => {
      if (atual === 1) {
        setAno((anoAtual) => anoAtual - 1);
        return 12;
      }
      return atual - 1;
    });
  }, []);

  const irParaProximoMes = useCallback(() => {
    setMes((atual) => {
      if (atual === 12) {
        setAno((anoAtual) => anoAtual + 1);
        return 1;
      }
      return atual + 1;
    });
  }, []);

  const irParaHoje = useCallback(() => {
    const agora = new Date();
    setMes(agora.getMonth() + 1);
    setAno(agora.getFullYear());
  }, []);

  const criarTurma = useCallback(
    async (dados) => {
      setSalvando(true);
      try {
        const turma = await CursoCipaService.criarTurma(dados);
        enqueueSnackbar("Turma agendada.", { variant: "success" });
        await carregarTurmas();
        return turma;
      } catch (erro) {
        // 409 traz a mensagem de conflito (outra turma ou reunião na sala).
        avisarErro(erro, "Não foi possível agendar a turma.");
        return null;
      } finally {
        setSalvando(false);
      }
    },
    [carregarTurmas, enqueueSnackbar, avisarErro]
  );

  const atualizarTurma = useCallback(
    async (turmaId, dados) => {
      setSalvando(true);
      try {
        const turma = await CursoCipaService.atualizarTurma(turmaId, dados);
        enqueueSnackbar("Turma atualizada.", { variant: "success" });
        await carregarTurmas();
        setTurmaSelecionada((atual) => (atual?.id === turmaId ? turma : atual));
        return turma;
      } catch (erro) {
        avisarErro(erro, "Não foi possível atualizar a turma.");
        return null;
      } finally {
        setSalvando(false);
      }
    },
    [carregarTurmas, enqueueSnackbar, avisarErro]
  );

  /** Cria a turma com os inscritos da planilha (uma requisição, uma transação). */
  const importarTurma = useCallback(
    async (dados) => {
      setSalvando(true);
      try {
        const turma = await CursoCipaService.importarTurma(dados);
        const total = dados.inscricoes.length;
        enqueueSnackbar(
          `Turma criada com ${total} ${total === 1 ? "inscrito" : "inscritos"}.`,
          { variant: "success" }
        );
        await carregarTurmas();
        return turma;
      } catch (erro) {
        avisarErro(erro, "Não foi possível importar a planilha.");
        return null;
      } finally {
        setSalvando(false);
      }
    },
    [carregarTurmas, enqueueSnackbar, avisarErro]
  );

  const excluirTurma = useCallback(
    async (turmaId) => {
      try {
        await CursoCipaService.excluirTurma(turmaId);
        enqueueSnackbar("Turma excluída.", { variant: "success" });
        setTurmaSelecionada(null);
        await carregarTurmas();
        return true;
      } catch (erro) {
        avisarErro(erro, "Não foi possível excluir a turma.");
        return false;
      }
    },
    [carregarTurmas, enqueueSnackbar, avisarErro]
  );

  // Operações de inscrito: fonte única com a página de detalhe da turma.
  const inscritosDaTurma = useInscritos({
    turma: turmaSelecionada,
    aoMudar: carregarTurmas,
  });

  const abrirTurma = useCallback(
    async (turma) => {
      setTurmaSelecionada(turma);
      await inscritosDaTurma.carregar(turma.id);
    },
    [inscritosDaTurma]
  );

  const fecharTurma = useCallback(() => {
    setTurmaSelecionada(null);
    inscritosDaTurma.limpar();
  }, [inscritosDaTurma]);

  const turmasVisiveis = useMemo(() => {
    const busca = semAcento(filtros.busca).trim();
    return turmas.filter((turma) => {
      if (filtros.local && turma.local !== filtros.local) return false;
      if (filtros.status && turma.status !== filtros.status) return false;
      if (!busca) return true;
      // A turma não tem cliente: busca contra as administradoras e os
      // condomínios que ela devolve, derivados dos inscritos (ADR-0005).
      // Responde "quais turmas têm gente da administradora X".
      const administradoras = (turma.administradoras || [])
        .map((adm) => adm.nome)
        .join(" ");
      const condominios = (turma.condominios || []).join(" ");
      const alvo = semAcento(
        `${condominios} ${administradoras} ${turma.local_nome}`
      );
      return alvo.includes(busca);
    });
  }, [turmas, filtros]);

  /** Turmas visíveis agrupadas por dia: `{ 'YYYY-MM-DD': [turma, ...] }`. */
  const turmasPorDia = useMemo(() => {
    const mapa = {};
    turmasVisiveis.forEach((turma) => {
      if (!mapa[turma.data]) mapa[turma.data] = [];
      mapa[turma.data].push(turma);
    });
    Object.values(mapa).forEach((lista) =>
      lista.sort((a, b) => ORDEM_LOCAIS.indexOf(a.local) - ORDEM_LOCAIS.indexOf(b.local))
    );
    return mapa;
  }, [turmasVisiveis]);

  const ativas = useMemo(
    () => turmasVisiveis.filter((turma) => turma.status !== "cancelada"),
    [turmasVisiveis]
  );

  const medir = (lista) => {
    const vagas = lista.reduce((soma, turma) => soma + turma.capacidade, 0);
    const inscritosTotais = lista.reduce((soma, turma) => soma + turma.total_inscritos, 0);
    return {
      turmas: lista.length,
      inscritos: inscritosTotais,
      vagas,
      ocupacao: vagas ? Math.round((inscritosTotais / vagas) * 100) : 0,
    };
  };

  const turmasDeHoje = useMemo(
    () => ativas.filter((turma) => turma.data === hoje),
    [ativas, hoje]
  );

  const proximasTurmas = useMemo(
    () =>
      ativas
        .filter((turma) => turma.data > hoje)
        .sort((a, b) => a.data.localeCompare(b.data)),
    [ativas, hoje]
  );

  /** Medidas do mês em exibição, no total e por local. */
  const resumo = useMemo(() => {
    const porLocal = {};
    ORDEM_LOCAIS.forEach((codigo) => {
      porLocal[codigo] = medir(ativas.filter((turma) => turma.local === codigo));
    });
    return {
      total: medir(ativas),
      porLocal,
      proximosSeteDias: ativas.filter((turma) => {
        if (turma.data < hoje) return false;
        const limite = new Date();
        limite.setDate(limite.getDate() + 7);
        return turma.data <= paraISO(limite);
      }).length,
    };
  }, [ativas, hoje]);

  /**
   * O que exige ação, sempre daqui para a frente: turma sem ninguém inscrito,
   * turma acima da capacidade do local e turma na sala que perdeu a reserva
   * espelho na agenda.
   */
  const alertas = useMemo(() => {
    const futuras = ativas.filter((turma) => turma.data >= hoje);
    const vazias = futuras.filter((turma) => turma.total_inscritos === 0);
    // Acima da capacidade é informação de operação (mais cadeiras, mais
    // material), não erro — mas o técnico precisa saber antes do dia.
    const acimaDaCapacidade = futuras.filter(
      (turma) => (turma.acima_da_capacidade ?? 0) > 0
    );
    const semEspelho = futuras.filter((turma) => turma.tem_espelho === false);

    const lista = [];
    if (semEspelho.length) {
      lista.push({
        id: "sem-espelho",
        grave: true,
        titulo: "Turma sem reserva na agenda",
        detalhe: `${semEspelho.length} na sala de reunião — a sala não está bloqueada`,
        turmas: semEspelho,
      });
    }
    if (vazias.length) {
      lista.push({
        id: "vazias",
        grave: false,
        titulo: "Turmas sem inscritos",
        detalhe: `${vazias.length} ${vazias.length === 1 ? "turma" : "turmas"} sem ninguém na lista`,
        turmas: vazias,
      });
    }
    if (acimaDaCapacidade.length) {
      const pessoas = acimaDaCapacidade.reduce(
        (soma, turma) => soma + (turma.acima_da_capacidade ?? 0),
        0
      );
      lista.push({
        id: "acima-da-capacidade",
        grave: false,
        titulo: "Turmas acima da capacidade",
        detalhe: `${acimaDaCapacidade.length} ${
          acimaDaCapacidade.length === 1 ? "turma" : "turmas"
        } com ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"} além das vagas do local`,
        turmas: acimaDaCapacidade,
      });
    }
    return lista;
  }, [ativas, hoje]);

  return {
    mes,
    ano,
    hoje,
    filtros,
    temFiltro,
    alterarFiltro,
    limparFiltros,
    irParaMesAnterior,
    irParaProximoMes,
    irParaHoje,
    locais,
    turmas,
    turmasVisiveis,
    turmasPorDia,
    turmasDeHoje,
    proximasTurmas,
    resumo,
    alertas,
    turmaSelecionada,
    inscritos: inscritosDaTurma.inscritos,
    carregando,
    salvando,
    criarTurma,
    atualizarTurma,
    importarTurma,
    excluirTurma,
    abrirTurma,
    fecharTurma,
    adicionarInscrito: inscritosDaTurma.adicionar,
    verificarCpfEmOutrasTurmas: inscritosDaTurma.verificarCpf,
    editarInscrito: inscritosDaTurma.editar,
    removerInscrito: inscritosDaTurma.remover,
    recarregar: carregarTurmas,
  };
}

export default useCursoCipa;
