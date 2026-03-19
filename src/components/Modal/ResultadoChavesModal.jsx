import { useState } from "react";
import { formatarData } from "../../utils/formatar_data";
import BaseModal from "../Modal/BaseModal";
import "../../styles/Modal.css";

const ResultadoChavesModal = ({ isOpen, onClose, results }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!results || results.length === 0) return null;

  const toggleExpand = (idx) => {
    setSelectedIndex(selectedIndex === idx ? null : idx);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resultados Encontrados (${results.length})`}
      size="xl"
    >
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
                  style={{ cursor: "pointer" }}
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
    </BaseModal>
  );
};

export default ResultadoChavesModal;