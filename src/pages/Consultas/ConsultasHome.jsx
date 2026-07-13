import { useAuth } from "../../context/AuthContext";
import { 
  FaUser, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaFileInvoiceDollar,
  FaSearch
} from "react-icons/fa";
import CardGridLayout from "../../Layouts/CardGridLayout/CardGridLayout";
import { Card, CardBody, IconWrapper, Title, Description, Button } from "../../Layouts/CardGridLayout/CardGridLayoutStyles";
import { ConsultasHelp } from "./ConsultasHelp";

const consultas = [
    {
        key: "pf",
        icon: <FaUser />,
        title: "Dados Pessoais",
        desc: "Informações sobre pessoas registradas na Receita Federal, incluindo CPF, nome, filiação e data de nascimento.",
        to: "/consultas/consulta-pf",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti", "financeiro"],
        color: "#2463eb",
    },
    {
        key: "cnpj",
        icon: <FaBuilding />,
        title: "Dados Empresariais",
        desc: "Informações sobre empresas registradas, como razão social, CNPJ, e situação cadastral.",
        to: "/consultas/consulta-cnpj",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti", "financeiro"],
        color: "#2463eb",
    },
    {
        key: "endereco",
        icon: <FaMapMarkerAlt />,
        title: "Endereços",
        desc: "Informações detalhadas sobre endereços completos, logradouros, CEPs, cidades e estados.",
        to: "/consultas/consulta-end",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti", "financeiro"],
        color: "#2463eb",
    },
    {
        key: "segurados",
        icon: <FaShieldAlt />,
        title: "Consulta Segurados",
        desc: "Localize informações sobre segurados com base nos registros disponíveis internamente.",
        to: "/consultas/consulta-segurados",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti", "financeiro"],
        color: "#2463eb",
    },
    {
        key: "faturas-dinamicas",
        icon: <FaFileInvoiceDollar />,
        title: "Consultar Faturamento",
        desc: "Consulte faturamento de maneira detalhada com parâmetros de pesquisa.",
        to: "/consultas/consulta-faturamento",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti", "financeiro"],
        color: "#2463eb",
    },
];

const ConsultasHome = () => {
    const { user, loading } = useAuth();
    const currentUserType = user?.nivel_acesso;

    const consultasPermitidas = consultas.filter(c => 
        c.niveis.includes(currentUserType)
    );

    return (
        <CardGridLayout
            title="Consultas Disponíveis"
            subtitle="Consulte informações detalhadas"
            icon={<FaSearch />}
            loading={loading}
            empty={consultasPermitidas.length === 0}
            emptyMessage="Nenhuma consulta disponível para seu nível de acesso"
            helpContent={<ConsultasHelp />}
            items={consultasPermitidas}
            renderCard={(consulta) => (
                <Card key={consulta.key} $color={consulta.color}>
                    <CardBody>
                        <IconWrapper $color={consulta.color}>
                            {consulta.icon}
                        </IconWrapper>
                        <Title>{consulta.title}</Title>
                        <Description>{consulta.desc}</Description>
                        <Button to={consulta.to} $color={consulta.color}>
                            <FaSearch size={14} />
                            Pesquisar
                        </Button>
                    </CardBody>
                </Card>
            )}
        />
    );
};

export default ConsultasHome;