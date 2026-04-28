import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  FiFileText, 
  FiUsers, 
  FiClock, 
  FiCheckCircle, 
  FiAlertCircle,
  FiDownload,
  FiUpload,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiDollarSign,
  FiUserCheck,
  FiUserX,
  FiBriefcase,
  FiHome
} from "react-icons/fi";
import { 
  FaSpinner, 
  FaFileInvoiceDollar, 
  FaUserGraduate,
  FaHeartbeat,
  FaBirthdayCake
} from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import * as S from "./RHStyles";
import PageLayout from "../../components/PageLayout/PageLayout";

const RH = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    holeritesPendentes: 0,
    feriasPendentes: 0,
    atestadosMes: 0,
    admissoesMes: 0,
    desligamentosMes: 0
  });
  const [solicitacoesRecentes, setSolicitacoesRecentes] = useState([]);
  const [feriados, setFeriados] = useState([]);

  const isAdmin = user?.nivel_acesso === "admin";
  const isRH = user?.nivel_acesso === "rh" || isAdmin;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Simulando dados - depois conectar com API real
      setStats({
        totalFuncionarios: 147,
        holeritesPendentes: 12,
        feriasPendentes: 8,
        atestadosMes: 5,
        admissoesMes: 3,
        desligamentosMes: 2
      });

      setSolicitacoesRecentes([
        {
          id: 1,
          tipo: "HOLERITE",
          titulo: "Solicitação de Holerite - Março/2024",
          solicitante: "João Silva",
          setor: "Operacional",
          data: "2024-03-15",
          status: "PENDENTE",
          urgencia: "NORMAL"
        },
        {
          id: 2,
          tipo: "FERIAS",
          titulo: "Solicitação de Férias - Período de 15 dias",
          solicitante: "Maria Santos",
          setor: "Financeiro",
          data: "2024-03-14",
          status: "EM_ANDAMENTO",
          urgencia: "NORMAL"
        },
        {
          id: 3,
          tipo: "ATESTADO",
          titulo: "Atestado Médico - 3 dias",
          solicitante: "Carlos Oliveira",
          setor: "Comercial",
          data: "2024-03-13",
          status: "CONCLUIDO",
          urgencia: "URGENTE"
        },
        {
          id: 4,
          tipo: "DECLARACAO",
          titulo: "Declaração de Imposto de Renda",
          solicitante: "Ana Costa",
          setor: "TI",
          data: "2024-03-12",
          status: "PENDENTE",
          urgencia: "NORMAL"
        }
      ]);

      setFeriados([
        { data: "2024-04-21", nome: "Tiradentes", tipo: "FERIADO_NACIONAL" },
        { data: "2024-05-01", nome: "Dia do Trabalhador", tipo: "FERIADO_NACIONAL" },
        { data: "2024-05-30", nome: "Corpus Christi", tipo: "FERIADO_NACIONAL" }
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Funcionários",
      value: stats.totalFuncionarios,
      icon: <FiUsers />,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      link: "/rh/funcionarios"
    },
    {
      title: "Holerites Pendentes",
      value: stats.holeritesPendentes,
      icon: <GiHealthNormal />,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      link: "/rh/holerites"
    },
    {
      title: "Férias Pendentes",
      value: stats.feriasPendentes,
      icon: <FaBirthdayCake />,
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      link: "/rh/ferias"
    },
    {
      title: "Atestados (mês)",
      value: stats.atestadosMes,
      icon: <FaHeartbeat />,
      color: "#ef4444",
      bgColor: "#fef2f2",
      link: "/rh/atestados"
    }
  ];

  const getStatusBadge = (status) => {
    const config = {
      PENDENTE: { label: "Pendente", color: "#f59e0b", bg: "#fffbeb" },
      EM_ANDAMENTO: { label: "Em andamento", color: "#8b5cf6", bg: "#f5f3ff" },
      CONCLUIDO: { label: "Concluído", color: "#10b981", bg: "#ecfdf5" }
    };
    return config[status] || config.PENDENTE;
  };

  const getTipoIcon = (tipo) => {
    const icons = {
      HOLERITE: <GiHealthNormal />,
      FERIAS: <FaBirthdayCake />,
      ATESTADO: <FaHeartbeat />,
      DECLARACAO: <FiFileText />,
      ADMISSAO: <FiUserCheck />,
      DESLIGAMENTO: <FiUserX />
    };
    return icons[tipo] || <FiFileText />;
  };

  const getUrgenciaBadge = (urgencia) => {
    const config = {
      URGENTE: { label: "Urgente", color: "#dc2626", bg: "#fee2e2" },
      ALTA: { label: "Alta", color: "#f97316", bg: "#fff7ed" },
      NORMAL: { label: "Normal", color: "#3b82f6", bg: "#eff6ff" },
      BAIXA: { label: "Baixa", color: "#10b981", bg: "#ecfdf5" }
    };
    return config[urgencia] || config.NORMAL;
  };

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const quickActions = [
    { label: "Novo Holerite", icon: <GiHealthNormal />, path: "/rh/holerites/novo", color: "#3b82f6" },
    { label: "Solicitar Férias", icon: <FaBirthdayCake />, path: "/rh/ferias/solicitar", color: "#8b5cf6" },
    { label: "Registrar Atestado", icon: <FaHeartbeat />, path: "/rh/atestados/novo", color: "#ef4444" },
    { label: "Nova Admissão", icon: <FiUserCheck />, path: "/rh/admissoes/novo", color: "#10b981" },
    { label: "Cadastror Funcionário", icon: <FiUsers />, path: "/rh/funcionarios/novo", color: "#f59e0b" },
    { label: "Declarações", icon: <FiFileText />, path: "/rh/declaracoes", color: "#64748b" }
  ];

  return (
    <PageLayout
      title="Recursos Humanos"
      subtitle="Gestão de recursos humanos, documentos e solicitações"
      icon={<FiUsers />}
    >
      <S.Container>
        {/* Quick Actions */}
        <S.QuickActionsSection>
          <S.SectionTitle>
            <FiPlus /> Ações Rápidas
          </S.SectionTitle>
          <S.QuickActionsGrid>
            {quickActions.map((action, index) => (
              <S.QuickActionCard 
                key={index} 
                $color={action.color}
                onClick={() => navigate(action.path)}
              >
                <S.QuickActionIcon $color={action.color}>
                  {action.icon}
                </S.QuickActionIcon>
                <S.QuickActionLabel>{action.label}</S.QuickActionLabel>
              </S.QuickActionCard>
            ))}
          </S.QuickActionsGrid>
        </S.QuickActionsSection>

        {/* Stats Cards */}
        <S.StatsGrid>
          {statsCards.map((card, index) => (
            <S.StatCard 
              key={index} 
              $bgColor={card.bgColor}
              onClick={() => card.link && navigate(card.link)}
            >
              <S.StatIcon $color={card.color}>
                {card.icon}
              </S.StatIcon>
              <S.StatInfo>
                <S.StatValue>{card.value}</S.StatValue>
                <S.StatTitle>{card.title}</S.StatTitle>
              </S.StatInfo>
            </S.StatCard>
          ))}
        </S.StatsGrid>

        {/* Segundo grupo de stats */}
        <S.StatsGridSmall>
          <S.StatCardSmall>
            <S.StatIconSmall $color="#10b981">
              <FiUserCheck />
            </S.StatIconSmall>
            <S.StatSmallInfo>
              <S.StatSmallValue>{stats.admissoesMes}</S.StatSmallValue>
              <S.StatSmallTitle>Admissões (mês)</S.StatSmallTitle>
            </S.StatSmallInfo>
          </S.StatCardSmall>
          <S.StatCardSmall>
            <S.StatIconSmall $color="#ef4444">
              <FiUserX />
            </S.StatIconSmall>
            <S.StatSmallInfo>
              <S.StatSmallValue>{stats.desligamentosMes}</S.StatSmallValue>
              <S.StatSmallTitle>Desligamentos (mês)</S.StatSmallTitle>
            </S.StatSmallInfo>
          </S.StatCardSmall>
          <S.StatCardSmall>
            <S.StatIconSmall $color="#f59e0b">
              <FiCalendar />
            </S.StatIconSmall>
            <S.StatSmallInfo>
              <S.StatSmallValue>{stats.feriasPendentes}</S.StatSmallValue>
              <S.StatSmallTitle>Férias Agendadas</S.StatSmallTitle>
            </S.StatSmallInfo>
          </S.StatCardSmall>
        </S.StatsGridSmall>

        {/* Solicitações Recentes */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>
              <FiClock /> Solicitações Recentes
            </S.SectionTitle>
            <S.SectionLink onClick={() => navigate("/rh/solicitacoes")}>
              Ver todas
            </S.SectionLink>
          </S.SectionHeader>

          {loading ? (
            <S.LoadingContainer>
              <FaSpinner className="spinner" />
              Carregando...
            </S.LoadingContainer>
          ) : solicitacoesRecentes.length === 0 ? (
            <S.EmptyState>
              <p>Nenhuma solicitação recente.</p>
            </S.EmptyState>
          ) : (
            <S.RequestsList>
              {solicitacoesRecentes.map((solicitacao) => {
                const status = getStatusBadge(solicitacao.status);
                const urgencia = getUrgenciaBadge(solicitacao.urgencia);
                return (
                  <S.RequestCard key={solicitacao.id} onClick={() => navigate(`/rh/solicitacao/${solicitacao.id}`)}>
                    <S.RequestHeader>
                      <S.RequestTypeIcon $color={urgencia.color}>
                        {getTipoIcon(solicitacao.tipo)}
                      </S.RequestTypeIcon>
                      <S.RequestInfo>
                        <S.RequestTitle>{solicitacao.titulo}</S.RequestTitle>
                        <S.RequestMeta>
                          <span>{solicitacao.solicitante}</span>
                          <span>•</span>
                          <span>{solicitacao.setor}</span>
                          <span>•</span>
                          <span>{formatarData(solicitacao.data)}</span>
                        </S.RequestMeta>
                      </S.RequestInfo>
                      <S.RequestBadges>
                        <S.TaskBadge $color={status.color} $bgColor={status.bg}>
                          {status.label}
                        </S.TaskBadge>
                        <S.UrgenciaBadge $color={urgencia.color} $bgColor={urgencia.bg}>
                          {urgencia.label}
                        </S.UrgenciaBadge>
                      </S.RequestBadges>
                    </S.RequestHeader>
                  </S.RequestCard>
                );
              })}
            </S.RequestsList>
          )}
        </S.Section>

        {/* Feriados */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>
              <FiCalendar /> Próximos Feriados
            </S.SectionTitle>
            <S.SectionLink onClick={() => navigate("/rh/feriados")}>
              Ver calendário
            </S.SectionLink>
          </S.SectionHeader>

          <S.HolidaysGrid>
            {feriados.map((feriado, index) => (
              <S.HolidayCard key={index}>
                <S.HolidayDate>{formatarData(feriado.data)}</S.HolidayDate>
                <S.HolidayName>{feriado.nome}</S.HolidayName>
                <S.HolidayType>{feriado.tipo === "FERIADO_NACIONAL" ? "🇧🇷 Nacional" : "📅 Municipal"}</S.HolidayType>
              </S.HolidayCard>
            ))}
          </S.HolidaysGrid>
        </S.Section>

        {/* Documentos Rápidos */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>
              <FiFileText /> Documentos Úteis
            </S.SectionTitle>
            <S.SectionLink onClick={() => navigate("/rh/documentos")}>
              Biblioteca
            </S.SectionLink>
          </S.SectionHeader>

          <S.DocsGrid>
            <S.DocCard>
              <S.DocIcon><GiHealthNormal /></S.DocIcon>
              <S.DocInfo>
                <S.DocTitle>Modelo Holerite</S.DocTitle>
                <S.DocDesc>Template para geração de contracheques</S.DocDesc>
              </S.DocInfo>
              <S.DocAction><FiDownload /></S.DocAction>
            </S.DocCard>
            <S.DocCard>
              <S.DocIcon><FiFileText /></S.DocIcon>
              <S.DocInfo>
                <S.DocTitle>Declaração de IR</S.DocTitle>
                <S.DocDesc>Modelo para declaração de imposto</S.DocDesc>
              </S.DocInfo>
              <S.DocAction><FiDownload /></S.DocAction>
            </S.DocCard>
            <S.DocCard>
              <S.DocIcon><FiUserCheck /></S.DocIcon>
              <S.DocInfo>
                <S.DocTitle>Termo de Admissão</S.DocTitle>
                <S.DocDesc>Documento padrão para novos funcionários</S.DocDesc>
              </S.DocInfo>
              <S.DocAction><FiDownload /></S.DocAction>
            </S.DocCard>
          </S.DocsGrid>
        </S.Section>
      </S.Container>
    </PageLayout>
  );
};

export default RH;