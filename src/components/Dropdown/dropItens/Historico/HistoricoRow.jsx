// pages/Historico/HistoricoRow.jsx
import React from 'react';
import { formatDate, getParametroDisplay } from './utils/historicoUtils';
import DetalhesConsulta from './DetalhesConsulta';

const HistoricoRow = ({ 
  consulta, 
  isExpanded, 
  onToggle,
  detalhes,
  detalhesLoading,
  detalhesError 
}) => {
  return (
    <React.Fragment>
      <tr 
        className={isExpanded ? 'active-row' : ''}
        onClick={() => onToggle(consulta.id)}
        style={{ cursor: 'pointer' }}
      >
        <td data-label="Tipo de Consulta">
          {consulta.tipo_consulta_display || consulta.tipo_consulta}
        </td>
        <td data-label="Parâmetro">
          {getParametroDisplay(consulta)}
        </td>
        <td data-label="Realizada por">
          {consulta.usuario_email || 'N/A'}
        </td>
        <td data-label="Data">
          {formatDate(consulta.data_consulta)}
        </td>
        <td data-label="" className="expand-icon">
          <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="detalhes-row">
          <td colSpan="5">
            <div className="detalhes-historico-panel">
              <DetalhesConsulta
                consulta={consulta}
                detalhes={detalhes}
                loading={detalhesLoading}
                error={detalhesError}
              />
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default HistoricoRow;