import { FiCopy, FiCheck } from "react-icons/fi";
import BaseModal from "../Modal/BaseModal";
import { formatarData } from "../../utils/formatar_data";
import "../../styles/Modal.css";

const ResultadoCpfModal = ({ isOpen, onClose, data, copiado, onCopy }) => {
  if (!data) return null;

  const copyToClipboard = (texto, campo) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    onCopy(campo);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Resultado da Consulta CPF"
      size="lg"
    >
      <div className="modal-resultado">
        <div className="input-copy-group">
          <label>Nome Completo:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.Name || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.Name, "modal_nome")}
              title="Copiar"
            >
              {copiado.modal_nome ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>CPF:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.TaxIdNumber || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.TaxIdNumber, "modal_cpf")}
              title="Copiar"
            >
              {copiado.modal_cpf ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Situação Cadastral:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.TaxIdStatus || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.TaxIdStatus, "modal_situacao")}
              title="Copiar"
            >
              {copiado.modal_situacao ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Data de Nascimento:</label>
          <div className="copy-wrapper">
            <input type="text" value={formatarData(data.BirthDate)} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(formatarData(data.BirthDate), "modal_nascimento")}
              title="Copiar"
            >
              {copiado.modal_nascimento ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Idade:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.Age || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.Age, "modal_idade")}
              title="Copiar"
            >
              {copiado.modal_idade ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Nome da Mãe:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.MotherName || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.MotherName, "modal_mae")}
              title="Copiar"
            >
              {copiado.modal_mae ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Gênero:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.Gender || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.Gender, "modal_genero")}
              title="Copiar"
            >
              {copiado.modal_genero ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Nome Comum:</label>
          <div className="copy-wrapper">
            <input type="text" value={data.Aliases?.CommonName || "N/A"} readOnly />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(data.Aliases?.CommonName, "modal_alias")}
              title="Copiar"
            >
              {copiado.modal_alias ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="input-copy-group">
          <label>Indicação de Óbito:</label>
          <div className="copy-wrapper">
            <input
              type="text"
              value={data.HasObitIndication !== undefined ? (data.HasObitIndication ? "Sim" : "Não") : "N/A"}
              readOnly
            />
            <button 
              className="copy-btn" 
              onClick={() => copyToClipboard(
                data.HasObitIndication !== undefined ? (data.HasObitIndication ? "Sim" : "Não") : "N/A", 
                "modal_obito"
              )}
              title="Copiar"
            >
              {copiado.modal_obito ? <FiCheck color="#20bf55" /> : <FiCopy />}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ResultadoCpfModal;