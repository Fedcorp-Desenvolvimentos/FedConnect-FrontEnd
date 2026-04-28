import React, { useEffect, useMemo, useState } from "react";
import { 
  FaChartLine, 
  FaFileExcel, 
  FaFilter, 
  FaCalendarAlt, 
  FaSearch, 
  FaSpinner,
  FaBuilding,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { useSnackbar } from "notistack";
import * as S from "./ComercialStyles";
import { DashboardComercialHelp } from "./components/ComercialHelp";
import KanbanVisitas from "./components/KanbanVisitas";
import GraficoVisitas from "./components/GraficoVisitas";
import DetalheVisita from "./components/DetalheVisita";
import MobileAccordionVisitas from "./components/MobileAccordionVisitas";
import { AgendaComercialService } from "../../services/agenda_comercial";
import * as XLSX from "xlsx";
import { IoIosBusiness } from "react-icons/io";
import PageLayout from "../../components/PageLayout/PageLayout";

// Utils
function toBRDate(d) {
  try {
    if (!d) return "N/A";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return String(d);
  }
}

function getComercialName(v) {
  const r = v?.responsavel;
  if (!r) return "";
  return r.nome_completo || r.username || r.nome || "";
}

function normalizeDateYYYYMMDD(value) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime()))
    return value.toISOString().slice(0, 10);
  try {
    const dt = new Date(value);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString().slice(0, 10);
  } catch { }
  return String(value);
}

