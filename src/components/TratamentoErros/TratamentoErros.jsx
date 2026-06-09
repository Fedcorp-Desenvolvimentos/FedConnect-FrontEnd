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
import { MdError } from "react-icons/md";

const erros = [
  {
    key: "tratamento-de-erros-boat",
    icon: <MdError />,
    title: "Tratamento de Erros BOAT",
    desc: "Tratemento de erros de faturamento relacionados ao sistema BOAT, com detalhes e ações específicas para cada tipo de erro.",
    to: "tratamento-de-erros-boat",
    niveis: ["admin", "faturamento", "ti"],
    color: "#2463eb",
    external: false,
  },
];

const TratamentoErros = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  const errosPermitidos = erros.filter(c => 
    c.niveis.includes(currentUserType)
  );

  return (
    <CardGridLayout
      title="Tratamento de Erros"
      subtitle="Acesse ferramentas e sistemas para otimizar processos de tratamento de erros"
      icon={<MdError />}
      loading={loading}
      empty={errosPermitidos.length === 0}
      emptyMessage="Nenhuma ferramenta de tratamento de erros disponível para seu nível de acesso"
      // helpContent={<TratamentoErrosHelp />}
      items={errosPermitidos}
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

export default TratamentoErros;