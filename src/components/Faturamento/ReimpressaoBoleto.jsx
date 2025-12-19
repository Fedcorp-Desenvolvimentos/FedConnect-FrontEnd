import React, { useMemo, useState } from "react";
import "../styles/ConsultasHome.css";
import "../styles/ReimpressaoBoleto.css";
import { impressWebhook } from "../../services/boletofedbnk";
import { ConsultaService } from "../../services/consultaService";

const buscarBoletosPorFatura = async (numeroFatura) => {
    try {
        const response = await ConsultaService.boletosFatura(numeroFatura);
        
        // Verifica se a resposta é um array
        if (!Array.isArray(response)) {
            console.error("Resposta inesperada da API:", response);
            return [];
        }

        // Mapeia os dados do Backend para o Frontend
        return response.map((item) => ({
            id: item.documento, // Usando documento como chave única
            numero_boleto: item.nosso_numero,
            valor: item.valor,
            fatura: item.fatura,
            status: item.stat,
            original: item
        }));
    } catch (error) {
        console.error("Erro no serviço de busca:", error);
        throw error;
    }
};

const ReimpressaoBoleto = () => {
    const [numeroFatura, setNumeroFatura] = useState("");
    const [numeroBoleto, setNumeroBoleto] = useState("");
    const [boletos, setBoletos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [method, setmethod] = useState("")
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

   const reimprimirBoleto = async (boleto) => {
        // Log para depuração: garante que o objeto correto chegou aqui
        console.log("Solicitando download do boleto:", boleto.numero_boleto);

        try {
            const payload = { 
                number: boleto.numero_boleto, 
                method: "boleto"  
            };

            // Faz a requisição
            const pdfBlob = await impressWebhook(payload);

            // Verifica se o Blob é válido
            if (!pdfBlob) {
                throw new Error("O arquivo retornado está vazio.");
            }

            // 1. Limpeza de segurança: Remove qualquer link 'zumbi' que possa ter ficado
            const oldLink = document.getElementById('temp-download-link');
            if (oldLink) {
                document.body.removeChild(oldLink);
            }

            // 2. Cria o novo Blob e URL
            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const fileURL = window.URL.createObjectURL(blob);

            // 3. Cria o elemento de link com um ID específico
            const link = document.createElement('a');
            link.id = 'temp-download-link'; // ID fixo para garantir que controlamos este elemento
            link.href = fileURL;
            link.setAttribute('download', `boleto_${boleto.numero_boleto}.pdf`);
            link.style.display = 'none'; // Garante que não afeta o layout
            
            // 4. Adiciona ao corpo
            document.body.appendChild(link);
            
            // 5. Clica no elemento exato que acabamos de criar
            link.click();
            
            // 6. Limpeza com delay seguro
            setTimeout(() => {
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
                window.URL.revokeObjectURL(fileURL);
                console.log("Download finalizado e memória limpa para:", boleto.numero_boleto);
            }, 200); // 200ms é suficiente para o navegador registrar o download

        } catch (error) {
            console.error("Erro ao fazer download do boleto:", error);
            setMsg({ type: "error", text: "Erro ao gerar o arquivo do boleto." });
        }
    };

    const reimprimirTodos = async () => {
        if (!boletosFiltrados.length) {
            setMsg({ type: "info", text: "Não há boletos para reimprimir." });
            return;
        }
        const payload = {
            number: numeroFatura,
            method: "fatura"
         }
        const pdfBlob = await impressWebhook(payload);

        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const fileURL = window.URL.createObjectURL(blob);

            // 3. Cria o elemento de link com um ID específico
            const link = document.createElement('a');
            link.id = 'temp-download-link'; // ID fixo para garantir que controlamos este elemento
            link.href = fileURL;
            link.setAttribute('download', `fatura_${numeroFatura}.pdf`);
            link.style.display = 'none'; // Garante que não afeta o layout
            
            // 4. Adiciona ao corpo
            document.body.appendChild(link);
            
            // 5. Clica no elemento exato que acabamos de criar
            link.click();
            
            // 6. Limpeza com delay seguro
            setTimeout(() => {
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
                window.URL.revokeObjectURL(fileURL);
                console.log("Download finalizado e memória limpa para:", boleto.numero_boleto);
            }, 200); // 200ms é suficiente para o navegador registrar o download
        
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
                                        placeholder="Digite o número da fatura"
                                        autoComplete="off"
                                    />
                                </div>

                                <button className="btn-primary" type="submit" disabled={loading}>
                                    {loading ? "Buscando..." : "Buscar"}
                                </button>
                            </div>

                            <div className="rb-row">
                                <div className="rb-field">
                                    <label>Número do Boleto</label>
                                    <input
                                        value={numeroBoleto}
                                        onChange={(e) => setNumeroBoleto(e.target.value)}
                                        placeholder="Digite o número do boleto"
                                        autoComplete="off"
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
                                    Preencha as informações para listar os boletos.
                                </div>
                            ) : boletosFiltrados.length === 0 ? (
                                <div className="rb-empty">
                                    Nenhum boleto bate com esse filtro.
                                </div>
                            ) : (
                                <table className="rb-table">
                                    <thead>
                                        <tr>
                                            <th>Fatura</th>
                                            <th>Nº Boleto</th>
                                            <th>Documento</th>
                                            <th>Registrado</th>
                                            <th>Status (FINANC)</th>
                                            <th>Valor</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boletosFiltrados.map((b) => (
                                            
                                            <tr key={b.id}>
                                                <td>{b.original.fatura}</td>
                                                <td className="rb-mono">{b.numero_boleto}</td>

                                                <td>{b.original.documento}</td>
                                                <td>{b.original.identificador==null?"Não" :"Sim"}</td>
                                                <td>{b.original.status=="C"?"Cancelado":"Ativo"}</td>
                                                {console.log(b)}
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