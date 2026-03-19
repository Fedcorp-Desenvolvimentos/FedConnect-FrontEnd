import { useState } from "react";
import Modal from "react-modal";
import { FiX, FiCopy, FiCheck } from "react-icons/fi";
import "../../styles/Modal.css";
import { ConsultaService } from "../../services/consultaService";
import { formatarData } from "../../utils/formatar_data";

const ConsultaModal = ({ isOpen, onClose, tipo }) => {
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    dataNascimento: "",
    motherName: "",
    fatherName: "",
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para resultados
  const [resultadoCpf, setResultadoCpf] = useState(null);
  const [resultadoChaves, setResultadoChaves] = useState(null);
  const [showResultado, setShowResultado] = useState(false);
  const [copiado, setCopiado] = useState({});

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "").substring(0, 11);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleCopy = (campo) => {
    setCopiado((prev) => ({ ...prev, [campo]: true }));
    setTimeout(() => {
      setCopiado((prev) => ({ ...prev, [campo]: false }));
    }, 1100);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResultadoCpf(null);
    setResultadoChaves(null);
    setShowResultado(false);

    let payload = {};
    let isFormValid = true;
    let validationErrorMessage = "";

    if (tipo === "cpf") {
      if (formData.cpf.length !== 11) {
        validationErrorMessage = "Por favor, insira um CPF válido com 11 dígitos.";
        isFormValid = false;
      } else {
        payload = {
          tipo_consulta: "cpf",
          parametro_consulta: formData.cpf,
        };
      }
    } else if (tipo === "chaves") {
      if (!formData.nome.trim()) {
        validationErrorMessage = "Por favor, preencha o campo Nome.";
        isFormValid = false;
      } else {
        let formattedBirthDate = "";
        if (formData.dataNascimento) {
          const [year, month, day] = formData.dataNascimento.split("-");
          const localDate = new Date(year, month - 1, day);
          formattedBirthDate = localDate.toLocaleDateString("pt-BR");
        }

        payload = {
          tipo_consulta: "cpf_alternativa",
          parametro_consulta: JSON.stringify({
            Datasets: "basic_data",
            q: `name{${formData.nome}}, birthdate{${formattedBirthDate}},dateformat{dd/MM/yyyy}, mothername{${formData.motherName}}, fathername{${formData.fatherName}}`,
            Limit: 5,
          }),
        };
      }
    }

    if (!isFormValid) {
      setError(validationErrorMessage);
      setLoading(false);
      return;
    }

    try {
      const response = await ConsultaService.realizarConsulta(payload);
      const apiData = response?.data ?? response;

      const apiStatus = apiData?.resultado_api?.Status?.api || apiData?.Status?.api;
      
      if (Array.isArray(apiStatus) && apiStatus[0]?.Code === -128) {
        setError("Erro na base de consulta, tente novamente mais tarde");
      } else {
        if (tipo === "cpf" && apiData?.resultado_api?.Result?.[0]) {
          setResultadoCpf(apiData.resultado_api.Result[0].BasicData);
          setShowResultado(true);
        } else if (tipo === "chaves" && apiData?.resultado_api?.Result?.length > 0) {
          setResultadoChaves(apiData.resultado_api.Result);
          setShowResultado(true);
        } else {
          setError("Nenhum resultado encontrado");
        }
      }
    } catch (err) {
      const friendly = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Erro ao realizar consulta.";
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowResultado(false);
    setResultadoCpf(null);
    setResultadoChaves(null);
    setError(null);
  };

  const renderForm = () => {
    if (tipo === "cpf") {
      return (
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="cpf-input">Digite o CPF:</label>
            <input
              type="text"
              id="cpf-input"
              name="cpf"
              value={formData.cpf}
              onChange={handleFormChange}
              placeholder="Digite o CPF (apenas números)"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? "Consultando..." : "Consultar"}
            </button>
          </div>
        </form>
      );
    }

    if (tipo === "chaves") {
      return (
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="nome">
              Nome <span className="obrigatorio">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleFormChange}
              placeholder="Digite o nome"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleFormChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleFormChange}
              disabled={loading}
            >
              <option value="">Selecione uma região</option>
              <option value="DF-GO-MS-MT-TO">DF, GO, MS, MT, TO</option>
              <option value="AC-AM-AP-PA-RO-RR">AC, AM, AP, PA, RO, RR</option>
              <option value="CE-MA-PI">CE, MA, PI</option>
              <option value="AL-PB-PE-RN">AL, PB, PE, RN</option>
              <option value="BA-SE">BA, SE</option>
              <option value="MG">MG</option>
              <option value="ES-RJ">ES, RJ</option>
              <option value="SP">SP</option>
              <option value="PR-SC">PR, SC</option>
              <option value="RS">RS</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="motherName">Nome da Mãe</label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleFormChange}
              placeholder="Digite o nome da mãe"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !formData.nome.trim()}
            >
              {loading ? "Consultando..." : "Consultar"}
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  const getTitle = () => {
    if (showResultado) {
      return tipo === "cpf" ? "Resultado da Consulta CPF" : "Resultados Encontrados";
    }
    return tipo === "cpf" ? "Consulta por CPF" : "Consulta por Chaves Alternativas";
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content modal-consulta"
      overlayClassName="modal-overlay"
      contentLabel={getTitle()}
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
    >
      <div className="modal-header">
        <h3>{getTitle()}</h3>
        <button className="modal-close-btn" onClick={onClose} title="Fechar">
          <FiX size={20} />
        </button>
      </div>
      
      <div className="modal-body">
        {!showResultado ? (
          renderForm()
        ) : (
          <>
            {tipo === "cpf" && resultadoCpf && (
              <div className="modal-resultado">
                <button className="btn-back" onClick={handleBack}>
                  ← Nova Consulta
                </button>
                <ResultadoCpfModalContent 
                  data={resultadoCpf} 
                  copiado={copiado} 
                  onCopy={handleCopy}
                />
              </div>
            )}

            {tipo === "chaves" && resultadoChaves && (
              <div className="modal-resultado">
                <button className="btn-back" onClick={handleBack}>
                  ← Nova Consulta
                </button>
                <ResultadoChavesModalContent 
                  results={resultadoChaves} 
                  formatarData={formatarData}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

// Componente interno para resultado CPF
const ResultadoCpfModalContent = ({ data, copiado, onCopy }) => {
  const copyToClipboard = (texto, campo) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    onCopy(campo);
  };

  return (
    <>
      <div className="input-copy-group">
        <label>Nome Completo:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.Name || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.Name, "modal_nome")}>
            {copiado.modal_nome ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>CPF:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.TaxIdNumber || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.TaxIdNumber, "modal_cpf")}>
            {copiado.modal_cpf ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Situação Cadastral:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.TaxIdStatus || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.TaxIdStatus, "modal_situacao")}>
            {copiado.modal_situacao ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Data de Nascimento:</label>
        <div className="copy-wrapper">
          <input type="text" value={formatarData(data.BirthDate)} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(formatarData(data.BirthDate), "modal_nascimento")}>
            {copiado.modal_nascimento ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Idade:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.Age || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.Age, "modal_idade")}>
            {copiado.modal_idade ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Nome da Mãe:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.MotherName || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.MotherName, "modal_mae")}>
            {copiado.modal_mae ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Gênero:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.Gender || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.Gender, "modal_genero")}>
            {copiado.modal_genero ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Nome Comum:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.Aliases?.CommonName || "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(data.Aliases?.CommonName, "modal_alias")}>
            {copiado.modal_alias ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>

      <div className="input-copy-group">
        <label>Indicação de Óbito:</label>
        <div className="copy-wrapper">
          <input type="text" value={data.HasObitIndication !== undefined ? (data.HasObitIndication ? "Sim" : "Não") : "N/A"} readOnly />
          <button className="copy-btn" onClick={() => copyToClipboard(
            data.HasObitIndication !== undefined ? (data.HasObitIndication ? "Sim" : "Não") : "N/A", "modal_obito"
          )}>
            {copiado.modal_obito ? <FiCheck color="#20bf55" /> : <FiCopy />}
          </button>
        </div>
      </div>
    </>
  );
};

