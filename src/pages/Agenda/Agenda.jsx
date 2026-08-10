import { useEffect, useState, useMemo, useCallback, forwardRef } from "react";
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
import AgendaReservaForm from "../../components/Agenda/AgendaReservaForm/AgendaReservaForm";
import AgendaDetalhe from "../../components/Agenda/AgendaDetalhe/AgendaDetalhe";
import { AgendaService } from "../../services/agendaService";
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { CiCalendarDate } from "react-icons/ci";
import { useSnackbar } from "notistack";
import AgendaHelp from "./AgendaHelp";
import { useAuth } from "../../context/AuthContext";
import {
  HORARIOS,
  mapaDeOcupacao,
  horariosLivres,
  duracoesDisponiveis,
  conflitaComReserva,
  cabeNoExpediente,
  horarioFinal,
  horarioLiberacao,
} from "../../utils/agendaSlots";

function getFirstMondayOfMonth(date) {
  const firstDay = startOfMonth(date);
  const weekDay = getDay(firstDay);
  return weekDay === 1 ? firstDay : addDays(firstDay, (8 - weekDay) % 7);
}

const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

/** Extrai a mensagem de erro da API, seja em `detail` ou em erros de campo. */
function extrairMensagemApi(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (data.detail) return String(data.detail);
  const primeiro = Object.values(data)[0];
  if (Array.isArray(primeiro)) return String(primeiro[0]);
  return primeiro ? String(primeiro) : "";
}

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

  // Agrupa as reservas por dia e expande cada uma nos slots que ela ocupa,
  // para que uma reunião de 2h bloqueie 09:00 e 10:00, por exemplo.
  const ocupacaoPorDia = useMemo(() => {
    const porDia = new Map();
    reservas.forEach((r) => {
      const chave = format(r.data, "yyyy-MM-dd");
      if (!porDia.has(chave)) porDia.set(chave, []);
      porDia.get(chave).push(r);
    });

    const mapa = new Map();
    porDia.forEach((reservasDoDia, chave) => {
      mapa.set(chave, mapaDeOcupacao(reservasDoDia));
    });
    return mapa;
  }, [reservas]);

  const getReservasDoDia = useCallback(
    (dataDateObj) => {
      if (!dataDateObj) return [];
      const alvo = format(dataDateObj, "yyyy-MM-dd");
      return reservas.filter((r) => format(r.data, "yyyy-MM-dd") === alvo);
    },
    [reservas]
  );

  const getHorariosDisponiveis = useCallback(
    (dataDateObj) => horariosLivres(getReservasDoDia(dataDateObj)),
    [getReservasDoDia]
  );

  const getDuracoesDisponiveis = useCallback(
    (dataDateObj, horario) =>
      duracoesDisponiveis(horario, getReservasDoDia(dataDateObj)),
    [getReservasDoDia]
  );

  /** Devolve a reserva que conflita com o intervalo informado, se houver. */
  const encontrarConflito = (dataDateObj, horario, duracao) => {
    const candidata = { horario, duracao };
    return getReservasDoDia(dataDateObj).find((r) =>
      conflitaComReserva(r, candidata)
    );
  };

  const handleSaveReserva = async (novaReserva) => {
    try {
      const dataObj =
        novaReserva.data instanceof Date
          ? novaReserva.data
          : parseISO(novaReserva.data);

      if (!cabeNoExpediente(novaReserva)) {
        enqueueSnackbar(
          `A reunião terminaria às ${horarioFinal(novaReserva)}, fora do expediente da sala (09:00 às 19:00).`,
          { variant: "error", autoHideDuration: 4000 }
        );
        return;
      }

      const conflito = encontrarConflito(
        dataObj,
        novaReserva.horario,
        novaReserva.duracao
      );
      if (conflito) {
        enqueueSnackbar(
          `Conflito com a reserva "${conflito.tema}" (${conflito.horario} às ${horarioFinal(conflito)}). A sala só volta a ficar livre às ${horarioLiberacao(conflito)}.`,
          { variant: "error", autoHideDuration: 5000 }
        );
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
      const mensagemApi = extrairMensagemApi(error?.response?.data);
      if (status === 409) {
        enqueueSnackbar(mensagemApi || "Conflito: esse horário acabou de ser reservado.", {
          variant: "error",
          autoHideDuration: 4000
        });
        await refreshWeek();
      } else if (status === 400 && mensagemApi) {
        enqueueSnackbar(mensagemApi, { variant: "error", autoHideDuration: 4000 });
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
              const ocupacao = ocupacaoPorDia
                .get(format(dia, "yyyy-MM-dd"))
                ?.get(hora);
              const isLivre = !ocupacao;

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
                      title={`${ocupacao.reserva.tema} — ${
                        ocupacao.reserva.horario
                      } às ${horarioFinal(ocupacao.reserva)} — ver detalhes`}
                      onClick={() => setReservaSelecionada(ocupacao.reserva)}
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
                  horario: selectedSlot?.hora || HORARIOS[0],
                }}
                userRole={String(user?.nivel_acesso || "").toLowerCase()}
                getHorariosDisponiveis={getHorariosDisponiveis}
                getDuracoesDisponiveis={getDuracoesDisponiveis}
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