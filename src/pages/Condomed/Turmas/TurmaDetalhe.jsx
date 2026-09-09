import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  FaArrowLeft,
  FaAward,
  FaBuilding,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaCity,
  FaFilePdf,
  FaHistory,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaUser,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import InscritosConteudo from "../CursoCipa/components/InscritosConteudo";
import TurmaModal from "../CursoCipa/components/TurmaModal";
import ExcluirTurmaModal from "../CursoCipa/components/ExcluirTurmaModal";
import { useInscritos } from "../CursoCipa/hooks/useInscritos";
import { STATUS_TURMA } from "../CursoCipa/hooks/useCursoCipa";
import { useTurmaDetalhe } from "./hooks/useTurmaDetalhe";
import PresencaConteudo from "./PresencaConteudo";
import CertificadosConteudo from "./CertificadosConteudo";
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
  // "inscritos" | "presenca" (RF-HIS-005). Certificados chegam na fase D.
  const [aba, setAbaInterna] = useState("inscritos");
  const [presencaPendente, setPresencaPendente] = useState(false);
  const [inscritoParaEditar, setInscritoParaEditar] = useState(null);
  const setAba = (proxima) => {
    if (
      proxima !== aba &&
      presencaPendente &&
      !window.confirm("Há marcações de presença não salvas. Sair da aba e descartá-las?")
    ) {
      return;
    }
    setAbaInterna(proxima);
  };

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

  const rotuloSituacao = turma ? ROTULO_STATUS[turma.status] || turma.status : "";
  const titulo = turma ? (
    <>
      {turma.local_nome} · {inscritos.inscritos.length}/{turma.capacidade}{" "}
      <C.SeloSituacao $status={turma.status}>
        {turma.status === "cancelada" ? <FaTimesCircle size={11} /> : <FaCalendarAlt size={11} />}
        {rotuloSituacao}
      </C.SeloSituacao>
    </>
  ) : (
    "Turma"
  );
  const subtitulo = turma
    ? `${turma.codigo} · ${format(parseISO(turma.data), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })} · 09:00 às 17:30`
    : "";

  return (
    <PageLayout
      title={titulo}
      subtitle={subtitulo}
      icon={<FaUsers />}
      loading={detalhe.carregando}
      actions={
        <C.AcoesCabecalho>
          <C.Botao type="button" $variante="secundario" onClick={voltar}>
            <FaHistory size={11} /> Histórico
          </C.Botao>
          <C.Botao
            type="button"
            $variante="secundario"
            onClick={() => navigate("/condomed/cursos-cipa")}
          >
            <FaCalendarAlt size={11} /> Agenda
          </C.Botao>
          <C.Botao
            type="button"
            onClick={detalhe.baixarListaPresenca}
            disabled={!turma || detalhe.baixandoLista}
            title="PDF para assinatura no dia, ordenado por condomínio, com linhas em branco para quem chegar de última hora"
          >
            <FaFilePdf size={11} />{" "}
            {detalhe.baixandoLista ? "Gerando..." : "Lista de presença (PDF)"}
          </C.Botao>
        </C.AcoesCabecalho>
      }
    >
      {turma && (
        <C.Container>
          <C.MedidasGrid>
            <C.MedidaCartao>
              <C.MedidaIcone><FaCalendarAlt /></C.MedidaIcone>
              <div>
                <small>Data</small>
                <strong>{format(parseISO(turma.data), "dd/MM/yyyy")}</strong>
              </div>
            </C.MedidaCartao>
            <C.MedidaCartao>
              <C.MedidaIcone><FaMapMarkerAlt /></C.MedidaIcone>
              <div>
                <small>Local</small>
                <strong>{turma.local_nome}</strong>
              </div>
            </C.MedidaCartao>
            <C.MedidaCartao>
              <C.MedidaIcone $tom={turma.status === "cancelada" ? undefined : "ok"}>
                {turma.status === "cancelada" ? <FaTimesCircle /> : <FaCheckCircle />}
              </C.MedidaIcone>
              <div>
                <small>Situação</small>
                <strong>{rotuloSituacao}</strong>
              </div>
            </C.MedidaCartao>
            <C.MedidaCartao>
              <C.MedidaIcone><FaUser /></C.MedidaIcone>
              <div>
                <small>Instrutor</small>
                <strong
                  data-alerta={!turma.instrutor}
                  title={turma.instrutor ? turma.instrutor_nome : "Obrigatório para emitir certificado"}
                >
                  {turma.instrutor_nome || "a definir"}
                </strong>
              </div>
            </C.MedidaCartao>
            <C.MedidaCartao>
              <C.MedidaIcone><FaBuilding /></C.MedidaIcone>
              <div>
                <small>Administradoras</small>
                <strong>{(turma.administradoras || []).length}</strong>
              </div>
            </C.MedidaCartao>
            <C.MedidaCartao>
              <C.MedidaIcone><FaCity /></C.MedidaIcone>
              <div>
                <small>Condomínios</small>
                <strong>{(turma.condominios || []).length}</strong>
              </div>
            </C.MedidaCartao>
          </C.MedidasGrid>
          {turma.observacao && (
            <C.AvisoBloco $tom="aviso" style={{ marginTop: 0, marginBottom: "1rem" }}>
              <strong>Observação:</strong>&nbsp;{turma.observacao}
            </C.AvisoBloco>
          )}
          {turma.certificados_emitidos > 0 && (
            <C.AvisoBloco $tom="aviso" style={{ marginTop: 0, marginBottom: "1rem" }}>
              <FaAward size={11} />
              Turma com {turma.certificados_emitidos}{" "}
              {turma.certificados_emitidos === 1 ? "certificado emitido" : "certificados emitidos"}: não pode
              mais ser excluída nem cancelada, e os participantes certificados não podem ser removidos.
            </C.AvisoBloco>
          )}

          <S.Abas role="tablist">
            <S.Aba
              type="button"
              role="tab"
              $ativa={aba === "inscritos"}
              aria-selected={aba === "inscritos"}
              onClick={() => setAba("inscritos")}
            >
              <FaUsers size={12} /> Inscritos <small>{inscritos.inscritos.length}</small>
            </S.Aba>
            <S.Aba
              type="button"
              role="tab"
              $ativa={aba === "presenca"}
              aria-selected={aba === "presenca"}
              onClick={() => setAba("presenca")}
              title={
                turma.status === "cancelada"
                  ? "Turma cancelada"
                  : "Quem veio e quem faltou; a turma vira Realizada ao salvar"
              }
            >
              <FaUserCheck size={12} /> Presença
              <small>
                {turma.presentes ?? 0}/{turma.total_inscritos ?? inscritos.inscritos.length}
              </small>
            </S.Aba>
            <S.Aba
              type="button"
              role="tab"
              $ativa={aba === "certificados"}
              aria-selected={aba === "certificados"}
              onClick={() => setAba("certificados")}
              title="Emitir e baixar os certificados de quem esteve no curso"
            >
              <FaAward size={12} /> Certificados
              <small>
                {turma.certificados_emitidos ?? 0}/{turma.presentes ?? 0}
              </small>
            </S.Aba>
          </S.Abas>

          {aba === "inscritos" && (
            <InscritosConteudo
              layout="pagina"
              turma={turma}
              inscritos={inscritos.inscritos}
              onAdicionar={inscritos.adicionar}
              onVerificarCpf={inscritos.verificarCpf}
              onEditar={inscritos.editar}
              onRemover={inscritos.remover}
              onEditarTurma={() => setEditando(true)}
              onExcluirTurma={turma.certificados_emitidos > 0 ? undefined : () => setConfirmandoExclusao(true)}
              editarInicial={inscritoParaEditar}
            />
          )}

          {aba === "certificados" && (
            <CertificadosConteudo
              turma={turma}
              inscritos={turma.inscricoes || []}
              onEmitir={detalhe.emitirCertificados}
              emitindo={detalhe.emitindo}
              onBaixarTodos={detalhe.baixarCertificados}
              onBaixarUm={detalhe.baixarCertificado}
              baixando={detalhe.baixandoCertificado}
              onEditarTurma={() => setEditando(true)}
              onEditarInscrito={(inscrito) => {
                setInscritoParaEditar(inscrito);
                setAbaInterna("inscritos");
              }}
            />
          )}

          {aba === "presenca" && (
            <PresencaConteudo
              turma={turma}
              inscritos={turma.inscricoes || []}
              onSalvar={detalhe.registrarPresenca}
              salvando={detalhe.salvandoPresenca}
              onPendencias={setPresencaPendente}
            />
          )}

          <TurmaModal
            aberto={editando}
            turma={turma}
            locais={detalhe.locais}
            salvando={detalhe.salvando}
            onSalvar={salvarTurma}
            onExcluir={
              turma.certificados_emitidos > 0
                ? undefined
                : () => {
                    setEditando(false);
                    setConfirmandoExclusao(true);
                  }
            }
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
