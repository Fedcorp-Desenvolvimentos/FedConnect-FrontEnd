import React, { useState, useMemo, useEffect, useRef } from 'react';
import "../styles/ConsultaFaturamento.css";
import { exportarFaturasParaExcel, exportarFaturasParaPDF, getFaturasComBoletos } from '../../services/consultaFatura';
import { getEmpresas } from '../../services/empresasService';
import Loading from '../Loading/Loading';

function traduzirErroApi(mensagem) {
    if (!mensagem) return "Erro inesperado. Por favor, tente novamente.";
    if (typeof mensagem === "string" && mensagem.startsWith('<!DOCTYPE')) {
        return "Erro temporário de conexão com o servidor. Tente novamente em instantes.";
    }
    if (mensagem.toLowerCase().includes("proxy error")) {
        return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
    }
    if (mensagem.toLowerCase().includes("502") || mensagem.toLowerCase().includes("bad gateway")) {
        return "Não foi possível se conectar ao servidor. Por favor, tente novamente mais tarde.";
    }
    if (mensagem.toLowerCase().includes("timeout")) {
        return "A requisição demorou muito. Verifique sua conexão e tente novamente.";
    }
    if (mensagem.toLowerCase().includes("network error")) {
        return "Falha de comunicação com a API. Verifique sua conexão de internet.";
    }
    return "Erro ao consultar faturas. Por favor, tente novamente.";
}

const ConsultaFaturamento = () => {
    const [formData, setFormData] = useState({
        apolice: '',
        administradora: '',
        data_ini: '',
        data_fim: '',
        status: '',
    });
    
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [empresasMap, setEmpresasMap] = useState({});

    const resultadosRef = useRef(null);       

    // PAGINAÇÃO LOCAL - Estado separado para filtro local
    const [localPagination, setLocalPagination] = useState({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });

    // Função para carregar uma página específica do BACKEND
    const carregarPagina = async (pageNumber = 1) => {
        setLoading(true);
        setErro('');
        setTermoPesquisa('');
        setExpandedRow(null);
        // Resetar paginação local quando buscar novos dados
        setLocalPagination({
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        });

        try {
            // Filtrar campos vazios
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData)
                    .filter(([_, value]) => value && value.toString().trim() !== '')
            );

            // Validar datas
            if (filtrosAtivos.data_ini && filtrosAtivos.data_fim) {
                const dataIni = new Date(filtrosAtivos.data_ini);
                const dataFim = new Date(filtrosAtivos.data_fim);
                if (dataIni > dataFim) {
                    throw new Error('Data inicial não pode ser maior que data final');
                }
            }

            // Adicionar parâmetros de paginação
            const filtrosComPaginacao = {
                ...filtrosAtivos,
                page: pageNumber,
                page_size: pagination.page_size,
            };

            const response = await getFaturasComBoletos(filtrosComPaginacao);
            
            if (response.sucesso) {
                const dados = response.resultado?.data || [];
                setResultados(dados);
                
                // Atualizar informações de paginação DO BACKEND
                if (response.resultado?.pagination) {
                    setPagination(response.resultado.pagination);
                } else {
                    // Fallback para estrutura antiga
                    setPagination(prev => ({
                        ...prev,
                        current_page: pageNumber,
                        total_records: response.resultado?.total_registros || 0,
                        total_pages: Math.ceil((response.resultado?.total_registros || 0) / pagination.page_size),
                        has_next: pageNumber < Math.ceil((response.resultado?.total_registros || 0) / pagination.page_size),
                        has_previous: pageNumber > 1,
                    }));
                }
                
                if (dados.length === 0) {
                    setErro('Nenhuma fatura encontrada com os filtros informados.');
                }
            } else {
                setErro(traduzirErroApi(response.erro || 'Erro ao consultar faturas'));
                setResultados([]);
            }
        } catch (err) {
            setErro(traduzirErroApi(err.message || 'Erro ao consultar faturas. Tente novamente.'));
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    // Função inicial de consulta (vai para página 1)
    const carregarFaturas = (e) => {
        if (e) e.preventDefault();
        carregarPagina(1);
    };

    // Carregar empresas
    useEffect(() => {
        const carregarEmpresas = async () => {
            try {
                const response = await getEmpresas();
                if (response?.status === 'success') {
                    const empresasList = response.data || [];
                    
                    // Criar mapa de código -> nome
                    const mapa = {};
                    empresasList.forEach(empresa => {
                        mapa[empresa.CODIGO] = empresa.CEDENTE;
                    });
                    setEmpresasMap(mapa);
                }
            } catch (error) {
                console.error('Erro ao carregar empresas:', error);
            }
        };
        
        carregarEmpresas();
    }, []);

    const obterNomeCedente = (codigo) => {
        return empresasMap[codigo] || codigo || '-';
    };

    // Funções de navegação de página DO BACKEND
    const irParaProximaPagina = () => {
        if (pagination.has_next) {
            carregarPagina(pagination.current_page + 1);
        }
    };

    const irParaPaginaAnterior = () => {
        if (pagination.has_previous) {
            carregarPagina(pagination.current_page - 1);
        }
    };

    const irParaPagina = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= pagination.total_pages) {
            carregarPagina(pageNumber);
        }
    };

    // Funções de navegação de página LOCAL
    const irParaProximaPaginaLocal = () => {
        if (localPagination.has_next) {
            setLocalPagination(prev => ({
                ...prev,
                current_page: prev.current_page + 1,
            }));
        }
    };

    const irParaPaginaAnteriorLocal = () => {
        if (localPagination.has_previous) {
            setLocalPagination(prev => ({
                ...prev,
                current_page: prev.current_page - 1,
            }));
        }
    };

    const irParaPaginaLocal = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= localPagination.total_pages) {
            setLocalPagination(prev => ({
                ...prev,
                current_page: pageNumber,
            }));
        }
    };

    const handleChangePageSize = (newSize) => {
        setPagination(prev => ({
            ...prev,
            page_size: parseInt(newSize),
        }));
        carregarPagina(1);
    };

    const handleChangeLocalPageSize = (newSize) => {
        setLocalPagination(prev => ({
            ...prev,
            page_size: parseInt(newSize),
            current_page: 1, // Resetar para primeira página ao mudar tamanho
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLimparFiltros = () => {
        setFormData({
            apolice: '',
            administradora: '',
            data_ini: '',
            data_fim: '',
            status: '',
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
        setTermoPesquisa('');
        setErro('');
        setExpandedRow(null);
    };

        const formatarData = (dataString) => {
        if (!dataString) return '-';
        
        try {
            let data;
            
            if (dataString.includes('T')) {
                data = new Date(dataString);
            } else {
                const [year, month, day] = dataString.split('-');
                if (year && month && day) {
                    data = new Date(year, month - 1, day);
                } else {
                    return '-';
                }
            }
            
            if (isNaN(data.getTime())) return '-';
            
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return '-';
        }
    };

    const formatarVigencia = (dataInicio, dataFim) => {
        const inicio = formatarData(dataInicio);
        const fim = formatarData(dataFim);
        return `${inicio} até ${fim}`;
    };

    // Filtrar resultados com base no termo de pesquisa
    const resultadosFiltrados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;

        const termo = termoPesquisa.toLowerCase().trim();
        
        return resultados.filter(fatura => {
            // Buscar em todos os campos importantes
            const camposParaBuscar = [
                fatura.APOLICE || '',
                fatura.ADMINISTRADORA || '',
                fatura.FATURA || '',
                fatura.NOME_COBRADO || '',
                fatura.CNPJ_COBRADO || '',
                fatura.DOCUMENTO || '',
                obterNomeCedente(fatura.CEDENTE) || '',
                // Formatar datas para texto
                formatarData(fatura.DATA_FAT),
                formatarData(fatura.VENCIMENTO),
                formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG)
            ].map(campo => campo?.toString().toLowerCase() || '');

            return camposParaBuscar.some(campo => campo.includes(termo));
        });
    }, [resultados, termoPesquisa, empresasMap]);

    // Atualizar paginação LOCAL quando os resultados filtrados mudam
    useEffect(() => {
        if (termoPesquisa.trim()) {
            const totalLocal = resultadosFiltrados.length;
            const pageSize = localPagination.page_size;
            const totalPages = Math.max(1, Math.ceil(totalLocal / pageSize));
            
            // Ajustar página atual se necessário
            let currentPage = localPagination.current_page;
            if (currentPage > totalPages) {
                currentPage = 1;
            }
            
            setLocalPagination(prev => ({
                ...prev,
                current_page: currentPage,
                total_records: totalLocal,
                total_pages: totalPages,
                has_next: currentPage < totalPages,
                has_previous: currentPage > 1,
            }));
        } else {
            // Sem filtro local, resetar paginação local
            setLocalPagination({
                current_page: 1,
                page_size: 10,
                total_records: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
            });
        }
    }, [resultadosFiltrados, termoPesquisa]);

    // Obter resultados paginados (com base no filtro local se ativo)
    const resultadosPaginados = useMemo(() => {
        if (!termoPesquisa.trim()) {
            // Sem filtro local, mostrar resultados completos (já paginados pelo backend)
            return resultados;
        }
        
        // Com filtro local, aplicar paginação local
        const startIndex = (localPagination.current_page - 1) * localPagination.page_size;
        const endIndex = startIndex + localPagination.page_size;
        
        return resultadosFiltrados.slice(startIndex, endIndex);
    }, [resultados, resultadosFiltrados, termoPesquisa, localPagination]);

    // Componente de controles de paginação
    const PaginationControls = () => {
        // Decidir qual paginação mostrar
        const usandoFiltroLocal = termoPesquisa.trim() !== '';
        const paginationAtual = usandoFiltroLocal ? localPagination : pagination;
        const totalRecords = paginationAtual.total_records;
        
        if (totalRecords === 0 || paginationAtual.total_pages <= 1) return null;

        const renderPageNumbers = () => {
            const pages = [];
            const maxVisible = 5;
            let startPage = Math.max(1, paginationAtual.current_page - Math.floor(maxVisible / 2));
            let endPage = Math.min(paginationAtual.total_pages, startPage + maxVisible - 1);

            // Ajustar se não houver páginas suficientes no início
            if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            // Primeira página
            if (startPage > 1) {
                pages.push(
                    <button
                        key="first"
                        onClick={() => usandoFiltroLocal ? irParaPaginaLocal(1) : irParaPagina(1)}
                        className="pagination-btn"
                        title="Primeira página"
                        disabled={loading}
                    >
                        1
                    </button>
                );
                if (startPage > 2) {
                    pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
                }
            }

            // Páginas do meio
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => usandoFiltroLocal ? irParaPaginaLocal(i) : irParaPagina(i)}
                        className={`pagination-btn ${paginationAtual.current_page === i ? 'active' : ''}`}
                        disabled={loading}
                    >
                        {i}
                    </button>
                );
            }

            // Última página
            if (endPage < paginationAtual.total_pages) {
                if (endPage < paginationAtual.total_pages - 1) {
                    pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
                }
                pages.push(
                    <button
                        key="last"
                        onClick={() => usandoFiltroLocal ? irParaPaginaLocal(paginationAtual.total_pages) : irParaPagina(paginationAtual.total_pages)}
                        className="pagination-btn"
                        title="Última página"
                        disabled={loading}
                    >
                        {paginationAtual.total_pages}
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
                            Mostrando <strong>{(localPagination.current_page - 1) * localPagination.page_size + 1}</strong>
                            {' – '}
                            <strong>{Math.min(localPagination.current_page * localPagination.page_size, localPagination.total_records)}</strong>
                            {' de '}
                            <strong>{localPagination.total_records}</strong> registros filtrados
                            <br />
                            <small className="text-muted">
                                (Total: {pagination.total_records} registros da consulta)
                            </small>
                        </>
                    ) : (
                        <>
                            Mostrando <strong>{(pagination.current_page - 1) * pagination.page_size + 1}</strong>
                            {' – '}
                            <strong>{Math.min(pagination.current_page * pagination.page_size, pagination.total_records)}</strong>
                            {' de '}
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

                {/* <div className="page-size-selector">
                    <span>Itens por página:</span>
                    <select
                        value={usandoFiltroLocal ? localPagination.page_size : pagination.page_size}
                        onChange={(e) => usandoFiltroLocal ? handleChangeLocalPageSize(e.target.value) : handleChangePageSize(e.target.value)}
                        disabled={loading}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div> */}
            </div>
        );
    };

    const formatarValor = (valor) => {
        if (valor === null || valor === undefined || valor === '') return '-';
        const num = Number(valor);
        return isNaN(num) ? '-' : num.toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL'
        });
    };

    const renderStatusBadge = (status, quitado) => {
        if (quitado === 'S') {
            return <span className="status-badge status-quitada">Quitada</span>;
        }
        
        const statusMap = {
            'A': { label: 'Ativa', className: 'status-ativa' },
            'C': { label: 'Cancelada', className: 'status-cancelada' },
            'P': { label: 'Pendente', className: 'status-pendente' },
            'Q': { label: 'Quitada', className: 'status-quitada' },
            'N': { label: 'Inativa', className: 'status-inativa' }
        };
        
        const statusInfo = statusMap[status] || { label: 'Desconhecido', className: 'status-desconhecida' };
        return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.label}</span>;
    };

    const verificarVencimento = (vencimento) => {
        if (!vencimento) return { status: 'desconhecido', label: 'Data inválida' };
        
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataVenc = new Date(vencimento);
        dataVenc.setHours(0, 0, 0, 0);
        
        if (dataVenc < hoje) {
            return { status: 'vencido', label: 'Vencido' };
        } else if (dataVenc.getTime() === hoje.getTime()) {
            return { status: 'hoje', label: 'Vence hoje' };
        } else {
            const diffTime = dataVenc - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { status: 'pendente', label: `Vence em ${diffDays} dias` };
        }
    };

    // Contar filtros ativos
    const filtrosAtivos = Object.values(formData).filter(
        valor => valor && valor.toString().trim() !== ''
    ).length;

    const toggleExpandRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    const exportarParaExcel = async () => {
        try {
            // Mostrar loading
            setLoading(true);
            
            // Preparar filtros atuais para enviar para exportação
            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData)
                    .filter(([_, value]) => value && value.toString().trim() !== '')
            );
            
            // Chamar função de exportação (sempre exporta do banco)
            await exportarFaturasParaExcel(filtrosAtivos);
            
        } catch (error) {
            console.error('Erro na exportação:', error);
            setErro(`Erro ao exportar para Excel: ${error.message}`);
            setTimeout(() => setErro(''), 5000);
        } finally {
            setLoading(false);
        }
    };
    
    const exportarParaPDF = async () => {
        try {
            setLoading(true);

            const filtrosAtivos = Object.fromEntries(
                Object.entries(formData).filter(
                    ([_, value]) => value && value.toString().trim() !== ""
                )
            );

            await exportarFaturasParaPDF(filtrosAtivos);
        } catch (error) {
            setErro(`Erro ao exportar PDF: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && resultados.length > 0 && resultadosRef.current) {
            resultadosRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [loading, resultados]);

    return (
        <>
        <div className="consulta-fatura-container">
            <h1 className="consultas-title">
                <i className="bi-clipboard-data"></i> Consulta de Faturamento
            </h1>
            
            <form className="form-fatura" onSubmit={carregarFaturas}>
                <div className="filtros-principais">
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
                        <label htmlFor="administradora">Administradora:</label>
                        <input
                            type="text"
                            id="administradora"
                            name="administradora"
                            value={formData.administradora}
                            onChange={handleChange}
                            placeholder="Código administradora"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            <option value="A">Ativa</option>
                            <option value="C">Cancelada</option>
                            <option value="Q">Quitada</option>
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
                </div>

                <div className="botoes-acao">
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                    >
                        {loading ? 'Consultando...' : 'Consultar'}
                    </button>

                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleLimparFiltros}
                        disabled={loading}
                    >
                        Limpar Filtros
                    </button>
                </div>
            </form>

            {erro && <div className="erro-msg">{erro}</div>}

            {resultados.length > 0 ? (
                <div className="resultado-fatura" ref={resultadosRef}>
                    <div className="resultados-header">
                        <h3 className='title-consulta'>
                            <i className="bi-list-check"></i> Resultados
                            <span className="ms-2 total-badge">
                                {termoPesquisa.trim() ? localPagination.total_records : pagination.total_records} 
                                {' '}
                                {termoPesquisa.trim() ? 
                                    (localPagination.total_records === 1 ? 'registro filtrado' : 'registros filtrados') : 
                                    (pagination.total_records === 1 ? 'registro' : 'registros')
                                }
                                {termoPesquisa.trim() && ` (de ${pagination.total_records})`}
                            </span>
                        </h3>
                        
                        <div className="total-info">
                            {filtrosAtivos > 0 && (
                                <small className="filtros-ativos">
                                    <i className="bi-funnel"></i>
                                    {filtrosAtivos} filtro(s) ativo(s)
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
                                    className="btn btn-success btn-sm ms-2"
                                    onClick={exportarParaExcel}
                                    disabled={resultados.length === 0 || loading}
                                    title="Exportar dados do banco (ignora filtro local)"
                                >
                                    <i className="bi-file-excel me-1"></i> Excel
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={exportarParaPDF}
                                    disabled={resultados.length === 0 || loading}
                                    title="Exportar dados do banco (ignora filtro local)"
                                >
                                    <i className="bi-file-pdf me-1"></i> PDF
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Barra de pesquisa nos resultados */}
                    <div className="barra-pesquisa-wrapper">
                        <div className="barra-pesquisa-resultados">
                            <div className="input-group-pesquisa">
                                <span className="input-group-text">
                                    <i className="bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control pesquisa-input"
                                    placeholder="Filtrar resultados localmente..."
                                    value={termoPesquisa}
                                    onChange={(e) => {
                                        setTermoPesquisa(e.target.value);
                                        // Resetar para página 1 ao começar a pesquisar
                                        if (e.target.value.trim() && !termoPesquisa.trim()) {
                                            setLocalPagination(prev => ({ ...prev, current_page: 1 }));
                                        }
                                    }}
                                    disabled={loading || resultados.length === 0}
                                />
                                {termoPesquisa && (
                                    <button 
                                        className="btn-limpar-pesquisa"
                                        onClick={() => {
                                            setTermoPesquisa('');
                                            // Resetar paginação local ao limpar filtro
                                            setLocalPagination({
                                                current_page: 1,
                                                page_size: 10,
                                                total_records: 0,
                                                total_pages: 1,
                                                has_next: false,
                                                has_previous: false,
                                            });
                                        }}
                                        type="button"
                                        disabled={loading}
                                    >
                                        <i className="bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {termoPesquisa && (
                                <div className="info-pesquisa">
                                    {resultadosFiltrados.length > 0 ? (
                                        <>
                                            <i className="bi-info-circle me-1"></i>
                                            Mostrando {resultadosFiltrados.length} de {resultados.length} registros
                                            {resultadosFiltrados.length < resultados.length && ' (filtrados localmente)'}
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
                                    <th style={{ width: '40px' }}></th>
                                    <th>Fatura</th>
                                    <th>Apólice</th>
                                    <th>Administradora</th>
                                    <th>Data</th>
                                    <th>Vigência</th>
                                    <th>Status</th>
                                    <th>Vencimento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultadosPaginados.map((fatura, index) => {
                                    const vencimentoInfo = verificarVencimento(fatura.VENCIMENTO);
                                    const isExpanded = expandedRow === index;
                                    
                                    return (
                                        <React.Fragment key={`${fatura.FATURA}-${index}`}>
                                            <tr 
                                                onClick={() => toggleExpandRow(index)}
                                                className={`linha-clicavel ${isExpanded ? 'expanded' : ''}`}
                                            >
                                                <td>
                                                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                                                </td>
                                                <td>
                                                    <strong className="numero-fatura">
                                                        #{fatura.FATURA}
                                                    </strong>
                                                </td>
                                                <td>{fatura.APOLICE || '-'}</td>
                                                <td>{fatura.ADMINISTRADORA || '-'}</td>
                                                <td>{formatarData(fatura.DATA_FAT)}</td>
                                                <td className="vigencia">
                                                    {formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG)}
                                                </td>
                                                <td>{renderStatusBadge(fatura.STATUS, fatura.QUITADO)}</td>
                                                <td>
                                                    <span className={`vencimento ${vencimentoInfo.status}`}>
                                                        {formatarData(fatura.VENCIMENTO)}
                                                        <br/>
                                                        <small>{vencimentoInfo.label}</small>
                                                    </span>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="expanded-details">
                                                    <td colSpan="8">
                                                        <div className="expansion-content">
                                                            <div className="row g-3">
                                                                <div className="col-lg-6 col-md-12">
                                                                    <h6 className="section-title">
                                                                        <i className="bi-file-text me-2"></i>Informações da Fatura
                                                                    </h6>
                                                                    <div className="info-grid">
                                                                        <div className="info-item">
                                                                            <strong>Tomador:</strong>
                                                                            <span className="text-truncate">{fatura.NOME_COBRADO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Usuário:</strong>
                                                                            <span>{fatura.USUARIO_CAD || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>CNPJ:</strong>
                                                                            <span className="font-monospace">{fatura.CNPJ_COBRADO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Prêmio Bruto:</strong>
                                                                            <span className="valor">{formatarValor(fatura.PREMIO_BRUTO)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Valor Boleto:</strong>
                                                                            <span className="valor">{formatarValor(fatura.VALOR)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Parcela:</strong>
                                                                            <span>{fatura.PARCELA || '-'}/{fatura.PARCELAS || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Documento:</strong>
                                                                            <span className="font-monospace">{fatura.DOCUMENTO || '-'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 col-md-12">
                                                                    <h6 className="section-title">
                                                                        <i className="bi-receipt me-2"></i>Detalhes do Boleto
                                                                    </h6>
                                                                    <div className="info-grid">
                                                                        <div className="info-item">
                                                                            <strong>Nosso Número:</strong>
                                                                            <span className="font-monospace">{fatura.NOSSO_NUMERO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Cedente:</strong>
                                                                            <span className="text-truncate">{obterNomeCedente(fatura.CEDENTE)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Agência/Conta:</strong>
                                                                            <span className="font-monospace">
                                                                                {fatura.AGENCIA || '-'}/{fatura.CONTA || '-'}{fatura.DV_CONTA ? `-${fatura.DV_CONTA}` : ''}
                                                                            </span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Linha Digitável:</strong>
                                                                            <span className="small-text font-monospace">{fatura.LINHA_DIGITAVEL || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Boleta Recebida:</strong>
                                                                            <span className="valor">{formatarValor(fatura.BOLETA_REC)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Boleta Quitada:</strong>
                                                                            <span className={fatura.BOLETA_QUITADA === 'S' ? 'text-success' : 'text-secondary'}>
                                                                                {fatura.BOLETA_QUITADA === 'S' ? 'Sim' : 'Não'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="expansion-actions mt-4 pt-3 border-top">
                                                                <button className="btn btn-outline-primary btn-sm me-2" disabled>
                                                                    <i className="bi-download me-1"></i> Baixar Boleto
                                                                </button>
                                                                <button className="btn btn-outline-secondary btn-sm me-2" disabled>
                                                                    <i className="bi-printer me-1"></i> Imprimir
                                                                </button>
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
            ) : !loading && !erro && resultados.length === 0 && ( ""
                // <div className="nenhum-resultado">
                //     <div className="icone-vazio">
                //         <i className="bi-search"></i>
                //     </div>
                //     <h5>Nenhuma consulta realizada</h5>
                //     <p>Preencha os filtros e clique em "Consultar" para buscar faturas</p>
                // </div>
            )}  
        </div>
        {loading && (
            <Loading 
                fullScreen 
                message="Buscando faturas..."
                size="large"
            />
        )}
        </>
    );
};

export default ConsultaFaturamento;