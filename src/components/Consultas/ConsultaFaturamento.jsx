import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/ConsultaFaturamento.css";

import AdministradoraAutocomplete from "../Adm/AdministradorasAutocomplete";

import {
    exportarFaturasParaExcel,
    exportarFaturasParaPDF,
    getFaturamentoGeral,
} from "../../services/consultaFatura";

import { getEmpresas } from "../../services/empresasService";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import PageTemplate from "../PageTemplate/PageTemplate";
import { useGlobal } from "../../context/GlobalContext";

function traduzirErroApi(mensagem) {
    if (!mensagem) return "Erro inesperado. Por favor, tente novamente.";
    if (typeof mensagem === "string" && mensagem.startsWith("<!DOCTYPE")) {
        return "Erro temporário de conexão com o servidor. Tente novamente em instantes.";
    }
    const msg = (mensagem || "").toString().toLowerCase();
    if (msg.includes("proxy error")) return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
    if (msg.includes("502") || msg.includes("bad gateway")) return "Não foi possível se conectar ao servidor. Tente novamente mais tarde.";
    if (msg.includes("timeout")) return "A requisição demorou muito. Verifique sua conexão e tente novamente.";
    if (msg.includes("network error")) return "Falha de comunicação com a API. Verifique sua conexão de internet.";
    return "Erro ao consultar faturas. Por favor, tente novamente.";
}

