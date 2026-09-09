import { useEffect, useMemo, useState } from "react";
import { format, parseISO, isAfter, startOfDay } from "date-fns";
import {
  FaCheck,
  FaCheckDouble,
  FaExclamationTriangle,
  FaLock,
  FaSave,
  FaTimes,
  FaUndo,
  FaUserCheck,
} from "react-icons/fa";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "./TurmasStyles";

/** 11 dígitos → 000.000.000-00; devolve o que recebeu se não for CPF limpo. */
const formatarCpf = (cpf) =>
  /^\d{11}$/.test(cpf || "") ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : cpf;

/**
 * Aba Presença do detalhe da turma (RF-HIS-005).
 *
 * Três estados por inscrito — presente, ausente, não registrado — editados em
 * memória e enviados de uma vez em `onSalvar`. A situação da turma vira
 * "Realizada" no backend, não aqui. A ordem é a da lista impressa (condomínio,
 * depois nome), que é a ordem em que o backend já devolve as inscrições.
 */
export default function PresencaConteudo({ turma, inscritos, onSalvar, salvando, onPendencias }) {
  const originais = useMemo(
    () => Object.fromEntries((inscritos || []).map((i) => [i.id, i.presenca ?? null])),
    [inscritos]
  );
  const [marcacoes, setMarcacoes] = useState(originais);

  // Recarregou a turma (salvou, adicionou inscrito): parte do que está gravado.
  useEffect(() => setMarcacoes(originais), [originais]);

  const pendentes = useMemo(
    () => Object.keys(marcacoes).filter((id) => marcacoes[id] !== originais[id]),
    [marcacoes, originais]
  );
  const temPendencias = pendentes.length > 0;

  // O pai decide se deixa trocar de aba com marcações não salvas.
  useEffect(() => {
    if (onPendencias) onPendencias(temPendencias);
    return () => onPendencias && onPendencias(false);
  }, [temPendencias, onPendencias]);

  // Sair da página com marcações não salvas pede confirmação (regra da tela).
  useEffect(() => {
    if (!temPendencias) return undefined;
    const avisar = (evento) => {
      evento.preventDefault();
      evento.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [temPendencias]);

  const hoje = startOfDay(new Date());
  const dataTurma = turma ? startOfDay(parseISO(turma.data)) : null;
  const antesDoDia = dataTurma ? isAfter(dataTurma, hoje) : false;
  const cancelada = turma?.status === "cancelada";
  const bloqueada = cancelada || antesDoDia;

  const marcar = (id, valor) => setMarcacoes((atual) => ({ ...atual, [id]: valor }));

  /** Preenche presente só para quem está sem registro; não mexe em ausentes. */
  const marcarTodosPresentes = () =>
    setMarcacoes((atual) => {
      const proximo = { ...atual };
      Object.keys(proximo).forEach((id) => {
        if (proximo[id] === null || proximo[id] === undefined) proximo[id] = true;
      });
      return proximo;
    });

  const desfazer = () => setMarcacoes(originais);

  const salvar = async () => {
    const presencas = Object.entries(marcacoes)
      .filter(([, valor]) => valor === true || valor === false)
      .map(([id, valor]) => ({ inscricao_id: Number(id), presente: valor }));
    if (presencas.length === 0) return;
    await onSalvar(presencas);
  };

  const contagem = useMemo(() => {
    const valores = Object.values(marcacoes);
    return {
      presentes: valores.filter((v) => v === true).length,
      ausentes: valores.filter((v) => v === false).length,
      semRegistro: valores.filter((v) => v !== true && v !== false).length,
    };
  }, [marcacoes]);

  const ultimoRegistro = useMemo(() => {
    const registradas = (inscritos || []).filter((i) => i.presenca_registrada_em);
    if (registradas.length === 0) return null;
    return registradas.reduce((a, b) =>
      a.presenca_registrada_em > b.presenca_registrada_em ? a : b
    );
  }, [inscritos]);

  if (!turma) return null;

  return (
    <C.CartaoDetalhe>
      <C.CartaoCabecalho>
        <div>
          <C.CartaoTitulo>
            <FaUserCheck size={20} />
            <h2>Presença</h2>
            <C.Pilula>{contagem.presentes}/{inscritos.length}</C.Pilula>
          </C.CartaoTitulo>
          <C.CartaoSubtitulo>
            {bloqueada
              ? cancelada
                ? "Turma cancelada: não houve curso, não há presença a registrar."
                : `Disponível a partir de ${format(dataTurma, "dd/MM/yyyy")} — presença é fato do dia.`
              : ultimoRegistro
              ? `Último registro por ${ultimoRegistro.presenca_registrada_por_nome || "—"} em ${format(
                  parseISO(ultimoRegistro.presenca_registrada_em),
                  "dd/MM/yyyy 'às' HH:mm"
                )}. Pode regravar a qualquer tempo.`
              : "Marque quem veio e quem faltou; a turma passa a Realizada ao salvar."}
          </C.CartaoSubtitulo>
        </div>
        {!bloqueada && (
          <C.BarraTurmaAcoes>
            <C.Botao
              type="button"
              $variante="secundario"
              onClick={marcarTodosPresentes}
              disabled={salvando || contagem.semRegistro === 0}
              title="Marca presente só quem ainda está sem registro"
            >
              <FaCheckDouble size={11} /> Marcar todos presentes
            </C.Botao>
            <C.Botao
              type="button"
              $variante="secundario"
              onClick={desfazer}
              disabled={salvando || !temPendencias}
            >
              <FaUndo size={11} /> Desfazer
            </C.Botao>
            <C.Botao
              type="button"
              onClick={salvar}
              disabled={salvando || !temPendencias}
            >
              <FaSave size={11} /> {salvando ? "Salvando..." : `Salvar presença${temPendencias ? ` (${pendentes.length})` : ""}`}
            </C.Botao>
          </C.BarraTurmaAcoes>
        )}
      </C.CartaoCabecalho>

      {bloqueada && (
        <C.AvisoBloco $tom="aviso">
          <FaLock size={11} />
          {cancelada
            ? "A aba fica desabilitada em turma cancelada."
            : "Registrar antes do dia produziria um registro falso; o backend recusa."}
        </C.AvisoBloco>
      )}

      {temPendencias && !bloqueada && (
        <C.AvisoBloco $tom="aviso">
          <FaExclamationTriangle size={11} />
          {pendentes.length} {pendentes.length === 1 ? "marcação" : "marcações"} ainda não
          {pendentes.length === 1 ? " foi salva" : " foram salvas"}. Clique em Salvar presença
          para gravar; a turma passa a Realizada.
        </C.AvisoBloco>
      )}

      <S.Resumo>
        <S.SeloContagem $tom="ok">{contagem.presentes} presentes</S.SeloContagem>
        <S.SeloContagem $tom="erro">{contagem.ausentes} ausentes</S.SeloContagem>
        <S.SeloContagem>{contagem.semRegistro} sem registro</S.SeloContagem>
      </S.Resumo>

      {inscritos.length === 0 ? (
        <C.Vazio>Nenhum inscrito nesta turma.</C.Vazio>
      ) : (
        <C.Tabela>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Condomínio</th>
              <th>Registro</th>
              <th style={{ textAlign: "right" }}>Presença</th>
            </tr>
          </thead>
          <tbody>
            {inscritos.map((inscrito) => {
              const valor = marcacoes[inscrito.id];
              const alterado = valor !== originais[inscrito.id];
              return (
                <tr key={inscrito.id} data-editando={alterado}>
                  <td>{inscrito.nome}</td>
                  <td style={{ fontFamily: "monospace" }}>{formatarCpf(inscrito.cpf)}</td>
                  <td>{inscrito.condominio_nome}</td>
                  <td>
                    {inscrito.presenca_registrada_em ? (
                      <small title={inscrito.presenca_registrada_por_nome}>
                        {format(parseISO(inscrito.presenca_registrada_em), "dd/MM HH:mm")}
                        {inscrito.presenca_registrada_por_nome
                          ? ` · ${inscrito.presenca_registrada_por_nome}`
                          : ""}
                      </small>
                    ) : (
                      <small style={{ color: "#94a3b8" }}>—</small>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <S.Segmentado role="radiogroup" aria-label={`Presença de ${inscrito.nome}`}>
                      <S.OpcaoSegmento
                        type="button"
                        role="radio"
                        aria-checked={valor === true}
                        $tom="ok"
                        $ativa={valor === true}
                        disabled={bloqueada || salvando}
                        onClick={() => marcar(inscrito.id, true)}
                      >
                        <FaCheck size={10} /> Presente
                      </S.OpcaoSegmento>
                      <S.OpcaoSegmento
                        type="button"
                        role="radio"
                        aria-checked={valor === false}
                        $tom="erro"
                        $ativa={valor === false}
                        disabled={bloqueada || salvando}
                        onClick={() => marcar(inscrito.id, false)}
                      >
                        <FaTimes size={10} /> Ausente
                      </S.OpcaoSegmento>
                    </S.Segmentado>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </C.Tabela>
      )}
    </C.CartaoDetalhe>
  );
}
