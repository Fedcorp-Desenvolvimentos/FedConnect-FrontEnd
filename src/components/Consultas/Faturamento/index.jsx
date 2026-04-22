import { useEffect, useRef, useCallback, useState } from "react";
import "../../../styles/ConsultaFaturamento.css";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import PageTemplate from "../../PageTemplate/PageTemplate";

// Hooks
import { useFaturamento } from "./hooks/useFaturamento";
import { useFiltros } from "./hooks/useFiltros";
import { usePaginacao } from "./hooks/usePaginacao";
import { usePesquisaLocal } from "./hooks/usePesquisaLocal";

// Componentes
import { FormularioHeader } from "./FormularioHeader";
import { BarraPesquisaLocal } from "./BarraPesquisaLocal";
import { PaginationControls } from "./PaginationControls";
import { LinhaFatura } from "./LinhaFatura";

const ConsultaFaturamento = () => {
    const resultadosRef = useRef(null);
    const [expandedRow, setExpandedRow] = useState(null);

    // Hooks
    const {
        resultados,
        setResultados,
        erro,
        setErro,
        carregarEmpresas,
        carregarPagina,
        carregarCorretoresDosResultados,
        obterNomeCedente,
        obterNomeCorretor,
        loading,
    } = useFaturamento();

    const {
        formData,
        handleChange,
        handleAdministradoraSelect,
        limparFiltros,
        filtrosAtivosCount,
    } = useFiltros();

    const {
        pagination,
        atualizarPagination,
        irParaProximaPagina,
        irParaPaginaAnterior,
        irParaPagina,
        PAGE_SIZE,
    } = usePaginacao();

    const {
        termoPesquisa,
        setTermoPesquisa,
        localPagination,
        setLocalPagination,
        resultadosFiltrados,
        resultadosPaginados,
        limparPesquisa,
    } = usePesquisaLocal(resultados, obterNomeCedente);

    // Carregar empresas ao montar
    useEffect(() => {
        carregarEmpresas();
    }, [carregarEmpresas]);

    // Carregar corretores quando resultados mudam
    useEffect(() => {
        carregarCorretoresDosResultados(resultados);
    }, [resultados, carregarCorretoresDosResultados]);

    // Scroll para resultados quando carregar
    useEffect(() => {
        if (!loading && resultados.length > 0 && resultadosRef.current) {
            resultadosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [loading, resultados]);

    const handleCarregarFaturas = useCallback(async (e) => {
        if (e) e.preventDefault();
        setErro("");
        setTermoPesquisa("");
        setExpandedRow(null);
        setLocalPagination({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1, has_next: false, has_previous: false });
        
        const { dados, pagination: novaPagination } = await carregarPagina(formData, 1, PAGE_SIZE);
        setResultados(dados);
        if (novaPagination) atualizarPagination(novaPagination);
    }, [formData, carregarPagina, PAGE_SIZE, setResultados, atualizarPagination, setErro]);

    const handleLimparFiltros = useCallback(() => {
        limparFiltros();
        setResultados([]);
        setTermoPesquisa("");
        setErro("");
        setExpandedRow(null);
        atualizarPagination({ current_page: 1, page_size: PAGE_SIZE, total_records: 0, total_pages: 1, has_next: false, has_previous: false });
        setLocalPagination({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1, has_next: false, has_previous: false });
    }, [limparFiltros, setResultados, setErro, atualizarPagination, PAGE_SIZE]);

    const toggleExpandRow = useCallback((index) => {
        setExpandedRow(prev => prev === index ? null : index);
    }, []);

    const handleIrParaPagina = useCallback(async (page) => {
        const pageToGo = irParaPagina(page);
        if (pageToGo) {
            const { dados, pagination: novaPagination } = await carregarPagina(formData, pageToGo, PAGE_SIZE);
            setResultados(dados);
            if (novaPagination) atualizarPagination(novaPagination);
        }
    }, [formData, carregarPagina, PAGE_SIZE, setResultados, atualizarPagination, irParaPagina]);

    const handleProximaPagina = useCallback(async () => {
        const nextPage = irParaProximaPagina();
        if (nextPage) {
            const { dados, pagination: novaPagination } = await carregarPagina(formData, nextPage, PAGE_SIZE);
            setResultados(dados);
            if (novaPagination) atualizarPagination(novaPagination);
        }
    }, [formData, carregarPagina, PAGE_SIZE, setResultados, atualizarPagination, irParaProximaPagina]);

    const handlePaginaAnterior = useCallback(async () => {
        const prevPage = irParaPaginaAnterior();
        if (prevPage) {
            const { dados, pagination: novaPagination } = await carregarPagina(formData, prevPage, PAGE_SIZE);
            setResultados(dados);
            if (novaPagination) atualizarPagination(novaPagination);
        }
    }, [formData, carregarPagina, PAGE_SIZE, setResultados, atualizarPagination, irParaPaginaAnterior]);

    const irParaPaginaLocal = useCallback((page) => {
        if (page >= 1 && page <= localPagination.total_pages) {
            setLocalPagination(prev => ({ ...prev, current_page: page }));
        }
    }, [localPagination.total_pages]);

    const irParaProximaPaginaLocal = useCallback(() => {
        if (localPagination.has_next) {
            setLocalPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }));
        }
    }, [localPagination.has_next]);

    const irParaPaginaAnteriorLocal = useCallback(() => {
        if (localPagination.has_previous) {
            setLocalPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }));
        }
    }, [localPagination.has_previous]);

    console.log("resultadosPaginados", resultadosPaginados);

    return (
        <PageTemplate
            title="Consulta de Faturamento"
            subtitle="Consulte informações de faturamento"
            icon={<FaFileInvoiceDollar />}
            className="consulta-segurados-page"
        >
            <div className="consulta-fatura-container">
                <FormularioHeader 
                    formData={formData}
                    handleChange={handleChange}
                    handleAdministradoraSelect={handleAdministradoraSelect}
                    carregarFaturas={handleCarregarFaturas}
                    handleLimparFiltros={handleLimparFiltros}
                    loading={loading}
                />
                
                {erro && <div className="erro-msg">{erro}</div>}

                {loading || resultados.length > 0 ? (
                    <div className="resultado-fatura" ref={resultadosRef}>
                        <div className="resultados-header">
                            <h3 className="title-consulta">
                                <i className="bi-list-check"></i> Resultados
                                <span className="ms-2 total-badge">
                                    {termoPesquisa.trim() ? localPagination.total_records : pagination.total_records}{" "}
                                    {termoPesquisa.trim()
                                        ? localPagination.total_records === 1 ? "registro filtrado" : "registros filtrados"
                                        : pagination.total_records === 1 ? "registro" : "registros"}
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
                            </div>
                        </div>

                        <BarraPesquisaLocal 
                            termoPesquisa={termoPesquisa}
                            setTermoPesquisa={setTermoPesquisa}
                            limparPesquisa={limparPesquisa}
                            resultadosFiltrados={resultadosFiltrados}
                            resultados={resultados}
                            loading={loading}
                        />

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
                                {resultadosPaginados.map((fatura, index) => (
                                    <LinhaFatura
                                        key={`${fatura.FATURA}-${index}`}
                                        fatura={fatura}
                                        index={index}
                                        isExpanded={expandedRow === index}
                                        toggleExpandRow={toggleExpandRow}
                                        obterNomeCedente={obterNomeCedente}
                                        obterNomeCorretor={obterNomeCorretor}
                                    />
                                ))}
                            </tbody>
                        </table>
                        </div>

                        <PaginationControls 
                            pagination={pagination}
                            localPagination={localPagination}
                            termoPesquisa={termoPesquisa}
                            loading={loading}
                            irParaPagina={handleIrParaPagina}
                            irParaPaginaAnterior={handlePaginaAnterior}
                            irParaProximaPagina={handleProximaPagina}
                            irParaPaginaLocal={irParaPaginaLocal}
                            irParaPaginaAnteriorLocal={irParaPaginaAnteriorLocal}
                            irParaProximaPaginaLocal={irParaProximaPaginaLocal}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </PageTemplate>
    );
};

export default ConsultaFaturamento;