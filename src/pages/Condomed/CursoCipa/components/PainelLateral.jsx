import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";
import { ORDEM_LOCAIS } from "../hooks/useCursoCipa";
import * as S from "../CursoCipaStyles";

function LinhaTurma({ turma, onAbrir, rotuloData }) {
  const acima = (turma.acima_da_capacidade ?? 0) > 0;
  return (
    <S.LinhaTurma type="button" onClick={() => onAbrir(turma)}>
      <S.LinhaData dateTime={turma.data}>{rotuloData}</S.LinhaData>
      <span>
        <S.LinhaNome>
          {turma.local_nome} · {turma.total_inscritos}/{turma.capacidade}
        </S.LinhaNome>
        <S.LinhaMeta>
          <S.Etiqueta $local={turma.local}>{turma.local_nome}</S.Etiqueta>
          {String(turma.hora_inicio).slice(0, 5)}–{String(turma.hora_fim).slice(0, 5)}
        </S.LinhaMeta>
      </span>
      <S.Ocupacao $lotada={acima} title={acima ? "Acima da capacidade do local" : undefined}>
        {turma.total_inscritos}/{turma.capacidade}
      </S.Ocupacao>
    </S.LinhaTurma>
  );
}

/** Hoje, o que vem a seguir, o que exige ação e a ocupação de cada local. */
export default function PainelLateral({
  hoje,
  turmasDeHoje,
  proximasTurmas,
  alertas,
  resumo,
  locais,
  onAbrirTurma,
}) {
  return (
    <S.Trilho>
      <S.Cartao>
        <S.CartaoTopo>
          <h3>Hoje</h3>
          <S.MedidaNota>
            {format(parseISO(hoje), "d 'de' MMMM", { locale: ptBR })}
          </S.MedidaNota>
        </S.CartaoTopo>
        {turmasDeHoje.length === 0 ? (
          <S.Vazio>Nenhuma turma hoje.</S.Vazio>
        ) : (
          <S.Lista>
            {turmasDeHoje.map((turma) => (
              <S.Item key={turma.id}>
                <LinhaTurma
                  turma={turma}
                  onAbrir={onAbrirTurma}
                  rotuloData={format(parseISO(turma.data), "EEE", { locale: ptBR })}
                />
                <S.Barra
                  $local={turma.local}
                  $porcento={(turma.total_inscritos / turma.capacidade) * 100}
                />
              </S.Item>
            ))}
          </S.Lista>
        )}
      </S.Cartao>

      <S.Cartao>
        <S.CartaoTopo>
          <h3>Próximas turmas</h3>
        </S.CartaoTopo>
        {proximasTurmas.length === 0 ? (
          <S.Vazio>Nada marcado daqui até o fim do mês.</S.Vazio>
        ) : (
          <S.Lista>
            {proximasTurmas.slice(0, 6).map((turma) => (
              <S.Item key={turma.id}>
                <LinhaTurma
                  turma={turma}
                  onAbrir={onAbrirTurma}
                  rotuloData={format(parseISO(turma.data), "dd/MM")}
                />
              </S.Item>
            ))}
          </S.Lista>
        )}
      </S.Cartao>

      <S.Cartao>
        <S.CartaoTopo>
          <h3>Pedem atenção</h3>
        </S.CartaoTopo>
        {alertas.length === 0 ? (
          <S.Vazio>Nada pendente nas turmas daqui em diante.</S.Vazio>
        ) : (
          <S.Lista>
            {alertas.map((alerta) => (
              <S.Item key={alerta.id}>
                <S.Alerta
                  type="button"
                  $grave={alerta.grave}
                  onClick={() => onAbrirTurma(alerta.turmas[0])}
                >
                  {alerta.grave ? (
                    <FaExclamationCircle size={13} />
                  ) : (
                    <FaExclamationTriangle size={13} />
                  )}
                  <span>
                    <strong>{alerta.titulo}</strong>
                    <span>{alerta.detalhe}</span>
                  </span>
                </S.Alerta>
              </S.Item>
            ))}
          </S.Lista>
        )}
      </S.Cartao>

      <S.Cartao>
        <S.CartaoTopo>
          <h3>Ocupação por local</h3>
        </S.CartaoTopo>
        {ORDEM_LOCAIS.map((codigo) => {
          const medida = resumo.porLocal[codigo];
          const local = locais.find((item) => item.codigo === codigo);
          return (
            <S.LinhaLocal key={codigo}>
              <b>{local?.nome || codigo}</b>
              <em>{medida.ocupacao}%</em>
              <S.Barra $local={codigo} $porcento={medida.ocupacao} />
              <small>
                {medida.turmas} {medida.turmas === 1 ? "turma" : "turmas"} ·{" "}
                {medida.inscritos} de {medida.vagas} vagas
              </small>
            </S.LinhaLocal>
          );
        })}
      </S.Cartao>
    </S.Trilho>
  );
}
