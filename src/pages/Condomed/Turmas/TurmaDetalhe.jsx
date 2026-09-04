import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaArrowLeft, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import InscritosConteudo from "../CursoCipa/components/InscritosConteudo";
import TurmaModal from "../CursoCipa/components/TurmaModal";
import ExcluirTurmaModal from "../CursoCipa/components/ExcluirTurmaModal";
import { useInscritos } from "../CursoCipa/hooks/useInscritos";
import { STATUS_TURMA } from "../CursoCipa/hooks/useCursoCipa";
import { useTurmaDetalhe } from "./hooks/useTurmaDetalhe";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "./TurmasStyles";

const ROTULO_STATUS = Object.fromEntries(STATUS_TURMA.map((s) => [s.valor, s.rotulo]));

/**
 * Página da turma: a mesma lista de inscritos da agenda, sem modal, com espaço
 * para as abas que vêm nas fases seguintes (Presença, Documentos).
 *
 * Adicionar, editar e remover inscritos funcionam aqui como na agenda — é o
 * mesmo `InscritosConteudo` e o mesmo `useInscritos`; a agenda não perde nada,
 * ganha um segundo caminho.
 */
export default function TurmaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const detalhe = useTurmaDetalhe(id);
  const inscritos = useInscritos({ turma: detalhe.turma, aoMudar: detalhe.recarregar });

  const [editando, setEditando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  // Inscritos carregam quando a turma chega (e recarregam se o id mudar).
  useEffect(() => {
    if (detalhe.turma?.id) inscritos.carregar(detalhe.turma.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalhe.turma?.id]);

  const voltar = () => navigate("/condomed/turmas");

  const salvarTurma = async (dados) => {
    const salva = await detalhe.atualizar(dados);
    if (salva) setEditando(false);
  };

  const confirmarExclusao = async () => {
    setConfirmandoExclusao(false);
    const ok = await detalhe.excluir();
    if (ok) voltar();
  };

  const turma = detalhe.turma;

  if (detalhe.naoEncontrada) {
    return (
      <PageLayout
        title="Turma não encontrada"
        subtitle="Ela pode ter sido excluída"
        icon={<FaChalkboardTeacher />}
        empty
        emptyMessage="Esta turma não existe mais. Volte ao histórico para ver as demais."
        actions={
          <C.Botao type="button" $variante="secundario" onClick={voltar}>
            <FaArrowLeft size={11} /> Voltar ao histórico
          </C.Botao>
        }
      />
    );
  }

  const titulo = turma
    ? `${turma.local_nome} · ${inscritos.inscritos.length}/${turma.capacidade}`
    : "Turma";
  const subtitulo = turma
    ? `${format(parseISO(turma.data), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} · 09:00 às 17:30 · ${ROTULO_STATUS[turma.status] || turma.status}`
    : "";

  return (
    <PageLayout
      title={titulo}
      subtitle={subtitulo}
      icon={<FaChalkboardTeacher />}
      loading={detalhe.carregando}
      actions={
        <C.AcoesCabecalho>
          <C.Botao type="button" $variante="secundario" onClick={voltar}>
            <FaArrowLeft size={11} /> Histórico
          </C.Botao>
          <C.Botao
            type="button"
            $variante="secundario"
            onClick={() => navigate("/condomed/cursos-cipa")}
          >
            <FaCalendarAlt size={11} /> Agenda
          </C.Botao>
        </C.AcoesCabecalho>
      }
    >
      {turma && (
        <C.Container>
          <S.Medidas>
            <span>
              Data <strong>{format(parseISO(turma.data), "dd/MM/yyyy")}</strong>
            </span>
            <span>
              Local <strong>{turma.local_nome}</strong>
            </span>
            <span>
              Situação <strong>{ROTULO_STATUS[turma.status] || turma.status}</strong>
            </span>
            <span>
              Administradoras <strong>{(turma.administradoras || []).length}</strong>
            </span>
            <span>
              Condomínios <strong>{(turma.condominios || []).length}</strong>
            </span>
            {turma.observacao && (
              <span>
                Observação <strong style={{ fontSize: "0.9rem" }}>{turma.observacao}</strong>
              </span>
            )}
          </S.Medidas>

          <S.Superficie>
            <InscritosConteudo
              turma={turma}
              inscritos={inscritos.inscritos}
              onAdicionar={inscritos.adicionar}
              onVerificarCpf={inscritos.verificarCpf}
              onEditar={inscritos.editar}
              onRemover={inscritos.remover}
              onEditarTurma={() => setEditando(true)}
              onExcluirTurma={() => setConfirmandoExclusao(true)}
            />
          </S.Superficie>

          <TurmaModal
            aberto={editando}
            turma={turma}
            locais={detalhe.locais}
            salvando={detalhe.salvando}
            onSalvar={salvarTurma}
            onExcluir={() => {
              setEditando(false);
              setConfirmandoExclusao(true);
            }}
            onFechar={() => setEditando(false)}
          />

          <ExcluirTurmaModal
            turma={confirmandoExclusao ? turma : null}
            onConfirmar={confirmarExclusao}
            onCancelar={() => setConfirmandoExclusao(false)}
          />
        </C.Container>
      )}
    </PageLayout>
  );
}
