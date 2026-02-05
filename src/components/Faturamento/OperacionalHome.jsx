import React from "react";
import { Link } from "react-router-dom";
import "../styles/ConsultasHome.css";
import { useAuth } from "../../context/AuthContext";

const operacionais = [
  // {
  //   key: "pdf-automation",
  //   icon: <i className="bi bi-file-earmark-pdf-fill" />,
  //   title: "PDF Automation",
  //   desc: "Renomear, separar e automatizar processos com PDFs usando regras e arquivos modelo.",
  //   to: "/operacional/pdf-automation",
  //   niveis: ["admin", "faturamento"]
  // },
  {
    key: "cancelamento-fatura",
    icon: <i className="bi bi-x-octagon-fill" />,
    title: "Cancelamentos FedBnk",
    desc: "Solicite e acompanhe cancelamentos de faturas ou boletos com validações e registro interno.",
    to: "/faturamento/cancelamento",
    niveis: ["admin", "faturamento", "ti"],
  },
  // {
  //   key: "reimpressao-boleto",
  //   icon: <i class="bi bi-file-earmark-check-fill"/>,
  //   title: "Reimpressão FedBnk",
  //   desc: "Realize a reimpressão de boletos FedBnk de forma rápida e prática.",
  //   to: "/faturamento/reimpressao-boleto",
  //   niveis: ["admin", "faturamento"],
  // },
  {
    key: "emissao-nf",
    icon: <i className="bi bi-file-earmark-bar-graph-fill" />,
    title: "Sistema de NF",
    desc: "Solicite e acompanhe emissão e cancelamento de Nota Fiscal.",
    to: "https://fedcorp.com.br/suporte/nota/", 
    external: true,
     niveis: ["admin", "faturamento"]
  },

   {
    key: "paybox",
    icon: <i class="bi bi-file-earmark-check-fill"/>,
    title: "Paybox",
    desc: "Gere o arquivo paybox através do número da fatura e da nota fiscal.",
    to: "/faturamento/paybox",
    niveis: ["admin", "faturamento"],
  },
];

const OperacionalHome = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  if (loading) {
    return (
      <div className="home-grid">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="home-grid">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="home-grid">
      <main>
        <div className="container02">
          <h1 className="consultas-title">
            <i className="bi bi-gear-fill"></i> Faturamento
          </h1>

          <div className="cards-container">
            {operacionais
              .filter((c) => c.niveis.includes(currentUserType))
              .map((item) => (
                <div className="card" key={item.key}>
                  <div className="card-body">
                    <div className="feature-icon">{item.icon}</div>

                    <h2>
                      {item.title}
                      {item.external && (
                        <i
                          
                          style={{ marginLeft: 6, fontSize: 14 }}
                        />
                      )}
                    </h2>

                    <p>{item.desc}</p>

                    {item.external ? (
                      <a
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Acessar
                      </a>
                    ) : (
                      <Link to={item.to} className="btn-primary">
                        Acessar
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OperacionalHome;
