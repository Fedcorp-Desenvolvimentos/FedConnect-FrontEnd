import { useAuth } from "../../context/AuthContext";
import { FaExternalLinkAlt, FaChartBar } from "react-icons/fa";
import * as S from "./MetricasStyles";
import CardGridLayout from "../../Layouts/CardGridLayout/CardGridLayout";
import { Card, CardBody, Title, Description, ExternalButton } from "../../Layouts/CardGridLayout/CardGridLayoutStyles";
import styled from "styled-components";
import MetricasHelp from "./MetricasHelp";

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const LogoImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 20px;
  background: #f8fafc;
  padding: 1rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    padding: 0.75rem;
  }
`;

const metricas = [
  {
    key: "peaga",
    title: "Dashboard Peaga",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiZjM2NjBmMDgtZDNiOS00ZmMwLWFlZDUtYjE5NDdhOTUyMjU4IiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/Logo-Peaga.jpg",
    color: "#2463eb",
  },
  {
    key: "fedcorp",
    title: "Dashboard FedCorp Adm",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiYTc1ZGU2MjItNjNiNS00MTQ5LTk2YjgtYWQzOGYxM2QyYjAwIiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/LOGO.png",
    color: "#2463eb",
  },
  {
    key: "condomed",
    title: "Dashboard Condomed",
    desc: "Acompanhe as métricas da organização de forma única.",
    url: "https://app.powerbi.com/view?r=eyJrIjoiZjE5ODFiZDUtM2U2NS00NzI1LTkzZTktNmE4ZTgxOTAwZjI0IiwidCI6IjVhMjY0OWI1LTAzODMtNDA4Ni04MzYwLTJlNGI2YmZmMGEzZSJ9",
    logo: "/imagens/logo-Condomed.png",
    color: "#2463eb",
  },
];

const Metricas = () => {
  const { user, loading } = useAuth();
  const nivelAcesso = user?.nivel_acesso;

  const metricasPermitidas = metricas.filter(m => {
    if (nivelAcesso === "admin") return true;
    return true;
  });

  return (
    <CardGridLayout
      title="Métricas da FedCorp"
      subtitle="Acompanhe as principais métricas e resultados do Grupo FedCorp"
      icon={<FaChartBar />}
      loading={loading}
      empty={metricasPermitidas.length === 0}
      emptyMessage="Nenhuma métrica disponível para seu nível de acesso"
      helpContent={<MetricasHelp />}
      items={metricasPermitidas}
      renderCard={(metrica) => (
        <Card key={metrica.key} $color={metrica.color}>
          <CardBody>
            <LogoWrapper>
              <LogoImg 
                src={metrica.logo} 
                alt={metrica.title}
                loading="lazy"
              />
            </LogoWrapper>
            <Title>{metrica.title}</Title>
            <Description>{metrica.desc}</Description>
            <ExternalButton 
              href={metrica.url} 
              target="_blank" 
              rel="noopener noreferrer"
              $color={metrica.color}
            >
              <FaExternalLinkAlt size={12} />
              Acessar Dashboard
            </ExternalButton>
          </CardBody>
        </Card>
      )}
    />
  );
};

export default Metricas;