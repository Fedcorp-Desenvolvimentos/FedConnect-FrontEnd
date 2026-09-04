import { useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { addDays, endOfMonth, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import * as S from "../CursoCipaStyles";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Mês em grade. Uma turma ocupa o dia inteiro (09:00–17:30) e cabe uma por
 * local — os dias com turma mostram a etiqueta dela; os dias livres ficam
 * limpos, e o clique no dia abre o agendamento.
 */
export default function CalendarioMensal({
  mes,
  ano,
  hoje,
  turmasPorDia,
  onAgendar,
  onAbrirTurma,
}) {
  const referencia = useMemo(() => new Date(ano, mes - 1, 1), [ano, mes]);

  const semanas = useMemo(() => {
    const inicio = startOfWeek(startOfMonth(referencia), { weekStartsOn: 0 });
    const fim = endOfMonth(referencia);
    const grade = [];
    let cursor = inicio;
    while (grade.length < 6) {
      const semana = Array.from({ length: 7 }, (_, i) => addDays(cursor, i));
      grade.push(semana);
      cursor = addDays(cursor, 7);
      if (cursor > fim) break;
    }
    return grade;
  }, [referencia]);

  return (
    <S.Calendario>
      <S.CabecalhoSemana>
        {DIAS_SEMANA.map((dia) => (
          <S.DiaSemana key={dia}>{dia}</S.DiaSemana>
        ))}
      </S.CabecalhoSemana>

      {semanas.map((semana) => (
        <S.Semana key={format(semana[0], "yyyy-MM-dd")}>
          {semana.map((dia) => {
            const chave = format(dia, "yyyy-MM-dd");
            const doDia = turmasPorDia[chave] || [];
            const foraDoMes = !isSameMonth(dia, referencia);

            return (
              <S.Dia
                key={chave}
                $foraDoMes={foraDoMes}
                onClick={foraDoMes ? undefined : () => onAgendar(chave)}
                title={foraDoMes ? undefined : `Agendar turma em ${format(dia, "dd/MM")}`}
              >
                <S.NumeroDia $hoje={chave === hoje} $foraDoMes={foraDoMes}>
                  {format(dia, "d")}
                </S.NumeroDia>

                {doDia.map((turma) => (
                  <S.Turma
                    key={turma.id}
                    type="button"
                    $local={turma.local}
                    $cancelada={turma.status === "cancelada"}
                    title={`${turma.condominio_nome} — ${turma.local_nome}, ${turma.total_inscritos} de ${turma.capacidade} inscritos`}
                    onClick={(evento) => {
                      evento.stopPropagation();
                      onAbrirTurma(turma);
                    }}
                  >
                    <S.TurmaHora $local={turma.local}>
                      {String(turma.hora_inicio).slice(0, 5)} –{" "}
                      {String(turma.hora_fim).slice(0, 5)}
                    </S.TurmaHora>
                    <S.TurmaNome $local={turma.local}>{turma.condominio_nome}</S.TurmaNome>
                    <S.TurmaContagem>
                      {turma.total_inscritos} / {turma.capacidade}
                      {turma.tem_espelho === false && (
                        <FaExclamationTriangle
                          size={9}
                          color="#b45309"
                          aria-label="Sem reserva na agenda"
                        />
                      )}
                    </S.TurmaContagem>
                  </S.Turma>
                ))}
              </S.Dia>
            );
          })}
        </S.Semana>
      ))}
    </S.Calendario>
  );
}
