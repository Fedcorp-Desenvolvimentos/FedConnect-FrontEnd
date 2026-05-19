import { useAuth } from "../../context/AuthContext";
import { 
  FaFire, 
  FaHandshake, 
  FaFileContract, 
  FaBuilding, 
  FaBoxes, 
  FaTools,
  FaExternalLinkAlt,
  FaSearch,
  FaExclamationTriangle 
} from "react-icons/fa";
import CardGridLayout from "../../Layouts/CardGridLayout/CardGridLayout";
import { Card, CardBody, IconWrapper, Title, Description, ExternalButton, Badge } from "../../Layouts/CardGridLayout/CardGridLayoutStyles";
import { FerramentasHelp } from "./FerramentasHelp";

const ferramentas = [
  {
    key: "incendio",
    icon: <FaFire />,
    title: "Incêndio Locação",
    desc: "Plataforma exclusiva para gestão do seguro incêndio locação.",
    url: "https://incendiofedcorp.com.br/login",
    color: "#2463eb",
  },
  {
    key: "fianca",
    icon: <FaHandshake />,
    title: "Fiança",
    desc: "Sistema de fiança locatícia para análise e administração de garantias.",
    url: "https://plataforma.web.segimob.com/auth/login/E04BC0B1-109E-495F-893E-0F3AD5AF2D16",
    color: "#2463eb",
  },
  {
    key: "esteira",
    icon: <FaFileContract />,
    title: "Esteira Locação",
    desc: "Gerencie contratos de locação em uma plataforma completa.",
    url: "https://locacaofedcorp.com.br/login",
    color: "#2463eb",
  },
  {
    key: "condominio",
    icon: <FaBuilding />,
    title: "Seguro Condomínio",
    desc: "Portal para cálculo e contratação de seguro condomínio.",
    url: "https://multicalculofedcorp.com.br/",
    color: "#2463eb",
  },
  {
    key: "produtos-adm",
    icon: <FaBoxes />,
    title: "Produtos ADM",
    desc: "Produtos da administradora integrados na plataforma.",
    url: "https://fedcorp.store/login",
    color: "#2463eb",
  },

   {
    key: "sinistro-fedcorp",
    icon: <FaExclamationTriangle  />,
    title: "Sinistro Fedcorp",
    desc: "Comunicação e acompanhamento de sinistros centralizados em um único lugar",
    url: "https://sinistro.grupofedcorp.com.br/#login",
    color: "#2463eb",
  },

  {
    key: "assistencia-fedcorp",
    icon: <FaHandshake  />,
    title: "Porto Assistência",
    desc: "Consulta de coberturas e exclusões da Porto Assistência em um único lugar",
    url: "https://assistencia.grupofedcorp.com.br/",
    color: "#2463eb",
  },
];

const Ferramentas = () => {
  const { user, loading } = useAuth();
  const nivelAcesso = user?.nivel_acesso;

  // Filtra ferramentas baseado no nível de acesso
  const ferramentasPermitidas = ferramentas.filter(f => {
    if (nivelAcesso === "admin") return true;
    return f.url !== "";
  });

  return (
    <CardGridLayout
      title="Ferramentas da FedCorp"
      subtitle="Acesse rapidamente as principais plataformas e soluções digitais da FedCorp."
      icon={<FaTools />}
      loading={loading}
      empty={ferramentasPermitidas.length === 0}
      emptyMessage="Nenhuma ferramenta disponível para seu nível de acesso"
      helpContent={<FerramentasHelp />}
      items={ferramentasPermitidas}
      renderCard={(ferramenta) => (
        <Card key={ferramenta.key} $color={ferramenta.color}>
          <CardBody>
            <IconWrapper $color={ferramenta.color}>
              {ferramenta.icon}
            </IconWrapper>
            <Title>{ferramenta.title}</Title>
            <Description>{ferramenta.desc}</Description>
            {ferramenta.url ? (
              <ExternalButton 
                href={ferramenta.url} 
                target="_blank" 
                rel="noopener noreferrer"
                $color={ferramenta.color}
              >
                <FaExternalLinkAlt size={12} />
                Acessar
              </ExternalButton>
            ) : (
              <Badge $color={ferramenta.color}>Em breve</Badge>
            )}
          </CardBody>
        </Card>
      )}
    />
  );
};

export default Ferramentas;