import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import InscritosConteudo from "./InscritosConteudo";
import * as S from "../CursoCipaStyles";

/**
 * Moldura de modal do painel de inscritos, usada pela agenda. O conteúdo é o
 * `InscritosConteudo`, compartilhado com a página de detalhe da turma.
 *
 * `onVerDetalhe` leva para a página da turma (histórico, presença e
 * documentos nas fases seguintes) — é de lá que o operador sai no dia seguinte
 * ao curso.
 */
export default function InscritosPanel({ turma, onFechar, onVerDetalhe, ...conteudo }) {
  if (!turma) return null;

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal $largo onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>
              {turma.local_nome} · {conteudo.inscritos.length}/{turma.capacidade}
            </h2>
            <p>
              {format(parseISO(turma.data), "EEEE, d 'de' MMMM", { locale: ptBR })} ·
              09:00 às 17:30
              {turma.administradoras?.length
                ? ` · ${turma.administradoras.length} ${
                    turma.administradoras.length === 1
                      ? "administradora"
                      : "administradoras"
                  }`
                : ""}
            </p>
          </div>
          <S.BarraTurmaAcoes>
            {onVerDetalhe && (
              <S.Botao
                type="button"
                $variante="secundario"
                onClick={() => onVerDetalhe(turma)}
                title="Abrir a página da turma"
              >
                <FaExternalLinkAlt size={10} /> Ver detalhe
              </S.Botao>
            )}
            <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
              <FaTimes />
            </S.FecharButton>
          </S.BarraTurmaAcoes>
        </S.ModalHeader>

        <InscritosConteudo turma={turma} {...conteudo} />
      </S.Modal>
    </S.Overlay>
  );
}
