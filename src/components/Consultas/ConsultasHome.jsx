import { Link } from "react-router-dom";
import PageTemplate from "../PageTemplate/PageTemplate";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ConsultasHome.css";

const consultas = [
    {
        key: "pf",
        icon: <i className="bi bi-person-fill" />,
        title: "Dados Pessoais",
        desc: "Informações sobre pessoas registradas na Receita Federal, incluindo CPF, nome, filiação e data de nascimento.",
        to: "/consultas/consulta-pf",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    },
    {
        key: "cnpj",
        icon: <i className="bi bi-building-fill" />,
        title: "Dados Empresariais",
        desc: "Informações sobre empresas registradas, como razão social, CNPJ, e situação cadastral.",
        to: "/consultas/consulta-cnpj",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    },
    {
        key: "endereco",
        icon: <i className="bi bi-geo-alt-fill" />,
        title: "Endereços",
        desc: "Informações detalhadas sobre endereços completos, logradouros, CEPs, cidades e estados.",
        to: "/consultas/consulta-end",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    },
    {
        key: "segurados",
        icon: <i className="bi bi-shield-check" />,
        title: "Consulta Segurados",
        desc: "Localize informações sobre segurados com base nos registros disponíveis internamente.",
        to: "/consultas/consulta-segurados",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    },
    {
        key: "faturas-dinamicas",
        icon: <i className="bi bi-file-earmark-text"></i>,
        title: "Consultar Faturamento",
        desc: "Consulte faturamento de maneira detalhada com parâmetros de pesquisa.",
        to: "/consultas/consulta-faturamento",
        niveis: ["admin", "usuario", "comercial", "faturamento", "ti"],
    },
    // {
    //     key: "notas-fiscais",
    //     icon: <i className="bi bi-receipt"></i>,
    //     title: "Consultar Notas Fiscais",
    //     desc: "Consulte notas fiscais de maneira detalhada com parâmetros de pesquisa.",
    //     to: "/consultas/consulta-notas-fiscais",
    //     niveis: ["admin", "usuario", "comercial", "ti"],
    // },
];

const ConsultasHome = () => {
    const { user, loading } = useAuth();
    const currentUserType = user?.nivel_acesso;

    // Filtra consultas por nível de acesso
    const consultasPermitidas = consultas.filter(c => 
        c.niveis.includes(currentUserType)
    );

    return (
        <PageTemplate
            title="Consultas Disponíveis"
            subtitle="Consulte informações detalhadas"
            icon={<i className="bi bi-clipboard-data"></i>}
            loading={loading}
            empty={consultasPermitidas.length === 0}
            emptyMessage="Nenhuma consulta disponível para seu nível de acesso"
        >
            <div className="cards-grid">
                {consultasPermitidas.map((consulta) => (
                    <div className="card" key={consulta.key}>
                        <div className="card-body">
                            <div className="feature-icon">{consulta.icon}</div>
                            <h2>{consulta.title}</h2>
                            <p>{consulta.desc}</p>
                            <Link to={consulta.to} className="btn-primary">
                                Pesquisar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default ConsultasHome;