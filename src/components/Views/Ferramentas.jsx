import PageLayout from "../PageLayout/PageLayout";
import "../../styles/Ferramentas.css";

const ferramentas = [
  {
    nome: "Incêndio Locação",
    url: "https://incendiofedcorp.com.br/login",
    descricao: "Plataforma exclusiva para gestão do seguro incêndio locação.",
  },
  {
    nome: "Fiança",
    url: "https://plataforma.web.segimob.com/auth/login/E04BC0B1-109E-495F-893E-0F3AD5AF2D16",
    descricao: "Sistema de fiança locatícia para análise e administração de garantias.",
  },
  {
    nome: "Esteira Locação",
    url: "https://locacaofedcorp.com.br/login",
    descricao: "Gerencie contratos de locação em uma plataforma completa",
  },
  {
    nome: "Seguro Condomínio",
    url: "https://multicalculofedcorp.com.br/",
    descricao: "Portal para cálculo e contratação de seguro condomínio.",
  },
  {
    nome: "Produtos ADM",
    url: "",
    descricao: "Em breve: produtos da administradora integrados na plataforma.",
  },
];

const Ferramentas = () => {
  // Subtítulo opcional
  const subtitle = "Acesse rapidamente as principais plataformas e soluções digitais da FedCorp.";

  return (
    <PageLayout
      title="Ferramentas da FedCorp"
      icon={<i className="bi bi-tools"></i>}
      subtitle={subtitle}
    >
      <div className="ferramentas-grid">
        {ferramentas.map((ferramenta, idx) => (
          <div className="ferramenta-card" key={idx}>
            <div className="ferramenta-nome">
              <i className="bi bi-link-45deg"></i> {ferramenta.nome}
            </div>
            <div className="ferramenta-desc">{ferramenta.descricao}</div>
            {ferramenta.url ? (
              <a
                href={ferramenta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ferramenta-btn"
              >
                Acessar
              </a>
            ) : (
              <span className="ferramenta-em-breve">Em breve</span>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Ferramentas;