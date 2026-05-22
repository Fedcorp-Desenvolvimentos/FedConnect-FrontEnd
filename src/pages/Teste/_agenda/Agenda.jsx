// src/pages/Teste/_agenda/Agenda.jsx

import { useEffect, useState, forwardRef } from "react";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  format,
  addDays,
  startOfWeek,
  startOfMonth,
  getDay,
  parseISO,
  startOfDay,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as S from "./AgendaStyles";
import AgendaReservaForm from "./AgendaReservaForm/AgendaReservaForm";
import AgendaDetalhe from "./AgendaDetalhe/AgendaDetalhe";
import { useAuth } from "../../../context/AuthContext";
import { AgendaService } from "../../../services/agendaService";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { CiCalendarDate } from "react-icons/ci";
import { useSnackbar } from "notistack";
import AgendaHelp from "./AgendaHelp";

function getFirstMondayOfMonth(date) {
  const firstDay = startOfMonth(date);
  const weekDay = getDay(firstDay);
  return weekDay === 1 ? firstDay : addDays(firstDay, (8 - weekDay) % 7);
}

const HORARIOS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

const MonthButton = forwardRef(function MonthButton({ value, onClick }, ref) {
  return (
    <S.CalendarButton ref={ref} title={value || "Escolher mês"} onClick={onClick}>
      <FaCalendarAlt size={20} />
    </S.CalendarButton>
  );
});

