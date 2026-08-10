import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as S from "./AgendaReservaFormStyles";
import {
  HORARIOS,
  DURACOES,
  rotuloDuracao,
  horarioFinal,
  slotsDaReserva,
} from "../../../utils/agendaSlots";

export default function AgendaReservaForm({
  initialData = {},
  getHorariosDisponiveis,
  getDuracoesDisponiveis,
  onSave,
  onCancel,
}) {
  const [tema, setTema] = useState(initialData.tema || "");
  const [participantes, setParticipantes] = useState(
    initialData.participantes?.join(", ") || ""
  );
  const [data, setData] = useState(initialData.data || new Date());
  const [horario, setHorario] = useState(initialData.horario || HORARIOS[0]);
  const [duracao, setDuracao] = useState(Number(initialData.duracao) || 60);
  const [erro, setErro] = useState("");

  // Só os horários que ainda não estão ocupados no dia escolhido.
  const horariosOpcoes = useMemo(
    () => (getHorariosDisponiveis ? getHorariosDisponiveis(data) : HORARIOS),
    [getHorariosDisponiveis, data]
  );

  // A duração é limitada pelos slots livres consecutivos a partir do início.
  const duracoesOpcoes = useMemo(
    () =>
      getDuracoesDisponiveis
        ? getDuracoesDisponiveis(data, horario)
        : DURACOES,
    [getDuracoesDisponiveis, data, horario]
  );

  // Se o dia mudou e o horário atual não está mais livre, cai no primeiro livre.
  useEffect(() => {
    if (horariosOpcoes.length && !horariosOpcoes.includes(horario)) {
      setHorario(horariosOpcoes[0]);
    }
  }, [horariosOpcoes, horario]);

  // Mesma ideia para a duração: nunca deixa selecionada uma que não cabe.
  useEffect(() => {
    if (duracoesOpcoes.length && !duracoesOpcoes.includes(Number(duracao))) {
      setDuracao(duracoesOpcoes[duracoesOpcoes.length - 1]);
    }
  }, [duracoesOpcoes, duracao]);

  const diaLotado = horariosOpcoes.length === 0;
  const reservaPrevia = { horario, duracao: Number(duracao || 0) };
  const terminaEm = horarioFinal(reservaPrevia);
  const slotsMarcados = slotsDaReserva(reservaPrevia);

  function handleSubmit(e) {
    e.preventDefault();
    if (!tema.trim()) return setErro("Informe o tema da reunião.");
    if (!participantes.trim())
      return setErro("Informe ao menos um participante.");
    if (!data) return setErro("Selecione a data.");
    if (!horario) return setErro("Selecione o horário.");
    if (!duracao) return setErro("Selecione a duração.");
    if (duracoesOpcoes.length && !duracoesOpcoes.includes(Number(duracao)))
      return setErro(
        "A duração escolhida invade um horário já reservado. Reduza a duração."
      );

    setErro("");
    onSave({
      tema,
      participantes: participantes
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      data,
      horario,
      duracao: Number(duracao),
    });
  }

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.FormGroup>
        <S.Label>Tema da reunião:</S.Label>
        <S.Input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          maxLength={60}
          placeholder="Ex: Reunião de alinhamento"
        />
      </S.FormGroup>

      <S.FormGroup>
        <S.Label>
          Participantes:
          <S.Hint>(Separe por vírgula)</S.Hint>
        </S.Label>
        <S.Input
          type="text"
          value={participantes}
          onChange={(e) => setParticipantes(e.target.value)}
          placeholder="Ex: Ana, João, Maria"
        />
      </S.FormGroup>

      <S.Row>
        <S.FormGroup>
          <S.Label>Data:</S.Label>
          <DatePicker
            selected={data}
            onChange={(date) => setData(date)}
            dateFormat="dd/MM/yyyy"
            className="custom-datepicker"
            minDate={new Date()}
            placeholderText="Selecione a data"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Horário:</S.Label>
          <S.Select
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            disabled={diaLotado}
          >
            {horariosOpcoes.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </S.Select>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Duração:</S.Label>
          <S.Select
            value={duracao}
            onChange={(e) => setDuracao(Number(e.target.value))}
            disabled={diaLotado || duracoesOpcoes.length === 0}
          >
            {duracoesOpcoes.map((d) => (
              <option key={d} value={d}>{rotuloDuracao(d)}</option>
            ))}
          </S.Select>
        </S.FormGroup>
      </S.Row>

      {!diaLotado && (
        <S.Hint style={{ marginLeft: 0 }}>
          Reunião de {horario} às {terminaEm}. Ficará marcado como reservado na
          agenda: <strong>{slotsMarcados.join(", ")}</strong>.
        </S.Hint>
      )}

      {diaLotado && (
        <S.ErrorMessage>
          Todos os horários deste dia já estão reservados. Escolha outra data.
        </S.ErrorMessage>
      )}

      {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

      <S.Actions>
        <S.SubmitButton type="submit" disabled={diaLotado}>
          Salvar
        </S.SubmitButton>
        <S.CancelButton type="button" onClick={onCancel}>
          Cancelar
        </S.CancelButton>
      </S.Actions>
    </S.Form>
 );
}
