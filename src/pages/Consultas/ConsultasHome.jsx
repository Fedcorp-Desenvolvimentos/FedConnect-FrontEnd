import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as S from "./ConsultasHomeStyles";
import { 
  FaUser, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaFileInvoiceDollar,
  FaSearch
} from "react-icons/fa";
import PageTemplate from "../../components/PageTemplate/PageTemplate";

const consultas = [
    {
        key: "pf",
        icon: <FaUser />,
        title: "Dados Pessoais",
        desc: "Informações sobre pessoas registradas na Receita Federal, incluindo CPF, nome, filiação e data de nascimento.",
        to: "/consultas/consulta-pf",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
        color: "#2463eb",
    },
    {
        key: "cnpj",
        icon: <FaBuilding />,
        title: "Dados Empresariais",
        desc: "Informações sobre empresas registradas, como razão social, CNPJ, e situação cadastral.",
        to: "/consultas/consulta-cnpj",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
        color: "#2463eb", // 10b981
    },
    {
        key: "endereco",
        icon: <FaMapMarkerAlt />,
        title: "Endereços",
        desc: "Informações detalhadas sobre endereços completos, logradouros, CEPs, cidades e estados.",
        to: "/consultas/consulta-end",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
        color: "#2463eb", // f59e0b
    },
    {
        key: "segurados",
        icon: <FaShieldAlt />,
        title: "Consulta Segurados",
        desc: "Localize informações sobre segurados com base nos registros disponíveis internamente.",
        to: "/consultas/consulta-segurados",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
        color: "#2463eb", // 8b5cf6
    },
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

const ConsultasHome = () => {
    const { user, loading } = useAuth();
    const currentUserType = user?.nivel_acesso;

    const consultasPermitidas = consultas.filter(c => 
        c.niveis.includes(currentUserType)
    );

    return (
        <PageTemplate
            title="Consultas Disponíveis"
            subtitle="Consulte informações detalhadas"
            icon={<FaSearch />}
            loading={loading}
            empty={consultasPermitidas.length === 0}
            emptyMessage="Nenhuma consulta disponível para seu nível de acesso"
            helpContent={
                <div>
                    <p><strong>O que fazer aqui:</strong></p>
                    <ul>
                        <li>Clique em "Pesquisar" para consultar</li>
                        <li>Use os filtros disponíveis</li>
                        <li>Exporte resultados quando necessário</li>
                    </ul>
                </div>
            }
        >
            <S.CardsGrid>
                {consultasPermitidas.map((consulta) => (
                    <S.Card key={consulta.key} $color={consulta.color}>
                        <S.CardBody>
                            <S.IconWrapper $color={consulta.color}>
                                {consulta.icon}
                            </S.IconWrapper>
                            <S.Title>{consulta.title}</S.Title>
                            <S.Description>{consulta.desc}</S.Description>
                            <S.Button to={consulta.to} $color={consulta.color}>
                                <FaSearch size={14} />
                                <span>Pesquisar</span>
                            </S.Button>
                        </S.CardBody>
                    </S.Card>
                ))}
            </S.CardsGrid>
        </PageTemplate>
    );
};

export default ConsultasHome;