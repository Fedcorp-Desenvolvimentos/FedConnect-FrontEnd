import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  FaAward,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
  FaFilePdf,
  FaLock,
  FaPencilAlt,
} from "react-icons/fa";
import ConfirmarModal from "../CursoCipa/components/ConfirmarModal";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "./TurmasStyles";

const formatarCpf = (cpf) =>
  /^\d{11}$/.test(cpf || "") ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;

/**
 * Aba Certificados do detalhe da turma (RF-HIS-006).
 *
 * Lista os presentes com o estado que vem do backend — emitido (número),
 * apto ou impedido (sem CNPJ) — e emite em lote com um clique. A emissão é
 * parcial por decisão do dono (PA-030): sai para quem pode, e a tela mostra
 * quem ficou de fora, com atalho para corrigir o inscrito. Contagens e
 * regras são do backend; aqui só se apresenta.
 */
export default function CertificadosConteudo({
  turma,
  inscritos,
  onEmitir,
  emitindo,
  onBaixarTodos,
  onBaixarUm,
  baixando,
  onEditarInscrito,
  onEditarTurma,
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [ultimoLote, setUltimoLote] = useState(null);

  const presentes = useMemo(
    () => (inscritos || []).filter((i) => i.presenca === true),
    [inscritos]
  );

  if (!turma) return null;

  const cancelada = turma.status === "cancelada";
  const semPresenca = (turma.presentes ?? 0) + (turma.ausentes ?? 0) === 0;
  const semInstrutor = !turma.instrutor;
  const semAssinatura = Boolean(turma.instrutor) && turma.instrutor_tem_assinatura === false;
  const bloqueio = cancelada
    ? "Turma cancelada não emite certificado."
    : semPresenca
    ? "Registre a presença primeiro: o certificado sai só para quem esteve no curso."
    : semInstrutor
    ? "Defina o instrutor da turma: é ele quem assina o certificado."
    : semAssinatura
    ? `${turma.instrutor_nome} está sem assinatura digitalizada. Anexe em Cadastros › Palestrantes.`
    : null;

  const emitidos = turma.certificados_emitidos ?? 0;
  const aptos = turma.aptos_sem_certificado ?? 0;
  const semCnpj = turma.presentes_sem_cnpj ?? 0;

  const estadoDe = (inscrito) => {
    if (inscrito.certificado) return "emitido";
    if (!inscrito.condominio_cnpj) return "impedido";
    return "apto";
  };

  const confirmarEmissao = async () => {
    setConfirmando(false);
    const lote = await onEmitir();
    if (lote) setUltimoLote(lote);
  };

  return (
    <C.CartaoDetalhe>
      <C.CartaoCabecalho>
        <div>
          <C.CartaoTitulo>
            <FaAward size={20} />
            <h2>Certificados</h2>
            <C.Pilula>{emitidos}/{presentes.length}</C.Pilula>
          </C.CartaoTitulo>
          <C.CartaoSubtitulo>
            {bloqueio
              ? bloqueio
              : aptos > 0
              ? `${aptos} ${aptos === 1 ? "presente apto" : "presentes aptos"} sem certificado. Um clique emite para todos.`
              : emitidos > 0
              ? "Todos os presentes aptos já têm certificado. Baixe de novo quando precisar: o número não muda."
              : "Nenhum presente apto a receber certificado."}
          </C.CartaoSubtitulo>
        </div>
        <C.BarraTurmaAcoes>
          {bloqueio && (semInstrutor || semAssinatura) && onEditarTurma && (
            <C.Botao type="button" $variante="secundario" onClick={onEditarTurma}>
              <FaPencilAlt size={11} /> Editar turma
            </C.Botao>
          )}
          <C.Botao
            type="button"
            $variante="secundario"
            onClick={onBaixarTodos}
            disabled={emitidos === 0 || baixando}
            title="Um PDF com todos os certificados emitidos, frente e verso"
          >
            <FaFilePdf size={11} /> {baixando === "todos" ? "Gerando..." : `Baixar todos (${emitidos})`}
          </C.Botao>
          <C.Botao
            type="button"
            onClick={() => setConfirmando(true)}
            disabled={Boolean(bloqueio) || aptos === 0 || emitindo}
            title={bloqueio || (aptos === 0 ? "Ninguém apto sem certificado" : undefined)}
          >
            <FaAward size={11} /> {emitindo ? "Emitindo..." : `Emitir certificados${aptos ? ` (${aptos})` : ""}`}
          </C.Botao>
        </C.BarraTurmaAcoes>
      </C.CartaoCabecalho>

      {bloqueio && (
        <C.AvisoBloco $tom="aviso">
          <FaLock size={11} /> {bloqueio}
        </C.AvisoBloco>
      )}

      {!bloqueio && semCnpj > 0 && (
        <C.AvisoBloco $tom="aviso">
          <FaExclamationTriangle size={11} />
          {semCnpj} {semCnpj === 1 ? "presente está" : "presentes estão"} sem CNPJ do condomínio e não
          {semCnpj === 1 ? " receberá" : " receberão"} certificado até o CNPJ ser preenchido. Os demais saem normalmente.
        </C.AvisoBloco>
      )}

      {ultimoLote && (
        <C.AvisoBloco $tom={ultimoLote.impedidos?.length ? "aviso" : "ok"} role="status">
          <FaCheckCircle size={11} />
          Emissão concluída: {ultimoLote.emitidos.length} {ultimoLote.emitidos.length === 1 ? "certificado emitido" : "certificados emitidos"}
          {ultimoLote.ja_existentes?.length ? `, ${ultimoLote.ja_existentes.length} já existiam` : ""}
          {ultimoLote.impedidos?.length
            ? `, ${ultimoLote.impedidos.length} não ${ultimoLote.impedidos.length === 1 ? "emitido" : "emitidos"}: ${ultimoLote.impedidos.map((i) => i.nome).join(", ")}.`
            : "."}
        </C.AvisoBloco>
      )}

      <S.Resumo>
        <S.SeloContagem $tom="ok">{emitidos} emitidos</S.SeloContagem>
        <S.SeloContagem>{aptos} aptos</S.SeloContagem>
        <S.SeloContagem $tom={semCnpj ? "erro" : undefined}>{semCnpj} sem CNPJ</S.SeloContagem>
      </S.Resumo>

      {presentes.length === 0 ? (
        <C.Vazio>Nenhum presente registrado nesta turma.</C.Vazio>
      ) : (
        <C.Tabela>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Condomínio</th>
              <th>Certificado</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {presentes.map((inscrito) => {
              const estado = estadoDe(inscrito);
              return (
                <tr key={inscrito.id}>
                  <td>{inscrito.nome}</td>
                  <td style={{ fontFamily: "monospace" }}>{formatarCpf(inscrito.cpf)}</td>
                  <td>
                    {inscrito.condominio_nome}
                    {!inscrito.condominio_cnpj && (
                      <>
                        {" "}
                        <S.SeloContagem $tom="erro" title="Obrigatório para emitir">sem CNPJ</S.SeloContagem>
                      </>
                    )}
                  </td>
                  <td>
                    {estado === "emitido" && (
                      <span>
                        <strong style={{ fontFamily: "monospace" }}>{inscrito.certificado.numero}</strong>
                        <br />
                        <small style={{ color: "#64748b" }}>
                          {format(parseISO(inscrito.certificado.emitido_em), "dd/MM/yyyy HH:mm")}
                          {inscrito.certificado.emitido_por_nome ? ` · ${inscrito.certificado.emitido_por_nome}` : ""}
                        </small>
                      </span>
                    )}
                    {estado === "apto" && <S.SeloContagem>apto — aguarda emissão</S.SeloContagem>}
                    {estado === "impedido" && (
                      <S.SeloContagem $tom="erro">impedido — sem CNPJ do condomínio</S.SeloContagem>
                    )}
                  </td>
                  <td>
                    <C.AcoesLinha>
                      {estado === "emitido" ? (
                        <C.Botao
                          type="button"
                          $variante="secundario"
                          onClick={() => onBaixarUm(inscrito.certificado.numero)}
                          disabled={Boolean(baixando)}
                          title="Reimprimir: mesmo número, conteúdo atual do registro"
                        >
                          <FaDownload size={10} /> {baixando === inscrito.certificado.numero ? "Gerando..." : "Baixar"}
                        </C.Botao>
                      ) : estado === "impedido" && onEditarInscrito ? (
                        <C.Botao
                          type="button"
                          $variante="secundario"
                          onClick={() => onEditarInscrito(inscrito)}
                          title="Preencher o CNPJ do condomínio"
                        >
                          <FaPencilAlt size={10} /> Informar CNPJ
                        </C.Botao>
                      ) : null}
                    </C.AcoesLinha>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </C.Tabela>
      )}

      <ConfirmarModal
        aberto={confirmando}
        titulo={`Emitir ${aptos} ${aptos === 1 ? "certificado" : "certificados"}?`}
        mensagem={`Sai um certificado numerado para cada presente apto${
          semCnpj ? `; ${semCnpj} sem CNPJ ${semCnpj === 1 ? "fica" : "ficam"} de fora até corrigir` : ""
        }. Depois de emitido, o número não muda e a turma não pode mais ser excluída nem cancelada.`}
        textoConfirmar="Emitir"
        onConfirmar={confirmarEmissao}
        onCancelar={() => setConfirmando(false)}
      />
    </C.CartaoDetalhe>
  );
}