// Componente interno para resultado Chaves
const ResultadoChavesModalContent = ({ results }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setSelectedIndex(selectedIndex === idx ? null : idx);
  };

  return (
    <div className="modal-resultado-chaves">
      <table className="modal-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Nascimento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr
                className={selectedIndex === idx ? "active-row" : ""}
                onClick={() => toggleExpand(idx)}
              >
                <td>{item.BasicData?.Name || "N/A"}</td>
                <td>{item.BasicData?.TaxIdNumber || "N/A"}</td>
                <td>{formatarData(item.BasicData?.BirthDate)}</td>
                <td>
                  <i className={`bi bi-chevron-${selectedIndex === idx ? "up" : "down"}`}></i>
                </td>
              </tr>
              {selectedIndex === idx && (
                <tr>
                  <td colSpan="4">
                    <div className="modal-detalhes">
                      <p><strong>Nome da Mãe:</strong> {item.BasicData?.MotherName || "N/A"}</p>
                      <p><strong>Gênero:</strong> {item.BasicData?.Gender || "N/A"}</p>
                      <p><strong>Idade:</strong> {item.BasicData?.Age || "N/A"}</p>
                      <p><strong>Situação:</strong> {item.BasicData?.TaxIdStatus || "N/A"}</p>
                      <p><strong>Alias:</strong> {item.BasicData?.Aliases?.CommonName || "N/A"}</p>
                      <p><strong>Óbito:</strong> {
                        item.BasicData?.HasObitIndication !== undefined
                          ? item.BasicData.HasObitIndication ? "Sim" : "Não"
                          : "N/A"
                      }</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultaModal;