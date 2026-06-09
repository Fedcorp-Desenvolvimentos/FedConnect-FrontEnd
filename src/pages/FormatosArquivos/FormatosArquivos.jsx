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

const formatosArquivos = [
  {
    key: "converter-boleto-csv",
    icon: <FaFileInvoiceDollar />,
    title: "Converter Boleto CSV",
    desc: "Converta boletos para o formato CSV de maneira simples e rápida.",
    to: "converter-boleto-csv",
    niveis: ["admin", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
];

const FormatosArquivos = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  const formatosArquivosPermitidos = formatosArquivos.filter(c => 
    c.niveis.includes(currentUserType)
  );

  return (
    <CardGridLayout
      title="Formatos de Arquivos"
      subtitle="Acesse ferramentas e sistemas para otimizar processos de conversão de arquivos"
      icon={<FaFileInvoiceDollar />}
      loading={loading}
      empty={formatosArquivosPermitidos.length === 0}
      emptyMessage="Nenhuma ferramenta de conversão de arquivos disponível para seu nível de acesso"
      // helpContent={<FormatosArquivosHelp />}
      items={formatosArquivosPermitidos}
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

export default FormatosArquivos;