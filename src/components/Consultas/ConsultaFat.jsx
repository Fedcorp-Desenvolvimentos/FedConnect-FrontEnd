import { useState } from 'react';
import "../styles/ConsultaFat.css";
import { getFaturaPorNumero } from '../../services/consultaFatura';

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
    return mensagem;
}

const ConsultaFatura = () => {
    const [fatura, setFatura] = useState('');
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConsulta = async (e) => {
        e.preventDefault();
        setErro('');
        setResultado(null);

        if (!fatura) {
            setErro('Preencha o número da fatura para consultar.');
            return;
        }

        setLoading(true);

        try {
            const resposta = await getFaturaPorNumero(fatura);
            console.log("resposta", resposta);

            if (resposta?.sucesso && Array.isArray(resposta.data) && resposta.data.length > 0) {
                setResultado(resposta.data[0]);
            } else {
                setErro('Nenhuma fatura encontrada com o número informado.');
            }
        } catch (err) {
            const msgErro =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                'Erro ao consultar faturas.';
            setErro(traduzirErroApi(msgErro));
        } finally {
            setLoading(false);
        }
    };

    const formatarValor = (valor) => {
        if (valor === null || valor === undefined) return '-';
        return Number(valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatarData = (dataString) => {
        if (!dataString) return '-';
        const [year, month, day] = dataString.split('-');
        if (!year || !month || !day) return '-';
        return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
    };

    return (
        <div className="consulta-fatura-container">
            <h1 className="consultas-title">
                <i className="bi-clipboard-data"></i> Consulta de Faturas
            </h1>

            <form className="form-fatura" onSubmit={handleConsulta}>
                <div className="form-group">
                    <label htmlFor="fatura">Fatura:</label>
                    <input
                        type="text"
                        id="fatura"
                        value={fatura}
                        onChange={(e) => setFatura(e.target.value)}
                        placeholder="Digite o número da fatura"
                    />
                </div>

                {erro && <div className="erro-msg">{erro}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>
            </form>

            {resultado && (
                <div className="resultado-fatura">
                    <h3 className="title-consulta">Fatura #{resultado.FATURA}</h3>

                    <div className="resultado-dados">
                        <div className="campo longo">
                            <strong>Administradora:</strong>
                            <span>{resultado.ADMINISTRADORA || '-'}</span>
                        </div>

                        <div className="campo">
                            <strong>Apólice:</strong> {resultado.APOLICE || '-'}
                        </div>

                        <div className="campo">
                            <strong>Prêmio Bruto:</strong> R$ {formatarValor(resultado.PREMIO_BRUTO)}
                        </div>

                        <div className="campo">
                            <strong>Prêmio Líquido:</strong> R$ {formatarValor(resultado.PREMIO_LIQ)}
                        </div>

                        <div className="campo">
                            <strong>Comissão:</strong> {formatarValor(resultado.COMISSAO)}%
                        </div>

                        <div className="campo">
                            <strong>Data da Fatura:</strong> {formatarData(resultado.DATA_FAT)}
                        </div>

                        <div className="campo">
                            <strong>Vencimento:</strong> {formatarData(resultado.VENCIMENTO)}
                        </div>

                        <div className="campo">
                            <strong>Status:</strong>
                            <span className="status-badge">
                                {resultado.STATUS || 'Indefinido'}
                            </span>
                        </div>

                        <div className="campo">
                            <strong>Início Vigência:</strong> {formatarData(resultado.DT_INI_VIG)}
                        </div>

                        <div className="campo">
                            <strong>Fim Vigência:</strong> {formatarData(resultado.DT_FIM_VIG)}
                        </div>

                        {resultado.DT_CANCEL && (
                            <div className="campo longo">
                                <strong>Cancelamento:</strong>
                                {formatarData(resultado.DT_CANCEL)}
                                {resultado.OBS_CANCEL && (
                                    <span style={{ marginLeft: 8, color: "#d21a1a" }}>
                                        ({resultado.OBS_CANCEL})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultaFatura;
