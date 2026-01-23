import { useState, useMemo } from 'react';
import "../styles/ConsultaFatComBoleto.css";
import { exportarFaturasParaExcel, exportarFaturasParaPDF, getFaturasComBoletos } from '../../services/consultaFatura';

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

const ConsultaFatComBoleto = () => {
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
    const [totalRegistros, setTotalRegistros] = useState(0);
    const [termoPesquisa, setTermoPesquisa] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    const carregarFaturas = async () => {
        setLoading(true);
        setErro('');
        setTermoPesquisa('');
        setExpandedRow(null);

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

            const response = await getFaturasComBoletos(filtrosAtivos);
            
            if (response.sucesso) {
                const dados = response.resultado?.data || [];
                setResultados(dados);
                setTotalRegistros(response.resultado?.total_registros || 0);
                
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

    const handleSubmit = (e) => {
        e.preventDefault();
        carregarFaturas();
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
        setTotalRegistros(0);
        setTermoPesquisa('');
        setErro('');
        setExpandedRow(null);
    };

    const formatarValor = (valor) => {
        if (valor === null || valor === undefined || valor === '') return '-';
        const num = Number(valor);
        return isNaN(num) ? '-' : num.toLocaleString('pt-BR', { 
            style: 'currency',
            currency: 'BRL'
        });
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

    // Filtrar resultados com base no termo de pesquisa
    const resultadosFiltrados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;

        const termo = termoPesquisa.toLowerCase().trim();
        
        return resultados.filter(fatura => {
            const camposParaBuscar = [
                fatura.APOLICE || '',
                fatura.ADMINISTRADORA || '',
                fatura.FATURA || '',
                formatarData(fatura.DATA_FAT),
                formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG),
                fatura.NOME_COBRADO || '',
                fatura.CNPJ_COBRADO || ''
            ].map(campo => campo?.toString().toLowerCase() || '');

            return camposParaBuscar.some(campo => campo.includes(termo));
        });
    }, [resultados, termoPesquisa]);

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
            
            // Adicionar termo de pesquisa se houver
            if (termoPesquisa.trim()) {
            // Note: A busca no backend será com os filtros originais
            // O termo de pesquisa é apenas para filtro no frontend
            }
            
            // Chamar função de exportação
            await exportarFaturasParaExcel(filtrosAtivos);
            
            // Feedback para o usuário
            // (opcional) você pode adicionar um toast de sucesso aqui
            console.log('Exportação concluída com sucesso!');
            
        } catch (error) {
            console.error('Erro na exportação:', error);
            
            // Mostrar erro para o usuário
            setErro(`Erro ao exportar para Excel: ${error.message}`);
            
            // Remover erro após alguns segundos
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

    return (
        <div className="consulta-fatura-container">
            <h1 className="consultas-title">
                <i className="bi-clipboard-data"></i> Consulta de Faturamento
            </h1>
            
            <form className="form-fatura" onSubmit={handleSubmit}>
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
                <div className="resultado-fatura">
                    <div className="resultados-header">
                        <h3 className='title-consulta'>
                            <i className="bi-list-check"></i> Resultados
                            <span className="ms-2 total-badge">
                                {totalRegistros} {totalRegistros === 1 ? 'registro' : 'registros'}
                            </span>
                        </h3>
                        
                        <div className="total-info">
                            {filtrosAtivos > 0 && (
                                <small className="filtros-ativos">
                                    <i className="bi-funnel"></i>
                                    {filtrosAtivos} filtro(s) ativo(s)
                                </small>
                            )}
                            <div className="export-buttons">
                                <button 
                                    className="btn btn-success btn-sm ms-2"
                                    onClick={exportarParaExcel}
                                    disabled={resultados.length === 0}
                                >
                                    <i className="bi-file-excel me-1"></i> Excel
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={exportarParaPDF}
                                    disabled={resultados.length === 0}
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
                                    className="form-control"
                                    placeholder="Pesquisar por apólice, administradora, fatura, CNPJ ou nome..."
                                    value={termoPesquisa}
                                    onChange={(e) => setTermoPesquisa(e.target.value)}
                                />
                                {termoPesquisa && (
                                    <button 
                                        className="btn-limpar-pesquisa"
                                        onClick={() => setTermoPesquisa('')}
                                        type="button"
                                    >
                                        <i className="bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {termoPesquisa && (
                                <div className="info-pesquisa">
                                    Mostrando {resultadosFiltrados.length} de {resultados.length} registros
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
                                {resultadosFiltrados.map((fatura, index) => {
                                    const vencimentoInfo = verificarVencimento(fatura.VENCIMENTO);
                                    const isExpanded = expandedRow === index;
                                    
                                    return (
                                        <>
                                            <tr 
                                                key={`${fatura.FATURA}-${index}`}
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
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <h6>Informações da Fatura</h6>
                                                                    <div className="info-grid">
                                                                        <div className="info-item">
                                                                            <strong>Tomador:</strong>
                                                                            <span>{fatura.NOME_COBRADO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>CNPJ:</strong>
                                                                            <span>{fatura.CNPJ_COBRADO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Prêmio Bruto:</strong>
                                                                            <span>{formatarValor(fatura.PREMIO_BRUTO)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Valor Boleto:</strong>
                                                                            <span>{formatarValor(fatura.VALOR)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Parcela:</strong>
                                                                            <span>{fatura.PARCELA || '-'}/{fatura.PARCELAS || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Documento:</strong>
                                                                            <span>{fatura.DOCUMENTO || '-'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <h6>Detalhes do Boleto</h6>
                                                                    <div className="info-grid">
                                                                        <div className="info-item">
                                                                            <strong>Nosso Número:</strong>
                                                                            <span>{fatura.NOSSO_NUMERO || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Cedente:</strong>
                                                                            <span>{fatura.CEDENTE || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Agência/Conta:</strong>
                                                                            <span>{fatura.AGENCIA || '-'}/{fatura.CONTA || '-'}-{fatura.DV_CONTA || ''}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Linha Digitável:</strong>
                                                                            <span className="small-text">{fatura.LINHA_DIGITAVEL || '-'}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Boleta Recebida:</strong>
                                                                            <span>{formatarValor(fatura.BOLETA_REC)}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <strong>Boleta Quitada:</strong>
                                                                            <span>{fatura.BOLETA_QUITADA === 'S' ? 'Sim' : 'Não'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="expansion-actions mt-3">
                                                                <button className="btn btn-outline-primary btn-sm me-2">
                                                                    <i className="bi-download me-1"></i> Baixar Boleto
                                                                </button>
                                                                <button className="btn btn-outline-secondary btn-sm me-2">
                                                                    <i className="bi-printer me-1"></i> Imprimir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : !loading && !erro && (
                <div className="nenhum-resultado">
                    <div className="icone-vazio">
                        <i className="bi-search"></i>
                    </div>
                    <h5>Nenhuma consulta realizada</h5>
                    <p>Preencha os filtros e clique em "Consultar" para buscar faturas</p>
                </div>
            )}

            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Buscando faturas com boletos...</p>
                </div>
            )}
        </div>
    );
};

export default ConsultaFatComBoleto;