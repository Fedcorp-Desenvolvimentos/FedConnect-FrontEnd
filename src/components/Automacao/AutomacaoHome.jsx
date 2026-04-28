import { Link } from "react-router-dom";
import PageTemplate from "../PageTemplate/PageTemplate";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ConsultasHome.css";

const automacoes = [
    // {
    //     key: "pdf-automation",
    //     icon: <i className="bi bi-file-earmark-pdf-fill" />,
    //     title: "Automações com PDF",
    //     desc: "Renomear, separar e automatizar processos com PDFs usando regras e arquivos modelo.",
    //     to: "/automacao/pdf",
    //     niveis: ["admin", "faturamento"]
    // },
    {
        key: "bbz-automation",
        icon: <i className="bi bi-file-earmark-pdf-fill" />,
        title: "Automações com BBZ",
        desc: "Automatize processos relacionados ao BBZ, como upload e processamento de PDFs.",
        to: "/automacao/bbz",
        niveis: ["admin", "faturamento"]
    },
    // {
    //     key: "email-automation",
    //     icon: <i className="bi bi-envelope-fill" />,
    //     title: "Automações com Email",
    //     desc: "Automatize processos relacionados ao envio e gerenciamento de emails.",
    //     to: "/automacao/email",
    //     niveis: ["admin", "faturamento"]
    // },
];

const AutomacaoHome = () => {
    const { user, loading } = useAuth();
    const currentUserType = user?.nivel_acesso;

    // Filtra automações por nível de acesso
    const automacoesPermitidas = automacoes.filter(a => 
        a.niveis.includes(currentUserType)
    );

    return (
        <PageTemplate
            title="Automações"
            subtitle="Automatize processos de forma eficiente"
            icon={<i className="bi bi-gear-fill"></i>}
            loading={loading}
            empty={automacoesPermitidas.length === 0}
            emptyMessage="Nenhuma automação disponível para seu nível de acesso"
        >
            <div className="cards-grid">
                {automacoesPermitidas.map((automacao) => (
                    <div className="card" key={automacao.key}>
                        <div className="card-body">
                            <div className="feature-icon">{automacao.icon}</div>
                            <h2>{automacao.title}</h2>
                            <p>{automacao.desc}</p>
                            <Link to={automacao.to} className="btn-primary">
                                Pesquisar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </PageTemplate>
    );
};

export default AutomacaoHome;