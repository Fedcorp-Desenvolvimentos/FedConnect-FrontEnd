import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as S from "./AgendaReservaFormStyles";

const HORARIOS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

export default function AgendaReservaForm({
  initialData = {},
  onSave,
  onCancel,
}) {
  const [tema, setTema] = useState(initialData.tema || "");
  const [participantes, setParticipantes] = useState(
    initialData.participantes?.join(", ") || ""
  );
  const [data, setData] = useState(initialData.data || new Date());
  const [horario, setHorario] = useState(initialData.horario || "09:00");
  const [duracao, setDuracao] = useState(initialData.duracao || 60);
  const [erro, setErro] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!tema.trim()) return setErro("Informe o tema da reunião.");
    if (!participantes.trim())
      return setErro("Informe ao menos um participante.");
    if (!data) return setErro("Selecione a data.");
    if (!horario) return setErro("Selecione o horário.");
    if (!duracao || duracao < 15) return setErro("Duração mínima: 15 minutos.");

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
          <S.Select value={horario} onChange={(e) => setHorario(e.target.value)}>
            {HORARIOS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </S.Select>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Duração (min):</S.Label>
          <S.Input
            type="number"
            value={duracao}
            min={15}
            max={240}
            step={15}
            onChange={(e) => setDuracao(e.target.value)}
          />
        </S.FormGroup>
      </S.Row>

      {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

      <S.Actions>
        <S.SubmitButton type="submit">Salvar</S.SubmitButton>
        <S.CancelButton type="button" onClick={onCancel}>
          Cancelar
        </S.CancelButton>
      </S.Actions>
    </S.Form>
 );
}