function parseISODate(yyyyMMdd) {
  if (!yyyyMMdd) return null;
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function getMonthBounds(date) {
  const base = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(
    base.getFullYear(),
    base.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function useIsMobile(maxWidth = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width:${maxWidth}px)`).matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [maxWidth]);
  return isMobile;
}

export default function Comercial() {
  const { enqueueSnackbar } = useSnackbar();
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [visitaDetalhe, setVisitaDetalhe] = useState(null);
  const [activeMonth, setActiveMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [filters, setFilters] = useState({
    empresa: "",
    comercial: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isMobile = useIsMobile(768);

  async function fetchVisitas(month) {
    try {
      setLoading(true);
      setErro("");
      const year = month.getFullYear();
      const monthNumber = month.getMonth() + 1;
      const response = await AgendaComercialService.getVisitas({
        ano: year,
        mes: monthNumber,
      });
      const results =
        (Array.isArray(response?.results) && response.results) ||
        (Array.isArray(response?.data?.results) && response.data.results) ||
        (Array.isArray(response) && response) ||
        [];
      setVisitas(results);
    } catch (e) {
      console.error("Erro ao carregar visitas:", e);
      setErro("Falha ao carregar as visitas. Tente novamente.");
      enqueueSnackbar("Erro ao carregar visitas", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVisitas(activeMonth);
  }, [activeMonth]);

  const comerciaisOptions = useMemo(() => {
    const set = new Set();
    visitas.forEach((v) => {
      const nome = getComercialName(v)?.trim();
      if (nome) set.add(nome);
    });
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [visitas]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(activeMonth);
  }, [activeMonth]);

  const { start: monthStart, end: monthEnd } = useMemo(
    () => getMonthBounds(activeMonth),
    [activeMonth]
  );

  const filteredVisitas = useMemo(() => {
    if (!Array.isArray(visitas)) return [];
    const empresaTerm = filters.empresa.trim().toLowerCase();
    const comercialSel = filters.comercial;

    return visitas.filter((v) => {
      const empresaOk = empresaTerm
        ? (v?.empresa || "").toLowerCase().includes(empresaTerm)
        : true;
      const comercialNome = getComercialName(v);
      const comercialOk =
        comercialSel === "all" ? true : comercialNome === comercialSel;

      const vISO = normalizeDateYYYYMMDD(v?.data);
      const vDate = parseISODate(vISO);
      if (!vDate || Number.isNaN(vDate.getTime())) return false;
      const inActiveMonth = vDate >= monthStart && vDate <= monthEnd;
      return empresaOk && comercialOk && inActiveMonth;
    });
  }, [visitas, filters, monthStart, monthEnd]);

  const totals = useMemo(() => {
    const groups = { agendadas: 0, realizadas: 0, canceladas: 0 };
    filteredVisitas.forEach((v) => {
      const status = String(v?.status || "").toLowerCase();
      if (status.includes("agend")) groups.agendadas++;
      else if (status.includes("realiz") || status.includes("conclu"))
        groups.realizadas++;
      else if (status.includes("cancel")) groups.canceladas++;
    });
    return groups;
  }, [filteredVisitas]);

  function exportarRelatorioExcel() {
    try {
      const base = Array.isArray(filteredVisitas) ? filteredVisitas : [];
      if (base.length === 0) {
        enqueueSnackbar("Não há dados para exportar", { variant: "warning" });
        return;
      }
      const dadosParaExportar = base.map((v) => ({
        Empresa: v?.empresa ?? "N/A",
        Data: toBRDate(v?.data),
        Status: v?.status ?? "N/A",
        Responsável: getComercialName(v) || "N/A",
        Observações: v?.observacoes ?? v?.descricao ?? "",
      }));
      const ws = XLSX.utils.json_to_sheet(dadosParaExportar);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Visitas");
      XLSX.writeFile(wb, `Relatorio_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
      enqueueSnackbar("Relatório exportado com sucesso!", { variant: "success" });
    } catch (e) {
      console.error("Erro ao exportar:", e);
      enqueueSnackbar("Erro ao exportar relatório", { variant: "error" });
    }
  }

  function handleCardClick(visitaParcial) {
    const vId = String(visitaParcial?.id ?? "");
    const completa = visitas.find((v) => String(v?.id) === vId) || visitaParcial;
    setVisitaDetalhe({ ...visitaParcial, ...completa });
  }

  function goPrevMonth() {
    setActiveMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function goNextMonth() {
    setActiveMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }
  function handleMonthInput(e) {
    const value = e.target.value;
    if (!value) return;
    const [y, m] = value.split("-").map(Number);
    if (y && m) setActiveMonth(new Date(y, m - 1, 1));
  }

  if (loading && visitas.length === 0) {
    return (
      <PageLayout
        title="Acompanhamento Comercial"
        subtitle="Gestão de visitas e acompanhamento comercial"
        icon={<IoIosBusiness />}
        helpContent={<DashboardComercialHelp />}
      >
        <S.LoadingContainer>
          <FaSpinner className="spinner" />
          <p>Carregando visitas...</p>
        </S.LoadingContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Acompanhamento Comercial"
      subtitle="Gestão de visitas e acompanhamento comercial"
      icon={<IoIosBusiness />}
      helpContent={<DashboardComercialHelp />}
    >
      <S.Container>
        {/* Filtros */}
        <S.FiltersBar>
          <S.FilterGroup>
            <S.FilterInput
              type="text"
              placeholder="Buscar por empresa..."
              value={filters.empresa}
              onChange={(e) => setFilters((f) => ({ ...f, empresa: e.target.value }))}
            />
            <S.FilterSelect
              value={filters.comercial}
              onChange={(e) => setFilters((f) => ({ ...f, comercial: e.target.value }))}
            >
              {comerciaisOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "Todos os comerciais" : opt}
                </option>
              ))}
            </S.FilterSelect>
          </S.FilterGroup>

          <S.MonthSelector>
            <S.MonthButton onClick={goPrevMonth}>
              <FaChevronLeft />
            </S.MonthButton>
            <S.MonthDisplay>
              <FaCalendarAlt />
              <span>{monthLabel}</span>
            </S.MonthDisplay>
            <S.MonthButton onClick={goNextMonth}>
              <FaChevronRight />
            </S.MonthButton>
            <S.MonthInput
              type="month"
              value={`${activeMonth.getFullYear()}-${String(activeMonth.getMonth() + 1).padStart(2, "0")}`}
              onChange={handleMonthInput}
            />
          </S.MonthSelector>

          <S.ClearButton onClick={() => setFilters({ empresa: "", comercial: "all" })}>
            Limpar
          </S.ClearButton>
        </S.FiltersBar>

        {/* Stats Cards */}
        <S.StatsGrid>
          <S.StatCard $status="agendadas">
            <S.StatIcon>📅</S.StatIcon>
            <S.StatInfo>
              <S.StatValue>{totals.agendadas}</S.StatValue>
              <S.StatLabel>Agendadas</S.StatLabel>
            </S.StatInfo>
          </S.StatCard>
          <S.StatCard $status="realizadas">
            <S.StatIcon>✅</S.StatIcon>
            <S.StatInfo>
              <S.StatValue>{totals.realizadas}</S.StatValue>
              <S.StatLabel>Realizadas</S.StatLabel>
            </S.StatInfo>
          </S.StatCard>
          <S.StatCard $status="canceladas">
            <S.StatIcon>❌</S.StatIcon>
            <S.StatInfo>
              <S.StatValue>{totals.canceladas}</S.StatValue>
              <S.StatLabel>Canceladas</S.StatLabel>
            </S.StatInfo>
          </S.StatCard>
        </S.StatsGrid>

        {/* Gráfico e Exportação */}
        <S.GraphSection>
          <S.GraphWrapper>
            <GraficoVisitas visitas={filteredVisitas} />
          </S.GraphWrapper>
          <S.ExportButton onClick={exportarRelatorioExcel} disabled={!filteredVisitas.length}>
            <FaFileExcel /> Exportar Relatório
          </S.ExportButton>
        </S.GraphSection>

        {/* Kanban ou Accordion */}
        <S.KanbanSection>
          {isMobile ? (
            <MobileAccordionVisitas visitas={filteredVisitas} onCardClick={handleCardClick} />
          ) : (
            <KanbanVisitas 
              visitas={filteredVisitas} 
              onCardClick={handleCardClick}
              onStatusChange={async (id, status) => {
                try {
                  await AgendaComercialService.updateVisitaStatus(id, status);
                  enqueueSnackbar("Status atualizado com sucesso!", { variant: "success" });
                  fetchVisitas(activeMonth);
                } catch (e) {
                  enqueueSnackbar("Erro ao atualizar status", { variant: "error" });
                }
              }}
            />
          )}
        </S.KanbanSection>

        {/* Modal Detalhes */}
        {visitaDetalhe && (
          <DetalheVisita
            visita={visitaDetalhe}
            onClose={() => setVisitaDetalhe(null)}
          />
        )}
      </S.Container>
    </PageLayout>
  );
}