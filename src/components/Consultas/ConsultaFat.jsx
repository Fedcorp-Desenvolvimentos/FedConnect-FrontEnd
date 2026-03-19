import { useEffect, useState } from 'react';
import "../../styles/ConsultaFat.css";
import { getFaturaPorNumero } from '../../services/consultaFatura';
import { getAdministradoraEspecificaPorCodigo } from '../../services/consultaAdmService';

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
    const [administradora, setAdministradora] = useState(null);

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
            // console.log("resposta", resposta);

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

    useEffect(() => {
        const buscarNomeAdministradora = async () => {
            try {
                const adm = await getAdministradoraEspecificaPorCodigo(resultado.ADMINISTRADORA);

                if (adm?.sucesso && adm.data) {
                    const nome = adm.data.NOME_ADM || adm.data.nome_adm || `Código: ${resultado.ADMINISTRADORA}`;
                    setAdministradora(nome);
                } else {
                    setAdministradora(`Código: ${resultado.ADMINISTRADORA}`);
                }
            } catch (error) {
                console.error("Erro ao recuperar administradora:", error);
                setAdministradora(`Código: ${resultado.ADMINISTRADORA} (erro ao buscar)`);
            }
        };

        if (resultado) {
            buscarNomeAdministradora();
        }
    }, [resultado]);

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
                        {/* tratar exibição do nome da adm */}
                        <div className="campo longo">
                            <strong>Administradora:</strong>
                            <span>{administradora || resultado.ADMINISTRADORA || '-'}</span>
                        </div>

                        <div className="campo">
                            <strong>Apólice:</strong> {resultado.APOLICE || '-'}
                        </div>

                        {/* <div className="campo">
                            <strong>Seguradora:</strong> {resultado.SEGURADORA || '-'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Ramo:</strong> {resultado.RAMO || '-'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Cedente:</strong> {resultado.CEDENTE || '-'}
                        </div> */}
{/* tratar exibição do nome do coretor */}
                        <div className="campo">
                            <strong>Corretor:</strong> {resultado.CORRETOR || '-'}
                        </div>

                        <div className="campo">
                            <strong>Corretor 2:</strong> {resultado.CORRETOR2 || '-'}
                        </div>


                        <div className="campo">
                            <strong>Comissão:</strong> {formatarValor(resultado.COMISSAO)}%
                        </div>

                        <div className="campo">
                            <strong>Comissão 2:</strong> {formatarValor(resultado.COMISSAO2)}%
                        </div>

                        <div className="campo">
                            <strong>Prêmio Bruto:</strong> R$ {formatarValor(resultado.PREMIO_BRUTO)}
                        </div>

                        {/* <div className="campo">
                            <strong>Prêmio Líquido:</strong> R$ {formatarValor(resultado.PREMIO_LIQ)}
                        </div>

                        <div className="campo">
                            <strong>Comissão Líquida:</strong> R$ {formatarValor(resultado.COMISSAO_LIQ)}
                        </div>

                        <div className="campo">
                            <strong>Comissão Líquida 2:</strong> R$ {formatarValor(resultado.COMISSAO_LIQ2)}
                        </div>

                        <div className="campo">
                            <strong>Desconto Comissão:</strong> R$ {formatarValor(resultado.DESC_COMISSAO)}
                        </div>

                        <div className="campo">
                            <strong>Desconto Comissão 2:</strong> R$ {formatarValor(resultado.DESC_COMISSAO2)}
                        </div>

                        <div className="campo">
                            <strong>IOF:</strong> R$ {formatarValor(resultado.IOF)}
                        </div>

                        <div className="campo">
                            <strong>Acréscimo:</strong> R$ {formatarValor(resultado.ACRESCIMO)}
                        </div>

                        <div className="campo">
                            <strong>Ajustes:</strong> R$ {formatarValor(resultado.AJUSTES)}
                        </div>

                        <div className="campo">
                            <strong>Devolução:</strong> R$ {formatarValor(resultado.DEVOLUCAO)}
                        </div>

                        <div className="campo">
                            <strong>Capital Total:</strong> R$ {formatarValor(resultado.CAPITAL_TOTAL)}
                        </div>
 */}
                        <div className="campo">
                            <strong>Data da Fatura:</strong> {formatarData(resultado.DATA_FAT)}
                        </div>

                        <div className="campo">
                            <strong>Vencimento:</strong> {formatarData(resultado.VENCIMENTO)}
                        </div>

                        <div className="campo">
                            <strong>Data Repasse:</strong> {formatarData(resultado.DATA_REPASSE)}
                        </div>
{/* tratar para ativo ou cancelado */}
                        <div className="campo">
                            <strong>Status:</strong>
                            <span className="status-badge">
                                {resultado.STATUS || 'Indefinido'}
                            </span>
                        </div>

                        {/* <div className="campo">
                            <strong>Tipo Fatura:</strong> {resultado.TIPO_FAT || '-'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Parcelas:</strong> {resultado.PARCELAS || '1'}
                        </div>

                        <div className="campo">
                            <strong>Quantidade Itens:</strong> {resultado.QTD_ITENS || '1'}
                        </div>

                        <div className="campo">
                            <strong>Contabiliza:</strong> {resultado.CONTABILIZA === 'S' ? 'Sim' : 'Não'}
                        </div> */}

                        <div className="campo">
                            <strong>Início Vigência:</strong> {formatarData(resultado.DT_INI_VIG)}
                        </div>

                        <div className="campo">
                            <strong>Fim Vigência:</strong> {formatarData(resultado.DT_FIM_VIG)}
                        </div>
{/* 
                        <div className="campo">
                            <strong>Endosso:</strong> {resultado.ENDOSSO || '-'}
                        </div>

                        <div className="campo">
                            <strong>Sequência:</strong> {resultado.SEQ || '1'}
                        </div>

                        <div className="campo">
                            <strong>Sequência Endosso:</strong> {resultado.SEQ_ENDOSSO || '0'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Nosso Número:</strong> {resultado.NOSSO_NUMERO || '-'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Voucher:</strong> {resultado.VOUCHER || '-'}
                        </div> */}

                        {/* <div className="campo">
                            <strong>Fatura Reajuste:</strong> {resultado.FATURA_REAJUSTE === 'S' ? 'Sim' : 'Não'}
                        </div>

                        <div className="campo">
                            <strong>Tipo Comissão:</strong> {resultado.TIPO_COMISSAO || '-'}
                        </div>

                        <div className="campo">
                            <strong>Tipo Comissão 2:</strong> {resultado.TIPO_COMISSAO2 || '-'}
                        </div>

                        <div className="campo">
                            <strong>Total Segurados:</strong> {resultado.TOTAL_SEG || '0'}
                        </div>

                        <div className="campo">
                            <strong>Valor Bruto Assistência:</strong> R$ {formatarValor(resultado.VALOR_BR_ASSIST)}
                        </div>

                        <div className="campo">
                            <strong>Fatura Externa:</strong> {resultado.OUT_FAT || '-'}
                        </div>

                        <div className="campo">
                            <strong>Usuário Cadastro:</strong> {resultado.USUARIO_CAD || '-'}
                        </div>

                        <div className="campo">
                            <strong>Boleta Recebida:</strong> R$ {formatarValor(resultado.BOLETA_REC)}
                        </div>

                        <div className="campo">
                            <strong>Boleta Quitada:</strong> {resultado.BOLETA_QUITADA === 'S' ? 'Sim' : 'Não'}
                        </div>

                        <div className="campo">
                            <strong>Valor Quitado:</strong> R$ {formatarValor(resultado.VALOR_QUITADO)}
                        </div> */}

                        <div className="campo">
                            <strong>Data Baixa:</strong> {formatarData(resultado.DT_BAIXA)}
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