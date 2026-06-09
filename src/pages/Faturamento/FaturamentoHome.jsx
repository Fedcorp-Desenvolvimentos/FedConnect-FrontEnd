import { useAuth } from "../../context/AuthContext";
import { 
  FaHammer, 
  FaTimesCircle, 
  FaFileInvoice, 
  FaExternalLinkAlt,
  FaFileInvoiceDollar
} from "react-icons/fa";
import CardGridLayout from "../../Layouts/CardGridLayout/CardGridLayout";
import { Card, CardBody, IconWrapper, Title, Description, Button, ExternalButton } from "../../Layouts/CardGridLayout/CardGridLayoutStyles";
import FaturamentoHelp from "./FaturamentoHelp";
import { MdError } from "react-icons/md";

const operacionais = [
  {
    key: "cancelamento-fatura",
    icon: <FaTimesCircle />,
    title: "Cancelamentos FedBnk",
    desc: "Solicite e acompanhe cancelamentos de faturas ou boletos.",
    to: "/faturamento/cancelamento",
    niveis: ["admin", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
  {
    key: "emissao-nf",
    icon: <FaFileInvoice />,
    title: "Sistema de NF",
    desc: "Solicite e acompanhe emissão e cancelamento de Nota Fiscal.",
    to: "https://emissaodenotas.grupofedcorp.com.br/",
    external: true,
    niveis: ["admin", "faturamento"],
    color: "#2463eb",
  },
  {
    key: "faturas-dinamicas",
    icon: <FaFileInvoiceDollar />,
    title: "Consultar Faturamento",
    desc: "Consulte faturamento de maneira detalhada com parâmetros de pesquisa.",
    to: "/consultas/consulta-faturamento",
    niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
   {
    key: "tratamento-de-erros",
    icon: <MdError />,
    title: "Tratamento de Erros",
    desc: "Trate erros de faturamento de maneira simples.",
    to: "/tratamento-erros",
    niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
     {
    key: "formatos-de-arquivos",
    icon: <MdError />,
    title: "Formatos de Arquivos",
    desc: "Gerencie e converta formatos de arquivos de maneira simples.",
    to: "/formatos-arquivos",
    niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
];

const FaturamentoHome = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  const operacionaisPermitidos = operacionais.filter(c => 
    c.niveis.includes(currentUserType)
  );

  return (
    <CardGridLayout
      title="Faturamento"
      subtitle="Acesse ferramentas e sistemas para otimizar processos de faturamento"
      icon={<FaHammer />}
      loading={loading}
      empty={operacionaisPermitidos.length === 0}
      emptyMessage="Nenhuma ferramenta de faturamento disponível para seu nível de acesso"
      helpContent={<FaturamentoHelp />}
      items={operacionaisPermitidos}
      renderCard={(item) => (
        <Card key={item.key} $color={item.color}>
          <CardBody>
            <IconWrapper $color={item.color}>
              {item.icon}
            </IconWrapper>
            <Title>
              {item.title}
              {item.external && <FaExternalLinkAlt size={12} style={{ marginLeft: 8 }} />}
            </Title>
            <Description>{item.desc}</Description>
            {item.external ? (
              <ExternalButton 
                href={item.to} 
                target="_blank" 
                rel="noopener noreferrer"
                $color={item.color}
              >
                <FaExternalLinkAlt size={12} />
                Acessar
              </ExternalButton>
            ) : (
              <Button to={item.to} $color={item.color}>
                Acessar
              </Button>
            )}
          </CardBody>
        </Card>
      )}
    />
  );
};

export default FaturamentoHome;