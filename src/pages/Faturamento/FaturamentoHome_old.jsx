import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as S from "./FaturamentoHomeStyles";
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { 
  FaHammer, 
  FaFilePdf, 
  FaTimesCircle, 
  FaPrint, 
  FaFileInvoice, 
  FaCreditCard,
  FaExternalLinkAlt,
  FaFileInvoiceDollar
} from "react-icons/fa";

import FaturamentoHelp from "./FaturamentoHelp";

const operacionais = [
  // {
  //   key: "pdf-automation",
  //   icon: <FaFilePdf />,
  //   title: "PDF Automation",
  //   desc: "Renomear, separar e automatizar processos com PDFs usando regras e arquivos modelo.",
  //   to: "/faturamento/pdf-automation",
  //   niveis: ["admin", "faturamento"],
  //   color: "#ef4444",
  // },
  {
    key: "cancelamento-fatura",
    icon: <FaTimesCircle />,
    title: "Cancelamentos FedBnk",
    desc: "Solicite e acompanhe cancelamentos de faturas ou boletos.",
    to: "/faturamento/cancelamento",
    niveis: ["admin", "faturamento", "ti"],
    color: "#2463eb", //  dc2626
  },
  // {
  //   key: "reimpressao-boleto",
  //   icon: <FaPrint />,
  //   title: "Reimpressão FedBnk",
  //   desc: "Realize a reimpressão de boletos FedBnk de forma rápida e prática.",
  //   to: "/faturamento/reimpressao-boleto",
  //   niveis: ["admin", "faturamento"],
  //   color: "#2463eb", // 10b981
  // },
  {
    key: "emissao-nf",
    icon: <FaFileInvoice />,
    title: "Sistema de NF",
    desc: "Solicite e acompanhe emissão e cancelamento de Nota Fiscal.",
    to: "https://emissaodenotas.grupofedcorp.com.br/",
    external: true,
    niveis: ["admin", "faturamento"],
    color: "#2463eb", //3b82f6
  },
  // {
  //   key: "paybox",
  //   icon: <FaCreditCard />,
  //   title: "Paybox",
  //   desc: "Gere o arquivo paybox através do número da fatura e da nota fiscal.",
  //   to: "/faturamento/paybox",
  //   niveis: ["admin", "faturamento"],
  //   color: "#8b5cf6",
  // },
  {
    key: "faturas-dinamicas",
    icon: <FaFileInvoiceDollar />,
    title: "Consultar Faturamento",
    desc: "Consulte faturamento de maneira detalhada com parâmetros de pesquisa.",
    to: "/consultas/consulta-faturamento",
    niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    color: "#2463eb", // ef4444
  },
];

const FaturamentoHome = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  if (!isAuthenticated) {
    return (
      <S.ErrorContainer>
        <p>Você precisa estar logado para acessar esta página.</p>
      </S.ErrorContainer>
    );
  }

  const operacionaisPermitidos = operacionais.filter(c => 
    c.niveis.includes(currentUserType)
  );

  return (
    <PageLayout
      title="Faturamento"
      subtitle="Acesse ferramentas e sistemas para otimizar processos de faturamento"
      icon={<FaHammer />}
      loading={loading}
      empty={operacionaisPermitidos.length === 0}
      emptyMessage="Nenhuma ferramenta de faturamento disponível para seu nível de acesso"
      helpContent={<FaturamentoHelp/>}
    >
      <S.CardsGrid>
        {operacionaisPermitidos.map((item) => (
          <S.Card key={item.key} $color={item.color}>
            <S.CardBody>
              <S.IconWrapper $color={item.color}>
                {item.icon}
              </S.IconWrapper>
              <S.Title>
                {item.title}
                {item.external && <FaExternalLinkAlt size={12} style={{ marginLeft: 8 }} />}
              </S.Title>
              <S.Description>{item.desc}</S.Description>
              {item.external ? (
                <S.ExternalButton 
                  href={item.to} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  $color={item.color}
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Acessar</span>
                </S.ExternalButton>
              ) : (
                <S.Button to={item.to} $color={item.color}>
                  <span>Acessar</span>
                </S.Button>
              )}
            </S.CardBody>
          </S.Card>
        ))}
      </S.CardsGrid>
    </PageLayout>
  );
};

export default FaturamentoHome;