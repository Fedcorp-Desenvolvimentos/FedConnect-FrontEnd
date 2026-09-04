import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import ConfirmarModal from "./ConfirmarModal";

/**
 * Confirmação de exclusão da turma inteira (ADR-0006): nomeia local e dia,
 * quantos inscritos saem e quais condomínios perdem gente. Não tem desfazer.
 *
 * Fonte única entre a agenda e a página de detalhe da turma — a perda por
 * condomínio é calculada aqui, uma vez.
 */
export default function ExcluirTurmaModal({ turma, onConfirmar, onCancelar }) {
  /** Quantos inscritos por condomínio, para a confirmação nomear a perda. */
  const perdaPorCondominio = useMemo(() => {
    const inscricoes = turma?.inscricoes || [];
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
  }, [turma]);

  const mensagem = turma
    ? [
        `${turma.local_nome} · ${format(parseISO(turma.data), "d 'de' MMMM", {
          locale: ptBR,
        })}.`,
        turma.total_inscritos > 0
          ? `A turma e ${
              turma.total_inscritos === 1
                ? "o inscrito abaixo saem"
                : `os ${turma.total_inscritos} inscritos abaixo saem`
            } do sistema.`
          : "A turma não tem ninguém inscrito.",
        turma.local === "SALA_REUNIAO" ? "A reserva da sala na agenda é liberada." : "",
        "Não dá para desfazer.",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <ConfirmarModal
      aberto={Boolean(turma)}
      titulo="Excluir a turma inteira?"
      mensagem={mensagem}
      itens={perdaPorCondominio}
      textoConfirmar="Excluir turma"
      onConfirmar={onConfirmar}
      onCancelar={onCancelar}
    />
  );
}