export default function Agenda() {
  const { enqueueSnackbar } = useSnackbar();
  const [startDate, setStartDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  const { user } = useAuth();

  const refreshWeek = async () => {
    const dataInicio = format(startDate, "yyyy-MM-dd");
    const dataFim = format(addDays(startDate, 4), "yyyy-MM-dd");
    await fetchReservas(dataInicio, dataFim);
  };

  const fetchReservas = async (dataInicio, dataFim) => {
    try {
      const response = await AgendaService.getReservas(dataInicio, dataFim);
      let data;
      if (response && response.results) data = response.results;
      else if (Array.isArray(response)) data = response;
      else data = [];

      const formattedReservas = data.map((reserva) => ({
        ...reserva,
        data: parseISO(reserva.data),
      }));
      setReservas(formattedReservas);
    } catch {
      setReservas([]);
    }
  };

  useEffect(() => {
    const dataInicio = format(startDate, "yyyy-MM-dd");
    const dataFim = format(addDays(startDate, 4), "yyyy-MM-dd");
    fetchReservas(dataInicio, dataFim);
  }, [startDate]);

  const handleWeekChange = (inc) => setStartDate(addDays(startDate, inc * 7));

  const handleNewReserva = (dia, hora) => {
    setSelectedSlot({ dia, hora });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  const isSlotDisponivel = (dataDateObj, horario) => {
    const alvo = format(dataDateObj, "yyyy-MM-dd");
    return !reservas.some(
      (r) => format(r.data, "yyyy-MM-dd") === alvo && r.horario === horario
    );
  };

  const handleSaveReserva = async (novaReserva) => {
    try {
      const dataObj =
        novaReserva.data instanceof Date
          ? novaReserva.data
          : parseISO(novaReserva.data);

      if (!isSlotDisponivel(dataObj, novaReserva.horario)) {
        enqueueSnackbar("Já existe uma reunião marcada para este horário.", { 
          variant: "error",
          autoHideDuration: 3000
        });
        return;
      }

      const payload = {
        ...novaReserva,
        data: format(dataObj, "yyyy-MM-dd"),
        participantes: novaReserva.participantes?.join(", "),
        criado_por: user.id,
      };

      await AgendaService.createReserva(payload);
      closeModal();
      await refreshWeek();
      enqueueSnackbar("Reserva criada com sucesso!", { 
        variant: "success",
        autoHideDuration: 3000
      });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        enqueueSnackbar("Conflito: esse horário acabou de ser reservado.", { 
          variant: "error",
          autoHideDuration: 4000
        });
      } else {
        enqueueSnackbar("Falha ao criar a reserva. Tente novamente.", { 
          variant: "error",
          autoHideDuration: 4000
        });
      }
    }
  };

  const handleDeleteReserva = async (reservaParaDeletar) => {
    try {
      await AgendaService.deleteReserva(reservaParaDeletar.id);
      setReservaSelecionada(null);
      await refreshWeek();
      enqueueSnackbar("Reserva excluída com sucesso!", { 
        variant: "success",
        autoHideDuration: 3000
      });
    } catch (error) {
      console.error("Erro ao excluir reserva:", error);
      enqueueSnackbar("Erro ao excluir reserva.", { 
        variant: "error",
        autoHideDuration: 4000
      });
    }
  };

  const renderGrid = () => (
    <S.GridTable>
      <thead>
        <tr>
          <S.GridHeader>Horário</S.GridHeader>
          {diasSemana.map((_, idx) => {
            const dia = addDays(startDate, idx);
            return (
              <S.GridHeader key={idx}>
                <S.DiaSemana>{format(dia, "EEE", { locale: ptBR })}</S.DiaSemana>
                <S.DataDia>{format(dia, "dd/MM")}</S.DataDia>
              </S.GridHeader>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {HORARIOS.map((hora) => (
          <tr key={hora}>
            <S.HorarioCell>{hora}</S.HorarioCell>
            {diasSemana.map((_, dIdx) => {
              const dia = addDays(startDate, dIdx);
              const reservasSlot = reservas.filter(
                (r) =>
                  format(r.data, "yyyy-MM-dd") === format(dia, "yyyy-MM-dd") &&
                  r.horario === hora
              );
              const isLivre = reservasSlot.length === 0;

              return (
                <S.GridCell key={dIdx} $isLivre={isLivre}>
                  {isLivre && dia >= startOfDay(new Date()) ? (
                    <S.SlotButton
                      title="Reservar"
                      onClick={() => handleNewReserva(dia, hora)}
                    >
                      <FaPlus size={14} />
                    </S.SlotButton>
                  ) : isLivre ? null : (
                    <S.ReservedPill
                      title="Ver detalhes"
                      onClick={() => setReservaSelecionada(reservasSlot[0])}
                    >
                      Reservado
                    </S.ReservedPill>
                  )}
                </S.GridCell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </S.GridTable>
  );

  return (
    <PageLayout
      title="Agenda"
      subtitle="Gerencie as reservas da sala de reunião de forma fácil e rápida"
      icon={<CiCalendarDate />}
      helpContent={<AgendaHelp/>}
    >
      <S.Container>
        <S.Toolbar>
          <S.NavButton onClick={() => handleWeekChange(-1)}>
            <FaChevronLeft size={16} />
          </S.NavButton>
          <S.WeekRange>
            Semana de {format(startDate, "dd/MM/yyyy")} a{" "}
            {format(addDays(startDate, 4), "dd/MM/yyyy")}
          </S.WeekRange>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(getFirstMondayOfMonth(date))}
            dateFormat="MMMM/yyyy"
            showMonthYearPicker
            locale={ptBR}
            customInput={<MonthButton />}
          />
          <S.NavButton onClick={() => handleWeekChange(1)}>
            <FaChevronRight size={16} />
          </S.NavButton>
          <S.NewReservaButton onClick={() => handleNewReserva(null, null)}>
            <FaPlus size={14} /> Nova Reserva
          </S.NewReservaButton>
        </S.Toolbar>

        <S.GridContainer>{renderGrid()}</S.GridContainer>

        {showModal && (
          <S.ModalOverlay onClick={closeModal}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalClose onClick={closeModal}>×</S.ModalClose>
              <S.ModalTitle>Nova Reserva</S.ModalTitle>
              <AgendaReservaForm
                initialData={{
                  data: selectedSlot?.dia || startDate,
                  horario: selectedSlot?.hora || "09:00",
                }}
                userRole={String(user?.nivel_acesso || "").toLowerCase()}
                onSave={handleSaveReserva}
                onCancel={closeModal}
              />
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {reservaSelecionada && (
          <AgendaDetalhe
            reserva={reservaSelecionada}
            onClose={() => setReservaSelecionada(null)}
            onDelete={handleDeleteReserva}
          />
        )}
      </S.Container>
    </PageLayout>
  );
}