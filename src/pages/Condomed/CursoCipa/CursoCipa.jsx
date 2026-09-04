import { useMemo, useState } from "react";
import { FaChalkboardTeacher, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import FaixaMedidas from "./components/FaixaMedidas";
import BarraFiltros from "./components/BarraFiltros";
import CalendarioMensal from "./components/CalendarioMensal";
import PainelLateral from "./components/PainelLateral";
import TurmaModal from "./components/TurmaModal";
import InscritosPanel from "./components/InscritosPanel";
import CursoCipaHelp from "./CursoCipaHelp";
import { useCursoCipa } from "./hooks/useCursoCipa";
import * as S from "./CursoCipaStyles";

export default function CursoCipa() {
  const {
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
    turmasPorDia,
    turmasDeHoje,
    proximasTurmas,
    resumo,
    alertas,
    turmaSelecionada,
    inscritos,
    salvando,
    criarTurma,
    atualizarTurma,
    excluirTurma,
    abrirTurma,
    fecharTurma,
    adicionarInscrito,
    verificarCpfEmOutrasTurmas,
    editarInscrito,
    removerInscrito,
  } = useCursoCipa();

  // { data, local, turma, voltarParaInscritos } — turma nula = agendamento novo.
  const [modalTurma, setModalTurma] = useState(null);
  // Foca o campo Nome ao abrir a lista logo depois de criar a turma.
  const [focarNovoInscrito, setFocarNovoInscrito] = useState(false);

  const mesPorExtenso = useMemo(
    () => format(new Date(ano, mes - 1, 1), "MMMM 'de' yyyy", { locale: ptBR }),
    [mes, ano]
  );

  const salvarTurma = async (dados) => {
    const editada = modalTurma?.turma;
    const voltarParaInscritos = modalTurma?.voltarParaInscritos;
    const salva = editada
      ? await atualizarTurma(editada.id, dados)
      : await criarTurma(dados);
    if (!salva) return;

    setModalTurma(null);
    // Turma recém-criada emenda na lista de inscritos, que é o passo seguinte
    // em todo caso; uma edição aberta a partir da lista volta para ela.
    if (!editada) {
      setFocarNovoInscrito(true);
      await abrirTurma(salva);
    } else if (voltarParaInscritos) {
      await abrirTurma(salva);
    }
  };

  const removerTurma = async (turma) => {
    const confirmado = window.confirm(
      "Excluir a turma? Os inscritos e a reserva na agenda serão removidos."
    );
    if (!confirmado) return;
    const ok = await excluirTurma(turma.id);
    if (ok) setModalTurma(null);
  };

  return (
    <PageLayout
      title="Cursos CIPA"
      subtitle="Turmas da Condomed no auditório e na sala de reunião"
      icon={<FaChalkboardTeacher />}
      helpContent={<CursoCipaHelp />}
      helpTitle="Guia rápido — Cursos CIPA"
      actions={
        <S.Botao
          type="button"
          onClick={() => setModalTurma({ data: hoje, local: "", turma: null })}
        >
          <FaPlus size={11} /> Nova turma
        </S.Botao>
      }
    >
      <S.Container>
        <FaixaMedidas resumo={resumo} mesPorExtenso={mesPorExtenso} />

        <BarraFiltros
          mesPorExtenso={mesPorExtenso}
          locais={locais}
          filtros={filtros}
          temFiltro={temFiltro}
          onAlterarFiltro={alterarFiltro}
          onLimpar={limparFiltros}
          onMesAnterior={irParaMesAnterior}
          onProximoMes={irParaProximoMes}
          onHoje={irParaHoje}
        />

        <S.Painel>
          <CalendarioMensal
            mes={mes}
            ano={ano}
            hoje={hoje}
            turmasPorDia={turmasPorDia}
            onAgendar={(data) => setModalTurma({ data, local: filtros.local, turma: null })}
            onAbrirTurma={abrirTurma}
          />

          <PainelLateral
            hoje={hoje}
            turmasDeHoje={turmasDeHoje}
            proximasTurmas={proximasTurmas}
            alertas={alertas}
            resumo={resumo}
            locais={locais}
            onAbrirTurma={abrirTurma}
          />
        </S.Painel>

        <TurmaModal
          aberto={Boolean(modalTurma)}
          dataInicial={modalTurma?.data}
          localInicial={modalTurma?.local}
          turma={modalTurma?.turma || null}
          locais={locais}
          salvando={salvando}
          onSalvar={salvarTurma}
          onExcluir={removerTurma}
          onFechar={() => setModalTurma(null)}
        />

        <InscritosPanel
          turma={turmaSelecionada}
          inscritos={inscritos}
          autoFocoNome={focarNovoInscrito}
          onAdicionar={adicionarInscrito}
          onVerificarCpf={verificarCpfEmOutrasTurmas}
          onEditar={editarInscrito}
          onRemover={removerInscrito}
          onEditarTurma={() => {
            setModalTurma({
              data: turmaSelecionada.data,
              local: turmaSelecionada.local,
              turma: turmaSelecionada,
              voltarParaInscritos: true,
            });
            setFocarNovoInscrito(false);
            fecharTurma();
          }}
          onFechar={() => {
            setFocarNovoInscrito(false);
            fecharTurma();
          }}
        />
      </S.Container>
    </PageLayout>
  );
}
