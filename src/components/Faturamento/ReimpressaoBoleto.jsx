import React, { useMemo, useState } from "react";
import "../styles/ConsultasHome.css";
import "../styles/ReimpressaoBoleto.css";

const buscarBoletosPorFatura = async (numeroFatura) => {

    await new Promise((r) => setTimeout(r, 400));
    return [
        {
            id: 1,
            numero_boleto: "2379000",
            vencimento: "20-12-2025",
            valor: 199.9,
            pdf_url: "https://example.com/boleto1.pdf",
        },
        {
            id: 2,
            numero_boleto: "2379012",
            vencimento: "27-12-2025",
            valor: 289.5,
            pdf_url: "https://example.com/boleto2.pdf",
        },
    ];
};

const ReimpressaoBoleto = () => {
    const [numeroFatura, setNumeroFatura] = useState("");
    const [numeroBoleto, setNumeroBoleto] = useState("");
    const [boletos, setBoletos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const handleBuscar = async (e) => {
        e.preventDefault();
        setMsg({ type: "", text: "" });

        const fatura = numeroFatura.trim();
        if (!fatura) {
            setMsg({ type: "error", text: "Informe o número da fatura." });
            return;
        }

        try {
            setLoading(true);
            setBoletos([]);
            setNumeroBoleto("");

            const lista = await buscarBoletosPorFatura(fatura);

            if (!lista?.length) {
                setMsg({ type: "info", text: "Nenhum boleto disponível para essa fatura." });
                return;
            }

            setBoletos(lista);
            setMsg({ type: "success", text: "Boletos carregados com sucesso." });
        } catch (err) {
            console.error(err);
            setMsg({ type: "error", text: "Erro ao buscar boletos. Tente novamente." });
        } finally {
            setLoading(false);
        }
    };

    const boletosFiltrados = useMemo(() => {
        const termo = numeroBoleto.trim();
        if (!termo) return boletos;

        const termoNorm = termo.replace(/\s/g, "");
        return boletos.filter((b) =>
            String(b.numero_boleto || "")
                .replace(/\s/g, "")
                .includes(termoNorm)
        );
    }, [boletos, numeroBoleto]);

    const reimprimirBoleto = (boleto) => {
        if (!boleto?.pdf_url) {
            setMsg({ type: "error", text: "Esse boleto não possui link de impressão." });
            return;
        }
        window.open(boleto.pdf_url, "_blank", "noopener,noreferrer");
    };

    const reimprimirTodos = () => {
        if (!boletosFiltrados.length) {
            setMsg({ type: "info", text: "Não há boletos para reimprimir." });
            return;
        }
        boletosFiltrados.forEach((b, idx) => setTimeout(() => reimprimirBoleto(b), idx * 200));
    };

    return (
        <div className="home-grid">
            <main>
                <div className="container02">
                    <h1 className="consultas-title">
                        <i className="bi bi-file-earmark-check-fill"></i> Reimpressão FedBnk
                    </h1>

                    <div className="rb-card">
                        <form onSubmit={handleBuscar} className="rb-form">
                            <div className="rb-row">
                                <div className="rb-field">
                                    <label>Número da Fatura</label>
                                    <input
                                        value={numeroFatura}
                                        onChange={(e) => setNumeroFatura(e.target.value)}
                                        placeholder="Ex: FAT-2025-000123"
                                        autoComplete="off"
                                    />
                                </div>

                                <button className="btn-primary" type="submit" disabled={loading}>
                                    {loading ? "Buscando..." : "Buscar"}
                                </button>
                            </div>

                            <div className="rb-row">
                                <div className="rb-field">
                                    <label>Número do Boleto (opcional)</label>
                                    <input
                                        value={numeroBoleto}
                                        onChange={(e) => setNumeroBoleto(e.target.value)}
                                        placeholder="Digite parte do número do boleto"
                                        autoComplete="off"
                                        disabled={!boletos.length}
                                    />
                                </div>

                                <button
                                    className="btn-secondary"
                                    type="button"
                                    onClick={reimprimirTodos}
                                    disabled={!boletosFiltrados.length}
                                >
                                    <i className="bi bi-printer-fill"></i>{" "}
                                    Reimprimir {numeroBoleto.trim() ? "filtrados" : "todos"}
                                </button>
                            </div>

                            {msg.text ? (
                                <div className={`rb-alert ${msg.type}`}>
                                    <i
                                        className={`bi ${msg.type === "success"
                                                ? "bi-check-circle-fill"
                                                : msg.type === "info"
                                                    ? "bi-info-circle-fill"
                                                    : "bi-exclamation-triangle-fill"
                                            }`}
                                    ></i>
                                    <span>{msg.text}</span>
                                </div>
                            ) : null}
                        </form>

                        <div className="rb-list">
                            <h3 className="rb-subtitle">
                                Boletos disponíveis {boletos.length ? `(${boletosFiltrados.length}/${boletos.length})` : ""}
                            </h3>

                            {boletos.length === 0 ? (
                                <div className="rb-empty">
                                    Informe a fatura para listar os boletos.
                                </div>
                            ) : boletosFiltrados.length === 0 ? (
                                <div className="rb-empty">
                                    Nenhum boleto bate com esse filtro.
                                </div>
                            ) : (
                                <table className="rb-table">
                                    <thead>
                                        <tr>
                                            <th>Nº Boleto</th>
                                            <th>Vencimento</th>
                                            <th>Valor</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boletosFiltrados.map((b) => (
                                            <tr key={b.id}>
                                                <td className="rb-mono">{b.numero_boleto}</td>
                                                <td>{b.vencimento}</td>
                                                <td>
                                                    {typeof b.valor === "number"
                                                        ? b.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                                        : b.valor}
                                                </td>
                                                <td>
                                                    <button className="btn-primary rb-btn-print" 
                                                    type="button" 
                                                    onClick={() => reimprimirBoleto(b)}>
                                                        <i className="bi bi-printer-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReimpressaoBoleto;
