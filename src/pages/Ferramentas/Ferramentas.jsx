import PageTemplate from "../../components/PageTemplate/PageTemplate";
import { useAuth } from "../../context/AuthContext";
import { FerramentasHelp } from "./FerramentasHelp";
import * as S from "./FerramentasStyles";
import { 
  FaFire, 
  FaHandshake, 
  FaFileContract, 
  FaBuilding, 
  FaBoxes, 
  FaTools,
  FaExternalLinkAlt
} from "react-icons/fa";

const ferramentas = [
  {
    key: "incendio",
    icon: <FaFire />,
    title: "Incêndio Locação",
    desc: "Plataforma exclusiva para gestão do seguro incêndio locação.",
    url: "https://incendiofedcorp.com.br/login",
    color: "#2463eb", // ef4444
  },
  {
    key: "fianca",
    icon: <FaHandshake />,
    title: "Fiança",
    desc: "Sistema de fiança locatícia para análise e administração de garantias.",
    url: "https://plataforma.web.segimob.com/auth/login/E04BC0B1-109E-495F-893E-0F3AD5AF2D16",
    color: "#2463eb", // 10b981
  },
  {
    key: "esteira",
    icon: <FaFileContract />,
    title: "Esteira Locação",
    desc: "Gerencie contratos de locação em uma plataforma completa.",
    url: "https://locacaofedcorp.com.br/login",
    color: "#2463eb", // 3b82f6
  },
  {
    key: "condominio",
    icon: <FaBuilding />,
    title: "Seguro Condomínio",
    desc: "Portal para cálculo e contratação de seguro condomínio.",
    url: "https://multicalculofedcorp.com.br/",
    color: "#2463eb", // 8b5cf6
  },
  {
    key: "produtos-adm",
    icon: <FaBoxes />,
    title: "Produtos ADM",
    desc: "Em breve: produtos da administradora integrados na plataforma.",
    url: "",
    color: "#2463eb", // 64748b
  },
];

const Ferramentas = () => {
  const { user, loading } = useAuth();
  const nivelAcesso = user?.nivel_acesso;

  // Filtra ferramentas baseado no nível de acesso (admin pode ver todas)
  const ferramentasPermitidas = ferramentas.filter(f => {
    if (nivelAcesso === "admin") return true;
    // Usuários não-admin não veem ferramentas temporariamente bloqueadas ou específicas
    return f.url !== "";
  });

  const subtitle = "Acesse rapidamente as principais plataformas e soluções digitais da FedCorp.";

  return (
    <PageTemplate
      title="Ferramentas da FedCorp"
      subtitle={subtitle}
      icon={<FaTools />}
      loading={loading}
      empty={ferramentasPermitidas.length === 0}
      emptyMessage="Nenhuma ferramenta disponível para seu nível de acesso"
      helpContent={<FerramentasHelp />}
    >
      <S.CardsGrid>
        {ferramentasPermitidas.map((ferramenta) => (
          <S.Card key={ferramenta.key} $color={ferramenta.color}>
            <S.CardBody>
              <S.IconWrapper $color={ferramenta.color}>
                {ferramenta.icon}
              </S.IconWrapper>
              <S.Title>{ferramenta.title}</S.Title>
              <S.Description>{ferramenta.desc}</S.Description>
              {ferramenta.url ? (
                <S.Button 
                  href={ferramenta.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  $color={ferramenta.color}
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Acessar</span>
                </S.Button>
              ) : (
                <S.Badge $color={ferramenta.color}>Em breve</S.Badge>
              )}
            </S.CardBody>
          </S.Card>
        ))}
      </S.CardsGrid>
    </PageTemplate>
  );
};

export default Ferramentas;