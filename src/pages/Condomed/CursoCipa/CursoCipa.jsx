import { useMemo, useState } from "react";
import { FaChalkboardTeacher, FaFileExcel, FaPlus } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import FaixaMedidas from "./components/FaixaMedidas";
import BarraFiltros from "./components/BarraFiltros";
import CalendarioMensal from "./components/CalendarioMensal";
import PainelLateral from "./components/PainelLateral";
import TurmaModal from "./components/TurmaModal";
import InscritosPanel from "./components/InscritosPanel";
import ConfirmarModal from "./components/ConfirmarModal";
import ImportarPlanilhaModal from "./components/ImportarPlanilhaModal";
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
    importarTurma,
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
  // Turma aguardando confirmação de exclusão (apaga inscritos e reserva).
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null);
  // { data } — criação de turma a partir de planilha de inscritos.
  const [modalPlanilha, setModalPlanilha] = useState(null);

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

  /** Importa a planilha e emenda na lista da turma criada, para conferência. */
  const importarPlanilha = async (dados) => {
    const turma = await importarTurma(dados);
    if (!turma) return;
    setModalPlanilha(null);
    setFocarNovoInscrito(false);
    await abrirTurma(turma);
  };

  /**
   * Excluir a turma apaga os inscritos em cascata e devolve a sala na agenda.
   * Não tem desfazer, então a confirmação diz o que se perde.
   */
  const fecharConfirmacaoExclusao = () => setConfirmandoExclusao(null);

  const confirmarExclusao = async () => {
    const turma = confirmandoExclusao;
    fecharConfirmacaoExclusao();
    const ok = await excluirTurma(turma.id);
    if (ok) {
      setModalTurma(null);
      if (turmaSelecionada?.id === turma.id) fecharTurma();
    }
  };

  /** Quantos inscritos por condomínio, para a confirmação nomear a perda. */
  const perdaPorCondominio = useMemo(() => {
    const inscricoes = confirmandoExclusao?.inscricoes || [];
    const porCondominio = new Map();
    inscricoes.forEach((inscrito) => {
      const chave = inscrito.condominio_nome || "Sem condomínio";
      const atual = porCondominio.get(chave) || { total: 0, administradora: "" };
      porCondominio.set(chave, {
        total: atual.total + 1,
        administradora: atual.administradora || inscrito.administradora_nome || "",
      });
    });
    return [...porCondominio.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([condominio, dados]) => ({
        chave: condominio,
        titulo: condominio,
        detalhe: [
          `${dados.total} ${dados.total === 1 ? "inscrito" : "inscritos"}`,
          dados.administradora,
        ]
          .filter(Boolean)
          .join(" · "),
      }));
  }, [confirmandoExclusao]);

  return (
    <PageLayout
      title="Cursos CIPA"
      subtitle="Turmas da Condomed no auditório e na sala de reunião"
      icon={<FaChalkboardTeacher />}
      helpContent={<CursoCipaHelp />}
      helpTitle="Guia rápido — Cursos CIPA"
      actions={
        <S.AcoesCabecalho>
          <S.Botao
            type="button"
            $variante="secundario"
            onClick={() => setModalPlanilha({ data: hoje })}
          >
            <FaFileExcel size={11} /> Turma por planilha
          </S.Botao>
          <S.Botao
            type="button"
            onClick={() => setModalTurma({ data: hoje, local: "", turma: null })}
          >
            <FaPlus size={11} /> Nova turma
          </S.Botao>
        </S.AcoesCabecalho>
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
          onExcluir={setConfirmandoExclusao}
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
          onExcluirTurma={() => setConfirmandoExclusao(turmaSelecionada)}
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

        <ImportarPlanilhaModal
          aberto={Boolean(modalPlanilha)}
          dataInicial={modalPlanilha?.data}
          locais={locais}
          salvando={salvando}
          onImportar={importarPlanilha}
          onFechar={() => setModalPlanilha(null)}
        />

        <ConfirmarModal
          aberto={Boolean(confirmandoExclusao)}
          titulo="Excluir a turma inteira?"
          mensagem={
            confirmandoExclusao
              ? [
                  `${confirmandoExclusao.local_nome} · ${format(
                    parseISO(confirmandoExclusao.data),
                    "d 'de' MMMM",
                    { locale: ptBR }
                  )}.`,
                  confirmandoExclusao.total_inscritos > 0
                    ? `A turma e ${
                        confirmandoExclusao.total_inscritos === 1
                          ? "o inscrito abaixo saem"
                          : `os ${confirmandoExclusao.total_inscritos} inscritos abaixo saem`
                      } do sistema.`
                    : "A turma não tem ninguém inscrito.",
                  confirmandoExclusao.local === "SALA_REUNIAO"
                    ? "A reserva da sala na agenda é liberada."
                    : "",
                  "Não dá para desfazer.",
                ]
                  .filter(Boolean)
                  .join(" ")
              : ""
          }
          itens={perdaPorCondominio}
          textoConfirmar="Excluir turma"
          onConfirmar={confirmarExclusao}
          onCancelar={fecharConfirmacaoExclusao}
        />
      </S.Container>
    </PageLayout>
  );
}
