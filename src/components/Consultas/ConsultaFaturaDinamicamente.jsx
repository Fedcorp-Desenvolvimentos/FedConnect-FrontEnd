import { useState } from 'react';
import "../styles/ConsultaDetalhes.css";
import { getFaturaDinamicamente } from '../../services/consultaFatura';
import { useNavigate } from "react-router-dom";

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
    if (mensagem.toLowerCase().includes("preencha o número da fatura")) {
        return mensagem;
    }
    return "Erro ao consultar faturas. Por favor, tente novamente.";
}

const ConsultaFaturaDinamicamente = () => {
    const [formData, setFormData] = useState({
        fatura: '',
        administradora: '',
        seguradora: '',
        status: '',
        ramo: '',
        data_ini: '',
        data_fim: '',
        valor_min: '',
        valor_max: ''
    });
    
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [totalRegistros, setTotalRegistros] = useState(0);

    const navigate = useNavigate();

    const carregarFaturas = async (filtrosAdicionais = {}) => {
        setLoading(true);
        setErro('');

        try {
            // Filtrar campos vazios
            const filtrosAtivos = Object.fromEntries(
                Object.entries({...formData, ...filtrosAdicionais})
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

            // Validar valores
            if (filtrosAtivos.valor_min && filtrosAtivos.valor_max) {
                if (parseFloat(filtrosAtivos.valor_min) > parseFloat(filtrosAtivos.valor_max)) {
                    throw new Error('Valor mínimo não pode ser maior que valor máximo');
                }
            }

            const response = await getFaturaDinamicamente(filtrosAtivos);
            
            if (response.sucesso) {
                setResultados(response.resultado?.data || []);
                setTotalRegistros(response.resultado?.total || 0);
                
                if (response.resultado?.data?.length === 0) {
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
            fatura: '',
            administradora: '',
            seguradora: '',
            status: '',
            ramo: '',
            data_ini: '',
            data_fim: '',
            valor_min: '',
            valor_max: ''
        });
        setResultados([]);
        setTotalRegistros(0);
        setErro('');
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

    const renderStatusBadge = (status) => {
        const cores = {
            'A': 'status-ativa',
            'C': 'status-cancelada',
            'P': 'status-pendente',
            'Q': 'status-quitada',
            'N': 'status-inativa'
        };
        
        const textos = {
            'A': 'Ativa',
            'C': 'Cancelada',
            'P': 'Pendente',
            'Q': 'Quitada',
            'N': 'Inativa'
        };
        
        return (
            <span className={`status-badge ${cores[status] || 'status-desconhecida'}`}>
                {textos[status] || status}
            </span>
        );
    };

    // Contar filtros ativos
    const filtrosAtivos = Object.values(formData).filter(
        valor => valor && valor.toString().trim() !== ''
    ).length;

    const handleVerDetalhe = (numeroFatura) => {
        navigate(`/consulta-detalhes/${numeroFatura}`);
    };

    return (
        <div className="consulta-fatura-container">
            <h1 className="consultas-title">
                <i className="bi-clipboard-data"></i> Consulta de Faturas
            </h1>
            
            <form className="form-fatura" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fatura">Nº Fatura:</label>
                    <input
                        type="text"
                        id="fatura"
                        name="fatura"
                        value={formData.fatura}
                        onChange={handleChange}
                        placeholder="Ex: 162028"
                        className="form-control"
                    />
                </div>

                <div className="group-btn-wrapper">
                    <button 
                        type="button" 
                        className="btn-toggle-filtros"
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    >
                        <i className={`bi bi-${mostrarFiltros ? 'chevron-up' : 'chevron-down'}`}></i>
                        {mostrarFiltros ? 'Menos Filtros' : 'Mais Filtros'}
                        {filtrosAtivos > 0 && (
                            <span className="filtros-count">{filtrosAtivos}</span>
                        )}
                    </button>
                </div>

                {mostrarFiltros && (
                    <div className="filtros-avancados">
                        <div className="grid-3-colunas">
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
                                <label htmlFor="seguradora">Seguradora:</label>
                                <input
                                    type="text"
                                    id="seguradora"
                                    name="seguradora"
                                    value={formData.seguradora}
                                    onChange={handleChange}
                                    placeholder="Código seguradora"
                                    className="form-control"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ramo">Ramo:</label>
                                <select
                                    id="ramo"
                                    name="ramo"
                                    value={formData.ramo}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Todos</option>
                                    <option value="V">Vida</option>
                                    <option value="P">Patrimonial</option>
                                    <option value="A">Automóvel</option>
                                </select>
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
                                    <option value="P">Pendente</option>
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

                            <div className="form-group">
                                <label htmlFor="valor_min">Valor Mínimo:</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input
                                        type="number"
                                        id="valor_min"
                                        name="valor_min"
                                        value={formData.valor_min}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="valor_max">Valor Máximo:</label>
                                <div className="input-group">
                                    <span className="input-group-text">R$</span>
                                    <input
                                        type="number"
                                        id="valor_max"
                                        name="valor_max"
                                        value={formData.valor_max}
                                        onChange={handleChange}
                                        placeholder="999999.99"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                        Limpar Tudo
                    </button>
                </div>
            </form>

            {erro && <div className="erro-msg">{erro}</div>}

            {resultados.length > 0 ? (
                <div className="resultado-fatura">
                    <div className="resultados-header">
                        <h3 className='title-consulta'>
                            <i className="bi-list-check"></i> Resultados da Consulta
                        </h3>
                        
                        <div className="total-info">
                            <span className="total-badge">
                                {totalRegistros} {totalRegistros === 1 ? 'fatura' : 'faturas'}
                            </span>
                            {filtrosAtivos > 0 && (
                                <small className="filtros-ativos">
                                    <i className="bi-funnel"></i>
                                    {filtrosAtivos} filtro(s) ativo(s)
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="tabela-resultados">
                        <table className="tabela-faturas">
                            <thead>
                                <tr>
                                    <th>Fatura</th>
                                    <th>Apólice</th>
                                    <th>Prêmio Bruto</th>
                                    <th>Data Fatura</th>
                                    <th>Vencimento</th>
                                    <th>Status</th>
                                    <th>Vigência</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((fatura, index) => (
                                    <tr 
                                        key={`${fatura.FATURA || fatura.fatura}-${index}`} 
                                        onClick={() => handleVerDetalhe(fatura.FATURA || fatura.fatura)}
                                        className="linha-clicavel"
                                    >
                                        <td>
                                            <strong className="numero-fatura">
                                                #{fatura.FATURA || fatura.fatura}
                                            </strong>
                                        </td>
                                        <td>{fatura.APOLICE || fatura.apolice || '-'}</td>
                                        <td className="valor-premio">
                                            {formatarValor(fatura.PREMIO_BRUTO || fatura.premio_bruto)}
                                        </td>
                                        <td>{formatarData(fatura.DATA_FAT || fatura.data_fat)}</td>
                                        <td>
                                            <span className={`${new Date(fatura.VENCIMENTO || fatura.vencimento) < new Date() ? 'vencido' : ''}`}>
                                                {formatarData(fatura.VENCIMENTO || fatura.vencimento)}
                                            </span>
                                        </td>
                                        <td>{renderStatusBadge(fatura.STATUS || fatura.status)}</td>
                                        <td className="vigencia">
                                            {formatarData(fatura.DT_INI_VIG || fatura.dt_ini_vig)}
                                            <br/>
                                            até {formatarData(fatura.DT_FIM_VIG || fatura.dt_fim_vig)}
                                        </td>
                                    </tr>
                                ))}
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
                    <p>Buscando faturas...</p>
                </div>
            )}
        </div>
    );
};

export default ConsultaFaturaDinamicamente;