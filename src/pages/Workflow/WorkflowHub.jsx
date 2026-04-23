import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiPlus, 
  FiList,
  FiUsers,
  FiTrendingUp,
  FiActivity
} from "react-icons/fi";
import { FaSpinner, FaTasks } from "react-icons/fa";
import * as S from "./WorkflowHubStyles";
import PageTemplate from "../../components/PageTemplate/PageTemplate";
import { workflowService } from "../../services/workflowService";

const WorkflowHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    minhasTarefas: 0,
    pendentes: 0,
    andamento: 0,
    concluidas: 0,
    tarefasPorSetor: []
  });
  const [minhasTarefas, setMinhasTarefas] = useState([]);
  const [tarefasRecentes, setTarefasRecentes] = useState([]);

  // Nível de acesso do usuário
  const isAdmin = user?.nivel_acesso === "admin";
  const nivelAcesso = user?.nivel_acesso;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar estatísticas
      const statsData = await workflowService.getStats();
      setStats(statsData);

      // Carregar minhas tarefas
      const minhasTarefasData = await workflowService.getMinhasTarefas({ limit: 5 });
      setMinhasTarefas(minhasTarefasData);

      // Carregar tarefas recentes (se for admin)
      if (isAdmin) {
        const recentesData = await workflowService.getTarefasRecentes({ limit: 5 });
        setTarefasRecentes(recentesData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Minhas Tarefas",
      value: stats.minhasTarefas,
      icon: <FiCheckCircle />,
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      title: "Pendentes",
      value: stats.pendentes,
      icon: <FiAlertCircle />,
      color: "#f59e0b",
      bgColor: "#fffbeb"
    },
    {
      title: "Em Andamento",
      value: stats.andamento,
      icon: <FiClock />,
      color: "#8b5cf6",
      bgColor: "#f5f3ff"
    },
    {
      title: "Concluídas",
      value: stats.concluidas,
      icon: <FiActivity />,
      color: "#10b981",
      bgColor: "#ecfdf5"
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

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <PageTemplate
      title="Workflow Hub"
      subtitle="Gerencie tarefas e solicitações entre setores"
      icon={<FaTasks />}
    >
      <S.Container>
        {/* Botão Nova Tarefa */}
        <S.NewTaskButton onClick={() => navigate("/workflow/nova")}>
          <FiPlus /> Nova Solicitação
        </S.NewTaskButton>

        {/* Cards de Estatísticas */}
        <S.StatsGrid>
          {statsCards.map((card, index) => (
            <S.StatCard key={index} $color={card.color} $bgColor={card.bgColor}>
              <S.StatIcon>{card.icon}</S.StatIcon>
              <S.StatInfo>
                <S.StatValue>{card.value}</S.StatValue>
                <S.StatTitle>{card.title}</S.StatTitle>
              </S.StatInfo>
            </S.StatCard>
          ))}
        </S.StatsGrid>

        {/* Minhas Tarefas */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>
              <FiList /> Minhas Tarefas
            </S.SectionTitle>
            <S.SectionLink onClick={() => navigate("/workflow/tarefas")}>
              Ver todas
            </S.SectionLink>
          </S.SectionHeader>

          {loading ? (
            <S.LoadingContainer>
              <FaSpinner className="spinner" />
              Carregando...
            </S.LoadingContainer>
          ) : minhasTarefas.length === 0 ? (
            <S.EmptyState>
              <p>Nenhuma tarefa atribuída a você.</p>
            </S.EmptyState>
          ) : (
            <S.TasksList>
              {minhasTarefas.map((tarefa) => {
                const status = getStatusBadge(tarefa.status);
                return (
                  <S.TaskCard key={tarefa.id} onClick={() => navigate(`/workflow/tarefa/${tarefa.id}`)}>
                    <S.TaskHeader>
                      <S.TaskTitle>{tarefa.titulo}</S.TaskTitle>
                      <S.TaskBadge $color={status.color} $bgColor={status.bg}>
                        {status.label}
                      </S.TaskBadge>
                    </S.TaskHeader>
                    <S.TaskDescription>{tarefa.descricao}</S.TaskDescription>
                    <S.TaskFooter>
                      <S.TaskMeta>
                        <FiUsers /> {tarefa.setor_origem} → {tarefa.setor_destino || "Não definido"}
                      </S.TaskMeta>
                      <S.TaskDate>{formatarData(tarefa.data_criacao)}</S.TaskDate>
                    </S.TaskFooter>
                  </S.TaskCard>
                );
              })}
            </S.TasksList>
          )}
        </S.Section>

        {/* Tarefas Recentes (Admin) */}
        {isAdmin && (
          <S.Section>
            <S.SectionHeader>
              <S.SectionTitle>
                <FiTrendingUp /> Atividade Recente
              </S.SectionTitle>
              <S.SectionLink onClick={() => navigate("/workflow/tarefas")}>
                Ver todas
              </S.SectionLink>
            </S.SectionHeader>

            {loading ? (
              <S.LoadingContainer>
                <FaSpinner className="spinner" />
                Carregando...
              </S.LoadingContainer>
            ) : tarefasRecentes.length === 0 ? (
              <S.EmptyState>
                <p>Nenhuma tarefa recente.</p>
              </S.EmptyState>
            ) : (
              <S.TasksList>
                {tarefasRecentes.map((tarefa) => {
                  const status = getStatusBadge(tarefa.status);
                  return (
                    <S.TaskCard key={tarefa.id} onClick={() => navigate(`/workflow/tarefa/${tarefa.id}`)}>
                      <S.TaskHeader>
                        <S.TaskTitle>{tarefa.titulo}</S.TaskTitle>
                        <S.TaskBadge $color={status.color} $bgColor={status.bg}>
                          {status.label}
                        </S.TaskBadge>
                      </S.TaskHeader>
                      <S.TaskDescription>{tarefa.descricao}</S.TaskDescription>
                      <S.TaskFooter>
                        <S.TaskMeta>
                          <FiUsers /> {tarefa.solicitante_nome || tarefa.solicitante_email}
                        </S.TaskMeta>
                        <S.TaskDate>{formatarData(tarefa.data_criacao)}</S.TaskDate>
                      </S.TaskFooter>
                    </S.TaskCard>
                  );
                })}
              </S.TasksList>
            )}
          </S.Section>
        )}
      </S.Container>
    </PageTemplate>
  );
};

export default WorkflowHub;