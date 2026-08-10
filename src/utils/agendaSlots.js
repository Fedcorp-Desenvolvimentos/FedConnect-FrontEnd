// Regras de ocupação da agenda da sala de reunião.
// A grade é horária (09:00 às 18:00), então a duração de uma reserva é
// convertida em quantos slots consecutivos ela ocupa.
//
// O slot do horário final também fica marcado como reservado: uma reunião
// das 10:00 às 12:00 bloqueia os cards 10:00, 11:00 e 12:00, e o próximo
// horário livre para iniciar uma reunião é 13:00. Uma nova reunião ainda
// pode TERMINAR às 10:00 (encostar no início de uma reserva existente),
// senão um intervalo de 1 hora entre duas reuniões ficaria inutilizável.

export const SLOT_MINUTOS = 60;

export const HORARIOS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export const DURACOES = [60, 120, 180, 240];

export const ABERTURA_MINUTOS = paraMinutos(HORARIOS[0]);
export const FECHAMENTO_MINUTOS =
  paraMinutos(HORARIOS[HORARIOS.length - 1]) + SLOT_MINUTOS;

export function paraMinutos(horario) {
  const [h, m] = String(horario || "").split(":");
  return Number(h) * 60 + Number(m || 0);
}

export function paraHorario(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function rotuloDuracao(minutos) {
  const horas = Number(minutos) / 60;
  if (!Number.isFinite(horas)) return `${minutos} min`;
  if (Number.isInteger(horas)) return `${horas} ${horas === 1 ? "hora" : "horas"}`;
  return `${minutos} min`;
}

/** Intervalo real [inicio, fim) da reunião, em minutos. */
export function intervaloDaReserva(reserva) {
  const inicio = paraMinutos(reserva?.horario);
  const duracao = Number(reserva?.duracao) || SLOT_MINUTOS;
  return { inicio, fim: inicio + duracao };
}

/**
 * Intervalo bloqueado na grade: o intervalo real mais o slot do horário
 * final. É o que a grade pinta e o que impede novas reservas de iniciar.
 */
export function intervaloBloqueado(reserva) {
  const { inicio, fim } = intervaloDaReserva(reserva);
  const bloqueioFim = fim % SLOT_MINUTOS === 0 ? fim + SLOT_MINUTOS : fim;
  return { inicio, fim: bloqueioFim };
}

/** Horário final ("12:00") da reunião. */
export function horarioFinal(reserva) {
  return paraHorario(intervaloDaReserva(reserva).fim);
}

/** Primeiro horário em que a sala volta a aceitar uma nova reunião. */
export function horarioLiberacao(reserva) {
  return paraHorario(intervaloBloqueado(reserva).fim);
}

/**
 * Todos os slots da grade marcados como reservados.
 * Uma reserva de 10:00 com 120 min devolve ["10:00", "11:00", "12:00"].
 */
export function slotsDaReserva(reserva) {
  const { inicio, fim } = intervaloBloqueado(reserva);
  return HORARIOS.filter((h) => {
    const slotInicio = paraMinutos(h);
    return slotInicio < fim && slotInicio + SLOT_MINUTOS > inicio;
  });
}

/**
 * A reserva `nova` colide com a reserva `existente`?
 * Bate no intervalo bloqueado da existente (inclui o slot final), mas a
 * nova pode terminar exatamente no início da existente.
 */
export function conflitaComReserva(existente, nova) {
  const bloqueado = intervaloBloqueado(existente);
  const intervaloNova = intervaloDaReserva(nova);
  return (
    intervaloNova.inicio < bloqueado.fim && bloqueado.inicio < intervaloNova.fim
  );
}

/** A reserva termina dentro do expediente da sala? */
export function cabeNoExpediente(reserva) {
  const { inicio, fim } = intervaloDaReserva(reserva);
  return inicio >= ABERTURA_MINUTOS && fim <= FECHAMENTO_MINUTOS;
}

/**
 * Mapa de ocupação de um dia: horário do slot -> { reserva, isInicio }.
 * Slots cobertos pela continuação de uma reserva longa também entram.
 */
export function mapaDeOcupacao(reservasDoDia = []) {
  const mapa = new Map();
  reservasDoDia.forEach((reserva) => {
    slotsDaReserva(reserva).forEach((horario, idx) => {
      if (!mapa.has(horario)) {
        mapa.set(horario, { reserva, isInicio: idx === 0 });
      }
    });
  });
  return mapa;
}

/** Horários que podem iniciar uma reserva (pelo menos 1 slot livre). */
export function horariosLivres(reservasDoDia = []) {
  const ocupados = mapaDeOcupacao(reservasDoDia);
  return HORARIOS.filter((h) => !ocupados.has(h));
}

/**
 * Durações possíveis para um início, limitadas pelos slots livres
 * consecutivos a partir dele e pelo fim do expediente.
 */
export function duracoesDisponiveis(horario, reservasDoDia = [], ignorarId = null) {
  if (!horario || !HORARIOS.includes(horario)) return [];

  const relevantes = reservasDoDia.filter(
    (r) => ignorarId == null || r?.id !== ignorarId
  );
  const ocupados = mapaDeOcupacao(relevantes);
  const inicioIdx = HORARIOS.indexOf(horario);

  let livresConsecutivos = 0;
  for (let i = inicioIdx; i < HORARIOS.length; i++) {
    if (ocupados.has(HORARIOS[i])) break;
    livresConsecutivos++;
  }

  const maximo = livresConsecutivos * SLOT_MINUTOS;
  return DURACOES.filter((d) => d <= maximo);
}
