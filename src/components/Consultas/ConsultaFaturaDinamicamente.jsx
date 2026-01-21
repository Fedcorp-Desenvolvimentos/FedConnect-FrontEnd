import React, { useState } from 'react';
import "../styles/ConsultaFat.css";
import { getFaturaDinamicamente } from '../../services/consultaFatura';
import "../../components/styles/ConsultaDinamica.css";

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
            } else {
                setErro(response.erro || 'Nenhuma fatura encontrada');
                setResultados([]);
            }
        } catch (err) {
            setErro(err.message || 'Erro ao consultar faturas. Tente novamente.');
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
            'A': 'success',
            'C': 'danger',
            'P': 'warning',
            'Q': 'info'
        };
        
        const textos = {
            'A': 'Ativa',
            'C': 'Cancelada',
            'P': 'Pendente',
            'Q': 'Quitada'
        };
        
        return (
            <span className={`status-badge badge-${cores[status] || 'secondary'}`}>
                {textos[status] || status}
            </span>
        );
    };

    // Contar filtros ativos
    const filtrosAtivos = Object.values(formData).filter(
        valor => valor && valor.toString().trim() !== ''
    ).length;

    return (
        <div className="consulta-fatura-container">
            <div className="page-header">
                <h1 className="consultas-title">
                    <i className="bi bi-clipboard-data me-2"></i>Consulta de Faturas
                </h1>
                {resultados.length > 0 && (
                    <div className="total-info">
                        <span className="badge bg-primary">
                            {totalRegistros} {totalRegistros === 1 ? 'fatura' : 'faturas'}
                        </span>
                    </div>
                )}
            </div>

            <div className="content-wrapper">
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

                    <div className='group-btn-wrapper'>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-toggle-filtros"
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        >
                        <i className={`bi bi-${mostrarFiltros ? 'chevron-up' : 'chevron-down'} me-2`}></i>
                            {mostrarFiltros ? 'Menos Filtros' : 'Mais Filtros'}
                            {filtrosAtivos > 0 && (
                                <span className="badge bg-primary ms-2">{filtrosAtivos}</span>
                            )}
                        </button>
                    </div>

                    {mostrarFiltros && (
                        <div className="filtros-avancados slide-down">
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
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Consultando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-search me-2"></i>
                                    Consultar
                                </>
                            )}
                        </button>

                        <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={handleLimparFiltros}
                            disabled={loading}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Limpar Tudo
                        </button>
                    </div>
                </form>

                {erro && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {erro}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setErro('')}
                        ></button>
                    </div>
                )}

                {resultados.length > 0 ? (
                    <div className="resultados-wrapper">
                        <div className="resultados-header">
                            <h5 className='resultados-icon'>
                                <i className="bi bi-list-check me-2"></i>
                                Resultados da Consulta
                            </h5>
                            
                            {filtrosAtivos > 0 && (
                                <small className="text-muted">
                                    <i className="bi bi-funnel me-1"></i>
                                    {filtrosAtivos} filtro(s) ativo(s)
                                </small>
                            )}
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-hover table-striped">
                                <thead className="table-light">
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
                                        <tr key={`${fatura.fatura}-${index}`}>
                                            <td>
                                                <strong className="text-primary">#{fatura.fatura}</strong>
                                            </td>
                                            <td>{fatura.apolice || '-'}</td>
                                            <td className="fw-bold">{formatarValor(fatura.premio_bruto)}</td>
                                            <td>{formatarData(fatura.data_fat)}</td>
                                            <td>
                                                <span className={`${new Date(fatura.vencimento) < new Date() ? 'text-danger' : ''}`}>
                                                    {formatarData(fatura.vencimento)}
                                                </span>
                                            </td>
                                            <td>{renderStatusBadge(fatura.status)}</td>
                                            <td>
                                                <small>
                                                    {formatarData(fatura.dt_ini_vig)}<br/>
                                                    até {formatarData(fatura.dt_fim_vig)}
                                                </small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : !loading && !erro && resultados.length === 0 && (
                    <div className="nenhum-resultado text-center py-5">
                        <div className="mb-4">
                            <i className="bi bi-search display-4 text-muted"></i>
                        </div>
                        <h5 className="text-muted mb-2">Nenhuma consulta realizada</h5>
                        <p className="text-muted mb-0">
                            Preencha os filtros e clique em "Consultar" para buscar faturas
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="text-muted">Buscando faturas...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultaFaturaDinamicamente;