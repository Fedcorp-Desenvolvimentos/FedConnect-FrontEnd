import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../styles/ConsultaFat.css";
import { formatarData } from "../../utils/formatar_data";
import { 
  FiArrowLeft, 
  FiFileText, 
  FiAlertCircle,
} from "react-icons/fi";
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
    return "Erro ao carregar detalhes da fatura. Por favor, tente novamente.";
}

const ConsultaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fatura, setFatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faturasList, setFaturasList] = useState([]);

  useEffect(() => {
    const recuperaFaturaPorNumero = async () => {
      try {
        setLoading(true);
        const response = await getFaturaPorNumero(id);
        
        if (response.sucesso) {
          if (Array.isArray(response.data)) {
            setFaturasList(response.data);
            setFatura(response.data[0] || null);
          } else {
            setFatura(response.data);
            setFaturasList([response.data]);
          }
        } else {
          setError(response.erro || 'Fatura não encontrada');
        }
      } catch (error) {
        console.error("LOCAL - Falha ao processar fatura POR NUMERO", error);
        setError(traduzirErroApi(error.message));
      } finally {
        setLoading(false);
      }
    };
    
    recuperaFaturaPorNumero();
  }, [id]);

  const formatarValor = (valor) => {
    if (!valor || valor === "0") return 'R$ 0,00';
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const formatarStatus = (status) => {
    const statusMap = {
      'A': { label: 'Ativa', className: 'status-ativa' },
      'C': { label: 'Cancelada', className: 'status-cancelada' },
      'P': { label: 'Pendente', className: 'status-pendente' },
      'Q': { label: 'Quitada', className: 'status-quitada' },
      'N': { label: 'Inativa', className: 'status-inativa' }
    };
    return statusMap[status] || { label: status || 'Desconhecido', className: 'status-desconhecida' };
  };

  const renderizarInformacoesFatura = () => {
    if (!fatura) return null;

    const statusInfo = formatarStatus(fatura.STATUS);

    return (
      <div className="resultado-fatura detalhe-fatura">
        <div className="cabecalho-detalhe">
          <button 
            className="btn-voltar"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> Voltar
          </button>
          <div className="titulo-detalhe">
            <h3 className='title-consulta'>
              <FiFileText /> Fatura #{fatura.FATURA}
            </h3>
            <span className={`status-badge ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="resultado-dados">
          {/* Coluna 1 - Dados Principais */}
          <div className="campo"><strong>Número da Fatura:</strong> {fatura.FATURA}</div>
          <div className="campo"><strong>Apólice:</strong> {fatura.APOLICE}</div>
          <div className="campo"><strong>Endosso:</strong> {fatura.ENDOSSO || 'N/A'}</div>
          <div className="campo"><strong>Sequência:</strong> {fatura.SEQ}</div>
          <div className="campo"><strong>Usuário Cadastro:</strong> {fatura.USUARIO_CAD}</div>
          
          {/* Coluna 2 - Valores */}
          <div className="campo"><strong>Prêmio Bruto:</strong> {formatarValor(fatura.PREMIO_BRUTO)}</div>
          <div className="campo"><strong>Prêmio Líquido:</strong> {formatarValor(fatura.PREMIO_LIQ)}</div>
          <div className="campo"><strong>Comissão:</strong> {formatarValor(fatura.COMISSAO)}</div>
          <div className="campo"><strong>IOF:</strong> {formatarValor(fatura.IOF)}</div>
          <div className="campo"><strong>Parcelas:</strong> {fatura.PARCELAS}</div>
          
          {/* Coluna 3 - Datas */}
          <div className="campo"><strong>Data Fatura:</strong> {formatarData(fatura.DATA_FAT)}</div>
          <div className="campo"><strong>Vencimento:</strong> {formatarData(fatura.VENCIMENTO)}</div>
          <div className="campo"><strong>Início Vigência:</strong> {formatarData(fatura.DT_INI_VIG)}</div>
          <div className="campo"><strong>Fim Vigência:</strong> {formatarData(fatura.DT_FIM_VIG)}</div>
          <div className="campo"><strong>Data Repasse:</strong> {formatarData(fatura.DATA_REPASSE)}</div>
        </div>

        {/* Informações Adicionais */}
        <div className="informacoes-adicionais">
          <h4>Informações Adicionais</h4>
          <div className="grid-adicionais">
            <div className="item-adicional">
              <span className="label-adicional">Seguradora:</span>
              <span className="valor-adicional">{fatura.SEGURADORA}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Administradora:</span>
              <span className="valor-adicional">{fatura.ADMINISTRADORA}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Ramo:</span>
              <span className="valor-adicional">{fatura.RAMO}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Cedente:</span>
              <span className="valor-adicional">{fatura.CEDENTE}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Tipo Fatura:</span>
              <span className="valor-adicional">{fatura.TIPO_FAT}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Boleta Recebida:</span>
              <span className="valor-adicional">{fatura.BOLETA_REC}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Voucher:</span>
              <span className="valor-adicional">{fatura.VOUCHER}</span>
            </div>
            <div className="item-adicional">
              <span className="label-adicional">Nosso Número:</span>
              <span className="valor-adicional">{fatura.NOSSO_NUMERO}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderizarListaFaturas = () => {
    if (faturasList.length <= 1) return null;

    return (
      <div className="lista-faturas">
        <h4 className="titulo-lista">
          <FiFileText /> Todas as Faturas ({faturasList.length})
        </h4>
        <div className="tabela-lista">
          <table className="tabela-faturas">
            <thead>
              <tr>
                <th>Número</th>
                <th>Apólice</th>
                <th>Prêmio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {faturasList.map((faturaItem, index) => (
                <tr 
                  key={index} 
                  className={`linha-lista ${faturaItem.FATURA === fatura?.FATURA ? 'ativo' : ''}`}
                  onClick={() => setFatura(faturaItem)}
                >
                  <td>{faturaItem.FATURA}</td>
                  <td>{faturaItem.APOLICE}</td>
                  <td className="valor-premio">{formatarValor(faturaItem.PREMIO_BRUTO)}</td>
                  <td>
                    <span className={`status-badge ${formatarStatus(faturaItem.STATUS).className}`}>
                      {formatarStatus(faturaItem.STATUS).label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="consulta-fatura-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando detalhes da fatura...</p>
        </div>
      </div>
    );
  }

  if (error || (!fatura && faturasList.length === 0)) {
    return (
      <div className="consulta-fatura-container">
        <h1 className="consultas-title">
          <i className="bi-clipboard-data"></i> Detalhes da Fatura
        </h1>
        
        <div className="erro-container">
          <div className="icone-erro">
            <FiAlertCircle />
          </div>
          <h3>Erro ao carregar</h3>
          <p>{error || 'Fatura não encontrada'}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="consulta-fatura-container">
      <h1 className="consultas-title">
        <i className="bi-clipboard-data"></i> Detalhes da Fatura
      </h1>
      
      {renderizarInformacoesFatura()}
      {renderizarListaFaturas()}
    </div>
  );
};

export default ConsultaDetalhe;