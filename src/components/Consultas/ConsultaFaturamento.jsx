import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/ConsultaFaturamento.css";

import Loading from "../Loading/Loading";
import AdministradoraAutocomplete from "../Adm/AdministradorasAutocomplete";

import {
    exportarFaturasParaExcel,
    exportarFaturasParaPDF,
    getFaturasComBoletos,
    getFaturaPorNumero,
} from "../../services/consultaFatura";

import { getEmpresas } from "../../services/empresasService";
import { getAdministradoraEspecificaPorCodigo } from "../../services/consultaAdmService";

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

const ConsultaFaturasUnificada = () => {
    const [formData, setFormData] = useState({
        fatura: "",
        apolice: "",
        administradora: "",
        data_ini: "",
        data_fim: "",
        status: "",
    });

    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

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
    const [administradorasMap, setAdministradorasMap] = useState({});

    const [detalhesPorFatura, setDetalhesPorFatura] = useState({});
    const [loadingDetalhe, setLoadingDetalhe] = useState({});

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

    const renderStatusBadge = (status, quitado) => {
        if (quitado === "S") return <span className="status-badge status-quitada">Quitada</span>;

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

    const buscarAdministradorasEmLote = async (codigosUnicos) => {
        try {
            const promises = codigosUnicos.map(async (codigo) => {
                try {
                    const adm = await getAdministradoraEspecificaPorCodigo(codigo);
                    if (adm?.sucesso && adm.data) {
                        return { codigo, nome: adm.data.NOME_ADM || adm.data.nome_adm || adm.data.NOME || `Código: ${codigo}` };
                    }
                    return { codigo, nome: `Código: ${codigo}` };
                } catch {
                    return { codigo, nome: `Código: ${codigo}` };
                }
            });

            const res = await Promise.all(promises);
            const novoMapa = {};
            res.forEach((r) => {
                if (r.codigo) novoMapa[r.codigo] = r.nome;
            });

            setAdministradorasMap((prev) => ({ ...prev, ...novoMapa }));
        } catch (e) {
            console.error("Erro ao buscar administradoras em lote:", e);
        }
    };

    useEffect(() => {
        if (!resultados.length) return;
        const codigos = [...new Set(resultados.filter((f) => f.ADMINISTRADORA).map((f) => f.ADMINISTRADORA))];
        const faltando = codigos.filter((c) => !administradorasMap[c]);
        if (faltando.length) buscarAdministradorasEmLote(faltando);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultados]);

    const carregarPagina = async (pageNumber = 1) => {
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

            const response = await getFaturasComBoletos(filtrosComPaginacao);

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
                administradorasMap[f.ADMINISTRADORA] || "",
                f.NOME_COBRADO || "",
                f.CNPJ_COBRADO || "",
                f.DOCUMENTO || "",
                obterNomeCedente(f.CEDENTE) || "",
                formatarData(f.DATA_FAT),
                formatarData(f.VENCIMENTO),
                formatarVigencia(f.DT_INI_VIG, f.DT_FIM_VIG),
            ].map((x) => x?.toString().toLowerCase() || "");

            return campos.some((c) => c.includes(termo));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultados, termoPesquisa, administradorasMap, empresasMap]);

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

    const buscarDetalhePorFatura = async (numeroFatura) => {
        const fat = String(numeroFatura || "").trim();
        if (!fat) return;
        if (detalhesPorFatura[fat]) return;

        setLoadingDetalhe((p) => ({ ...p, [fat]: true }));
        try {
            const resposta = await getFaturaPorNumero(fat);

            let detalhe = null;
            if (resposta?.sucesso && Array.isArray(resposta.data) && resposta.data.length > 0) {
                detalhe = resposta.data[0];
            } else if (Array.isArray(resposta) && resposta.length > 0) {
                detalhe = resposta[0];
            } else if (resposta?.data && Array.isArray(resposta.data) && resposta.data.length > 0) {
                detalhe = resposta.data[0];
            }

            if (detalhe) setDetalhesPorFatura((p) => ({ ...p, [fat]: detalhe }));
        } catch (e) {
            console.error("Erro ao buscar detalhe da fatura:", e);
        } finally {
            setLoadingDetalhe((p) => ({ ...p, [fat]: false }));
        }
    };

    const toggleExpandRow = async (index, numeroFatura) => {
        const vaiAbrir = expandedRow !== index;
        setExpandedRow(vaiAbrir ? index : null);
        if (vaiAbrir) await buscarDetalhePorFatura(numeroFatura);
    };

    const exportarParaExcel = async () => {
        try {
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

    return (
        <>
            <div className="consulta-fatura-container">
                <h1 className="consultas-title">
                    <i className="bi-clipboard-data"></i> Consulta de Faturamento
                </h1>

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

                                    {/* <button
                    className="btn btn-danger btn-sm"
                    onClick={exportarParaPDF}
                    disabled={resultados.length === 0 || loading}
                    title="Exportar dados do banco (ignora filtro local)"
                    type="button"
                  >
                    <i className="bi-file-pdf me-1"></i> PDF
                  </button> */}
                                </div>
                            </div>
                        </div>

                        {/* ✅ BARRA DE PESQUISA (SEM ABSOLUTE PRO ÍCONE) */}
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

                                        const numeroFatura = fatura.FATURA;
                                        const detalhe = detalhesPorFatura[String(numeroFatura || "").trim()];
                                        const detalheCarregando = loadingDetalhe[String(numeroFatura || "").trim()] === true;

                                        const dadosCompletos = { ...fatura, ...(detalhe || {}) };

                                        return (
                                            <React.Fragment key={`${fatura.FATURA}-${index}`}>
                                                <tr
                                                    onClick={() => toggleExpandRow(index, numeroFatura)}
                                                    className={`linha-clicavel ${isExpanded ? "expanded" : ""}`}
                                                >
                                                    <td>
                                                        <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                                                    </td>
                                                    <td>
                                                        <strong className="numero-fatura">#{fatura.FATURA}</strong>
                                                    </td>
                                                    <td>{fatura.APOLICE || "-"}</td>

                                                    <td>{administradorasMap[fatura.ADMINISTRADORA] || fatura.ADMINISTRADORA || "-"}</td>
                                                    <td>{formatarData(fatura.DATA_FAT)}</td>


                                                    <td>{renderStatusBadge(fatura.STATUS, fatura.QUITADO)}</td>
                                                    <td>
                                                        <span className={`vencimento ${venc.status}`}>
                                                            {formatarData(fatura.VENCIMENTO)}


                                                        </span>
                                                    </td>
                                                </tr>

                                                {isExpanded && (
                                                    <tr className="expanded-details">
                                                        <td colSpan="8">
                                                            <div className="expansion-content">
                                                                <h6 className="section-title">
                                                                    <i className="bi-info-circle me-2"></i>Detalhes da Fatura
                                                                </h6>

                                                                {detalheCarregando && (
                                                                    <div style={{ padding: "8px 0", display: "flex", gap: 8, alignItems: "center" }}>
                                                                        <span className="spinner-border spinner-border-sm" />
                                                                        <small>Carregando detalhes completos...</small>
                                                                    </div>
                                                                )}

                                                                <div className="info-grid">
                                                                    <div className="info-item">
                                                                        <strong>Tomador:</strong>
                                                                        <span className="text-truncate">{dadosCompletos.NOME_COBRADO || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>CNPJ:</strong>
                                                                        <span className="font-monospace">{dadosCompletos.CNPJ_COBRADO || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Prêmio Bruto:</strong>
                                                                        <span className="valor">{formatarValor(dadosCompletos.PREMIO_BRUTO)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Corretor:</strong>
                                                                        <span className="text-truncate">{dadosCompletos.CORRETOR || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Comissão (%):</strong>
                                                                        <span className="valor">
                                                                            {dadosCompletos.COMISSAO === null || dadosCompletos.COMISSAO === undefined
                                                                                ? "-"
                                                                                : `${formatarValor(dadosCompletos.COMISSAO, false)}%`}
                                                                        </span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Corretor 2:</strong>
                                                                        <span className="text-truncate">{dadosCompletos.CORRETOR2 || "-"}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Comissão 2 (%):</strong>
                                                                        <span className="valor">
                                                                            {dadosCompletos.COMISSAO2 === null || dadosCompletos.COMISSAO2 === undefined
                                                                                ? "-"
                                                                                : `${formatarValor(dadosCompletos.COMISSAO2, false)}%`}
                                                                        </span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Data Baixa:</strong>
                                                                        <span>{formatarData(dadosCompletos.DT_BAIXA)}</span>
                                                                    </div>

                                                                    <div className="info-item">
                                                                        <strong>Vigência:</strong>
                                                                        <span>{formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG)}</span>
                                                                    </div>

                                                                    {!!dadosCompletos.DT_CANCEL && (
                                                                        <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                                                                            <strong>Cancelamento:</strong>
                                                                            <span style={{ marginLeft: 8 }}>
                                                                                {formatarData(dadosCompletos.DT_CANCEL)}
                                                                                {!!dadosCompletos.OBS_CANCEL && (
                                                                                    <span style={{ marginLeft: 8, color: "#d21a1a" }}>
                                                                                        ({dadosCompletos.OBS_CANCEL})
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
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

            {loading && <Loading fullScreen message="Buscando faturas..." size="large" />}
        </>
    );
};

export default ConsultaFaturasUnificada;