const ConsultaFaturamento = () => {
    const [formData, setFormData] = useState({
        fatura: "",
        apolice: "",
        administradora: "",
        data_ini: "",
        data_fim: "",
        status: "",
    });

    const [resultados, setResultados] = useState([]);
    const { loading, setLoading, setLoadingMessage } = useGlobal();
    const [erro, setErro] = useState("");

    console.log("Dados de faturamento:", resultados);

    const [pagination, setPagination] = useState({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });

    const [localPagination, setLocalPagination] = useState({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });

    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);

    const [empresasMap, setEmpresasMap] = useState({});

    const resultadosRef = useRef(null);

    const handleAdministradoraSelect = (administradora) => {
        if (administradora) console.log("Administradora selecionada:", administradora);
    };

    const formatarValor = (valor, asCurrency = true) => {
        if (valor === null || valor === undefined || valor === "") return "-";
        const num = Number(valor);
        if (Number.isNaN(num)) return "-";
        if (!asCurrency) {
            return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const formatarData = (dataString) => {
        if (!dataString) return "-";
        try {
            let data;
            if (String(dataString).includes("T")) {
                data = new Date(dataString);
            } else {
                const [year, month, day] = String(dataString).split("-");
                if (!year || !month || !day) return "-";
                data = new Date(Number(year), Number(month) - 1, Number(day));
            }
            if (Number.isNaN(data.getTime())) return "-";
            return data.toLocaleDateString("pt-BR");
        } catch {
            return "-";
        }
    };

    const formatarVigencia = (dataInicio, dataFim) => `${formatarData(dataInicio)} até ${formatarData(dataFim)}`;

    const renderStatusBadge = (status, boletos) => {
        // Verifica se algum boleto está quitado
        const temQuitado = boletos?.some(b => b.QUITADO === "S");
        if (temQuitado) return <span className="status-badge status-quitada">Quitada</span>;

        const statusMap = {
            A: { label: "Ativa", className: "status-ativa" },
            C: { label: "Cancelada", className: "status-cancelada" },
            P: { label: "Pendente", className: "status-pendente" },
            Q: { label: "Quitada", className: "status-quitada" },
            N: { label: "Inativa", className: "status-inativa" },
        };

        const info = statusMap[status] || { label: "Desconhecido", className: "status-desconhecida" };
        return <span className={`status-badge ${info.className}`}>{info.label}</span>;
    };

    const verificarVencimento = (vencimento) => {
        if (!vencimento) return { status: "desconhecido", label: "Data inválida" };
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const [ano, mes, dia] = String(vencimento).split("-").map(Number);
            const dataVenc = new Date(ano, mes - 1, dia, 0, 0, 0, 0);

            if (dataVenc < hoje) return { status: "vencido", label: "Vencido" };
            if (dataVenc.getTime() === hoje.getTime()) return { status: "hoje", label: "Vence hoje" };

            const diffDays = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
            return { status: "pendente", label: `Vence em ${diffDays} dias` };
        } catch {
            return { status: "desconhecido", label: "Data inválida" };
        }
    };

    useEffect(() => {
        const carregarEmpresas = async () => {
            try {
                const response = await getEmpresas();
                if (response?.status === "success") {
                    const mapa = {};
                    (response.data || []).forEach((empresa) => {
                        mapa[empresa.CODIGO] = empresa.CEDENTE;
                    });
                    setEmpresasMap(mapa);
                }
            } catch (e) {
                console.error("Erro ao carregar empresas:", e);
            }
        };
        carregarEmpresas();
    }, []);

    const obterNomeCedente = (codigo) => empresasMap[codigo] || codigo || "-";

    const carregarPagina = async (pageNumber = 1) => {
        setLoadingMessage("Carregando dados...");
        setLoading(true);
        
        setErro("");
        setTermoPesquisa("");
        setExpandedRow(null);

        setLocalPagination({
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        });

        try {
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value && value.toString().trim() !== "")
            );

            if (filtrosAtivos.data_ini && filtrosAtivos.data_fim) {
                const ini = new Date(filtrosAtivos.data_ini);
                const fim = new Date(filtrosAtivos.data_fim);
                if (ini > fim) throw new Error("Data inicial não pode ser maior que data final");
            }

            const filtrosComPaginacao = {
                ...filtrosAtivos,
                page: pageNumber,
                page_size: pagination.page_size,
            };

            const response = await getFaturamentoGeral(filtrosComPaginacao);

            if (response?.sucesso) {
                const dados = response.resultado?.data || [];
                setResultados(dados);

                if (response.resultado?.pagination) {
                    setPagination(response.resultado.pagination);
                } else {
                    const total = response.resultado?.total_registros || 0;
                    const totalPages = Math.ceil(total / pagination.page_size) || 1;
                    setPagination((prev) => ({
                        ...prev,
                        current_page: pageNumber,
                        total_records: total,
                        total_pages: totalPages,
                        has_next: pageNumber < totalPages,
                        has_previous: pageNumber > 1,
                    }));
                }

                if (!dados.length) setErro("Nenhuma fatura encontrada com os filtros informados.");
            } else {
                setErro(traduzirErroApi(response?.erro || "Erro ao consultar faturas"));
                setResultados([]);
            }
        } catch (err) {
            setErro(traduzirErroApi(err?.message || "Erro ao consultar faturas. Tente novamente."));
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const carregarFaturas = (e) => {
        if (e) e.preventDefault();
        carregarPagina(1);
    };

    const irParaProximaPagina = () => pagination.has_next && carregarPagina(pagination.current_page + 1);
    const irParaPaginaAnterior = () => pagination.has_previous && carregarPagina(pagination.current_page - 1);
    const irParaPagina = (page) => page >= 1 && page <= pagination.total_pages && carregarPagina(page);

    const irParaProximaPaginaLocal = () =>
        localPagination.has_next && setLocalPagination((p) => ({ ...p, current_page: p.current_page + 1 }));
    const irParaPaginaAnteriorLocal = () =>
        localPagination.has_previous && setLocalPagination((p) => ({ ...p, current_page: p.current_page - 1 }));
    const irParaPaginaLocal = (page) =>
        page >= 1 && page <= localPagination.total_pages && setLocalPagination((p) => ({ ...p, current_page: page }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleLimparFiltros = () => {
        setFormData({
            fatura: "",
            apolice: "",
            administradora: "",
            data_ini: "",
            data_fim: "",
            status: "",
        });
        setResultados([]);
        setPagination({
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        });
        setLocalPagination({
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        });
        setTermoPesquisa("");
        setErro("");
        setExpandedRow(null);
    };

    const resultadosFiltrados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;
        const termo = termoPesquisa.toLowerCase().trim();

        return resultados.filter((f) => {
            const campos = [
                f.FATURA || "",
                f.APOLICE || "",
                f.NOME_ADMINISTRADORA || "",
                f.CNPJ_ADMINISTRADORA || "",
                ...(f.BOLETOS?.map(b => b.NOME_COBRADO || "") || []),
                ...(f.BOLETOS?.map(b => b.CNPJ_COBRADO || "") || []),
                ...(f.BOLETOS?.map(b => b.DOCUMENTO || "") || []),
                obterNomeCedente(f.CEDENTE) || "",
                formatarData(f.DATA_FAT),
                formatarData(f.VENCIMENTO),
                formatarVigencia(f.DT_INI_VIG, f.DT_FIM_VIG),
            ].map((x) => x?.toString().toLowerCase() || "");

            return campos.some((c) => c.includes(termo));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultados, termoPesquisa, empresasMap]);

    useEffect(() => {
        if (termoPesquisa.trim()) {
            const totalLocal = resultadosFiltrados.length;
            const size = localPagination.page_size;
            const totalPages = Math.max(1, Math.ceil(totalLocal / size));

            let currentPage = localPagination.current_page;
            if (currentPage > totalPages) currentPage = 1;

            setLocalPagination((prev) => ({
                ...prev,
                current_page: currentPage,
                total_records: totalLocal,
                total_pages: totalPages,
                has_next: currentPage < totalPages,
                has_previous: currentPage > 1,
            }));
        } else {
            setLocalPagination({
                current_page: 1,
                page_size: 10,
                total_records: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultadosFiltrados, termoPesquisa]);

    const resultadosPaginados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;
        const start = (localPagination.current_page - 1) * localPagination.page_size;
        return resultadosFiltrados.slice(start, start + localPagination.page_size);
    }, [resultados, resultadosFiltrados, termoPesquisa, localPagination]);

    useEffect(() => {
        if (!loading && resultados.length > 0 && resultadosRef.current) {
            resultadosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [loading, resultados]);

    const filtrosAtivosCount = Object.values(formData).filter((v) => v && v.toString().trim() !== "").length;

    const toggleExpandRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const exportarParaExcel = async () => {
        try {
            setLoadingMessage("Exportando Excel...");
            setLoading(true);
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value && value.toString().trim() !== "")
            );
            await exportarFaturasParaExcel(filtrosAtivos);
        } catch (error) {
            console.error("Erro na exportação:", error);
            setErro(`Erro ao exportar para Excel: ${error.message}`);
            setTimeout(() => setErro(""), 5000);
        } finally {
            setLoading(false);
        }
    };

    const exportarParaPDF = async () => {
        try {
            setLoadingMessage("Exportando PDF...");
            setLoading(true);
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData).filter(([_, value]) => value && value.toString().trim() !== "")
            );
            await exportarFaturasParaPDF(filtrosAtivos);
        } catch (error) {
            setErro(`Erro ao exportar PDF: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const PaginationControls = () => {
        const usandoFiltroLocal = termoPesquisa.trim() !== "";
        const pag = usandoFiltroLocal ? localPagination : pagination;

        if (pag.total_records === 0 || pag.total_pages <= 1) return null;

        const renderPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;
            let start = Math.max(1, pag.current_page - Math.floor(maxVisible / 2));
            let end = Math.min(pag.total_pages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

            if (start > 1) {
                pages.push(
                    <button
                        key="first"
                        onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(1) : irParaPagina(1))}
                        className="pagination-btn"
                        disabled={loading}
                        title="Primeira página"
                    >
                        1
                    </button>
                );
                if (start > 2) pages.push(<span key="e1" className="pagination-ellipsis">...</span>);
            }

            for (let i = start; i <= end; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(i) : irParaPagina(i))}
                        className={`pagination-btn ${pag.current_page === i ? "active" : ""}`}
                        disabled={loading}
                    >
                        {i}
                    </button>
                );
            }

            if (end < pag.total_pages) {
                if (end < pag.total_pages - 1) pages.push(<span key="e2" className="pagination-ellipsis">...</span>);
                pages.push(
                    <button
                        key="last"
                        onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(pag.total_pages) : irParaPagina(pag.total_pages))}
                        className="pagination-btn"
                        disabled={loading}
                        title="Última página"
                    >
                        {pag.total_pages}
                    </button>
                );
            }

            return pages;
        };

        return (
            <div className="pagination-container">
                <div className="pagination-info">
                    {usandoFiltroLocal ? (
                        <>
                            Mostrando <strong>{(localPagination.current_page - 1) * localPagination.page_size + 1}</strong> –{" "}
                            <strong>{Math.min(localPagination.current_page * localPagination.page_size, localPagination.total_records)}</strong>{" "}
                            de <strong>{localPagination.total_records}</strong> registros filtrados
                            <br />
                            <small className="text-muted">(Total: {pagination.total_records} registros da consulta)</small>
                        </>
                    ) : (
                        <>
                            Mostrando <strong>{(pagination.current_page - 1) * pagination.page_size + 1}</strong> –{" "}
                            <strong>{Math.min(pagination.current_page * pagination.page_size, pagination.total_records)}</strong> de{" "}
                            <strong>{pagination.total_records}</strong> registros
                        </>
                    )}
                </div>

                <div className="pagination-controls">
                    <button
                        onClick={usandoFiltroLocal ? irParaPaginaAnteriorLocal : irParaPaginaAnterior}
                        disabled={usandoFiltroLocal ? !localPagination.has_previous : !pagination.has_previous || loading}
                        className="pagination-btn nav"
                        title="Página anterior"
                    >
                        ‹
                    </button>

                    {renderPageNumbers()}

                    <button
                        onClick={usandoFiltroLocal ? irParaProximaPaginaLocal : irParaProximaPagina}
                        disabled={usandoFiltroLocal ? !localPagination.has_next : !pagination.has_next || loading}
                        className="pagination-btn nav"
                        title="Próxima página"
                    >
                        ›
                    </button>
                </div>
            </div>
        );
    };

    // Componente para renderizar a tabela de boletos dentro do detalhe expandido
    const TabelaBoletos = ({ boletos }) => {
        if (!boletos || boletos.length === 0) {
            return <p className="text-muted">Nenhum boleto encontrado para esta fatura.</p>;
        }

        return (
            <div className="boletos-table-container">
                <table className="boletos-table">
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nosso Número</th>
                            <th>Nome Cobrado</th>
                            <th>CNPJ/CPF</th>
                            <th>Valor</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boletos.map((boleto, idx) => {
                            const vencBoleto = verificarVencimento(boleto.DATA_VENCIMENTO);
                            return (
                                <tr key={idx} className={boleto.STATUS_BOLETO === "C" ? "boleto-cancelado" : ""}>
                                    <td>{boleto.DOCUMENTO || "-"}</td>
                                    <td>{boleto.NOSSO_NUMERO || "-"}</td>
                                    <td>{boleto.NOME_COBRADO || "-"}</td>
                                    <td className="font-monospace">{boleto.CNPJ_COBRADO || "-"}</td>
                                    <td className="valor">{formatarValor(boleto.VALOR)}</td>
                                    <td>
                                        <span className={`vencimento ${vencBoleto.status}`}>
                                            {formatarData(boleto.DATA_VENCIMENTO)}
                                        </span>
                                    </td>
                                    <td>
                                        {boleto.QUITADO === "S" ? (
                                            <span className="status-badge status-quitada">Quitado</span>
                                        ) : boleto.STATUS_BOLETO === "C" ? (
                                            <span className="status-badge status-cancelada">Cancelado</span>
                                        ) : (
                                            <span className="status-badge status-pendente">Pendente</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <PageTemplate
        title="Consulta de Faturamento"
        subtitle="Consulte informações de faturamento"
        icon={<FaFileInvoiceDollar />}
        className="consulta-segurados-page"
        >
            <div className="consulta-fatura-container">
                <form className="form-fatura" onSubmit={carregarFaturas}>
                    <div className="filtros-principais">
                        <div className="form-group">
                            <label htmlFor="fatura">Fatura:</label>
                            <input
                                type="text"
                                id="fatura"
                                name="fatura"
                                value={formData.fatura}
                                onChange={handleChange}
                                placeholder="Número da fatura"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apolice">Apólice:</label>
                            <input
                                type="text"
                                id="apolice"
                                name="apolice"
                                value={formData.apolice}
                                onChange={handleChange}
                                placeholder="Número da apólice"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-control">
                                <option value="">Todos</option>
                                <option value="A">Ativa</option>
                                <option value="C">Cancelada</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="data_ini">Data Inicial:</label>
                            <input
                                type="date"
                                id="data_ini"
                                name="data_ini"
                                value={formData.data_ini}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="data_fim">Data Final:</label>
                            <input
                                type="date"
                                id="data_fim"
                                name="data_fim"
                                value={formData.data_fim}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="administradora">Administradora:</label>
                            <AdministradoraAutocomplete
                                value={formData.administradora}
                                onChange={handleChange}
                                onSelect={handleAdministradoraSelect}
                                placeholder="Digite o nome da administradora..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="botoes-acao">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Consultando..." : "Consultar"}
                        </button>

                        <button type="button" className="btn btn-primary" onClick={handleLimparFiltros} disabled={loading}>
                            Limpar Filtros
                        </button>
                    </div>
                </form>

                {erro && <div className="erro-msg">{erro}</div>}

                {loading || resultados.length > 0 ? (
                    <div className="resultado-fatura" ref={resultadosRef}>
                        <div className="resultados-header">
                            <h3 className="title-consulta">
                                <i className="bi-list-check"></i> Resultados
                                <span className="ms-2 total-badge">
                                    {termoPesquisa.trim() ? localPagination.total_records : pagination.total_records}{" "}
                                    {termoPesquisa.trim()
                                        ? localPagination.total_records === 1
                                            ? "registro filtrado"
                                            : "registros filtrados"
                                        : pagination.total_records === 1
                                            ? "registro"
                                            : "registros"}
                                    {termoPesquisa.trim() && ` (de ${pagination.total_records})`}
                                </span>
                            </h3>

                            <div className="total-info">
                                {filtrosAtivosCount > 0 && (
                                    <small className="filtros-ativos">
                                        <i className="bi-funnel"></i>
                                        {filtrosAtivosCount} filtro(s) ativo(s)
                                    </small>
                                )}

                                {termoPesquisa.trim() && (
                                    <small className="filtro-local-info">
                                        <i className="bi-search"></i>
                                        Filtro local ativo
                                    </small>
                                )}

                                <div className="export-buttons">
                                    <button
                                        className="btn btn-secondary "
                                        onClick={exportarParaExcel}
                                        disabled={resultados.length === 0 || loading}
                                        type="button"
                                        aria-label="Exportar dados do banco (ignora filtro local)"
                                    >
                                        <i className="bi-file-excel me-1"></i> Excel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* BARRA DE PESQUISA LOCAL */}
                        <div className="barra-pesquisa-wrapper">
                            <div className="barra-pesquisa-resultados">
                                <div className="input-group-pesquisa" role="search">
                                    <span className="search-icon" aria-hidden="true">
                                        <i className="bi bi-search" />
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control pesquisa-input"
                                        placeholder="Filtrar resultados localmente..."
                                        value={termoPesquisa}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setTermoPesquisa(v);
                                            if (v.trim() && !termoPesquisa.trim()) {
                                                setLocalPagination((p) => ({ ...p, current_page: 1 }));
                                            }
                                        }}
                                        disabled={loading || resultados.length === 0}
                                    />

                                    {termoPesquisa && (
                                        <button
                                            className="btn-limpar-pesquisa"
                                            type="button"
                                            aria-label="Limpar filtro"
                                            onClick={() => {
                                                setTermoPesquisa("");
                                                setLocalPagination({
                                                    current_page: 1,
                                                    page_size: 10,
                                                    total_records: 0,
                                                    total_pages: 1,
                                                    has_next: false,
                                                    has_previous: false,
                                                });
                                            }}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-x" />
                                        </button>
                                    )}
                                </div>

                                {termoPesquisa && (
                                    <div className="info-pesquisa">
                                        {resultadosFiltrados.length > 0 ? (
                                            <>
                                                <i className="bi-info-circle me-1"></i>
                                                Mostrando {resultadosFiltrados.length} de {resultados.length} registros
                                                {resultadosFiltrados.length < resultados.length && " (filtrados localmente)"}
                                            </>
                                        ) : (
                                            <div className="sem-resultados">
                                                <i className="bi-exclamation-circle me-1"></i>
                                                Nenhum resultado encontrado para "{termoPesquisa}"
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tabela-resultados">
                            <table className="tabela-faturas">
                                <thead>
                                    <tr>
                                        <th style={{ width: "40px" }}></th>
                                        <th>Fatura</th>
                                        <th>Apólice</th>
                                        <th>Administradora</th>
                                        <th>Emissão</th>
                                        <th>Status</th>
                                        <th>Vencimento</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {resultadosPaginados.map((fatura, index) => {
                                        const venc = verificarVencimento(fatura.VENCIMENTO);
                                        const isExpanded = expandedRow === index;

                                        return (
                                            <React.Fragment key={`${fatura.FATURA}-${index}`}>
                                                <tr
                                                    onClick={() => toggleExpandRow(index)}
                                                    className={`linha-clicavel ${isExpanded ? "expanded" : ""}`}
                                                >
                                                    <td>
                                                        <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                                                    </td>
                                                    
                                                    <td>
                                                        <strong className="numero-fatura">#{fatura.FATURA}</strong>
                                                    </td>
                                                    
                                                    <td>{fatura.APOLICE || "-"}</td>

                                                    <td>
                                                        <div className="adm-info">
                                                            <span className="adm-nome">{fatura.NOME_ADMINISTRADORA || "-"}</span>
                                                        </div>
                                                    </td>
                                                    
                                                    <td>{formatarData(fatura.DATA_FAT)}</td>

                                                    <td>{renderStatusBadge(fatura.STATUS, fatura.BOLETOS)}</td>
                                                    
                                                    <td>
                                                        <span className={`vencimento ${venc.status}`}>
                                                            {formatarData(fatura.VENCIMENTO)}
                                                        </span>
                                                    </td>
                                                </tr>

                                                {isExpanded && (
                                                    <tr className="expanded-details">
                                                        <td colSpan="7">
                                                            <div className="expansion-content">
                                                                <div className="expansion-header">
                                                                    <h6 className="section-title">
                                                                        <i className="bi-info-circle me-2"></i>Detalhes da Fatura
                                                                    </h6>
                                                                    
                                                                </div>

                                                                <div className="info-grid">
                                        
                                                                    <div className="info-item">
                                                                        <strong>Prêmio Bruto:</strong>
                                                                        <span className="valor">{formatarValor(fatura.PREMIO_BRUTO)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Prêmio Líquido:</strong>
                                                                        <span className="valor">{formatarValor(fatura.PREMIO_LIQ)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Corretor:</strong>
                                                                        <span className="text-truncate">{fatura.CORRETOR || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Corretor 2:</strong>
                                                                        <span className="text-truncate">{fatura.CORRETOR2 || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Comissão (%):</strong>
                                                                        <span className="valor">
                                                                            {fatura.COMISSAO === null || fatura.COMISSAO === undefined
                                                                                ? "-"
                                                                                : `${formatarValor(fatura.COMISSAO, false)}%`}
                                                                        </span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Comissão 2 (%):</strong>
                                                                        <span className="valor">
                                                                            {fatura.COMISSAO2 === null || fatura.COMISSAO2 === undefined
                                                                                ? "-"
                                                                                : `${formatarValor(fatura.COMISSAO2, false)}%`}
                                                                        </span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Data Baixa:</strong>
                                                                        <span>{formatarData(fatura.DT_BAIXA)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Vigência:</strong>
                                                                        <span>{formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Cedente:</strong>
                                                                        <span>{obterNomeCedente(fatura.CEDENTE)}</span>
                                                                    </div>

                                                                    {!!fatura.DT_CANCEL && (
                                                                        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                                                                            <strong>Cancelamento:</strong>
                                                                            <span style={{ marginLeft: 8 }}>
                                                                                {formatarData(fatura.DT_CANCEL)}
                                                                                {!!fatura.OBS_CANCEL && (
                                                                                    <span style={{ marginLeft: 8, color: "#d21a1a" }}>
                                                                                        ({fatura.OBS_CANCEL})
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* SEÇÃO DE BOLETOS */}
                                                                {fatura.BOLETOS && fatura.BOLETOS.length > 0 && (
                                                                    <div className="boletos-section">
                                                                        <h6 className="section-title mt-3">
                                                                            <i className="bi-receipt me-2"></i>
                                                                            Boletos ({fatura.QTD_BOLETOS})
                                                                            {fatura.VALOR_TOTAL_BOLETOS > 0 && (
                                                                                <span className="valor-total-boletos ms-2">
                                                                                    Total: {formatarValor(fatura.VALOR_TOTAL_BOLETOS)}
                                                                                </span>
                                                                            )}
                                                                        </h6>
                                                                        <TabelaBoletos boletos={fatura.BOLETOS} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <PaginationControls />
                    </div>
                ) : (
                    ""
                )}
            </div>

        </PageTemplate>
    );
};

export default ConsultaFaturamento;