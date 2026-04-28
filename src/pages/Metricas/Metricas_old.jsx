import * as S from "./MetricasStyles";
import { FaExternalLinkAlt, FaChartBar } from "react-icons/fa";
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { useAuth } from "../../context/AuthContext";
import MetricasHelp from "./MetricasHelp";

const metricas = [
  {
    key: "peaga",
    title: "Dashboard Peaga",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiZjM2NjBmMDgtZDNiOS00ZmMwLWFlZDUtYjE5NDdhOTUyMjU4IiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/Logo-Peaga.jpg",
    color: "#2463eb", //3b82f6
  },
  {
    key: "fedcorp",
    title: "Dashboard FedCorp Adm",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiYTc1ZGU2MjItNjNiNS00MTQ5LTk2YjgtYWQzOGYxM2QyYjAwIiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/LOGO.png",
    color: "#2463eb", // 10b981
  },
  {
    key: "condomed",
    title: "Dashboard Condomed",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiZjE5ODFiZDUtM2U2NS00NzI1LTkzZTktNmE4ZTgxOTAwZjI0IiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/logo-Condomed.png",
    color: "#2463eb", // 8b5cf6
  },
  // {
  //   key: "acompanhamento",
  //   title: "Acompanhamento Comercial",
  //   desc: "Acompanhe as métricas do comercial de forma única.",
  //   url: "/acompanhamento",
  //   logo: "/imagens/LOGO.png",
  //   color: "#f59e0b",
  //   internal: true,
  // },
];

const Metricas = () => {
  const { user, loading } = useAuth();
  const nivelAcesso = user?.nivel_acesso;

  // Filtra métricas baseado no nível de acesso
  const metricasPermitidas = metricas.filter(m => {
    if (nivelAcesso === "admin") return true;
    return true;
  });

  const subtitle = "Acompanhe as principais métricas e resultados do Grupo FedCorp";

  return (
    <PageLayout
      title="Métricas da FedCorp"
      subtitle={subtitle}
      icon={<FaChartBar />}
      loading={loading}
      empty={metricasPermitidas.length === 0}
      emptyMessage="Nenhuma métrica disponível para seu nível de acesso"
      helpContent={<MetricasHelp/>}
    >
      <S.Container>
        <S.CardsGrid>
          {metricasPermitidas.map((metrica) => (
            <S.Card key={metrica.key} $color={metrica.color}>
              {/* Logo em destaque - sem ícone */}
              <S.LogoWrapper>
                <S.LogoImg 
                  src={metrica.logo} 
                  alt={metrica.title}
                  loading="lazy"
                />
              </S.LogoWrapper>
              <S.Title>{metrica.title}</S.Title>
              <S.Description>{metrica.desc}</S.Description>
              {metrica.internal ? (
                <S.InternalButton to={metrica.url} $color={metrica.color}>
                  <FaChartBar size={14} />
                  <span>Acessar</span>
                </S.InternalButton>
              ) : (
                <S.ExternalButton 
                  href={metrica.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  $color={metrica.color}
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Acessar Dashboard</span>
                </S.ExternalButton>
              )}
            </S.Card>
          ))}
        </S.CardsGrid>
      </S.Container>
    </PageLayout>
  );
};

export default Metricas;