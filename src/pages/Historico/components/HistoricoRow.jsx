import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import * as S from '../HistoricoStyles';
import DetalhesConsulta from './DetalhesConsulta';
import { getParametroDisplay, formatDate } from '../utils/historicoUtils';

const HistoricoRow = ({ 
  consulta, 
  isExpanded, 
  onToggle,
  detalhes,
  detalhesLoading,
  detalhesError 
}) => {
  const handleClick = () => onToggle(consulta.id);

  return (
    <React.Fragment>
      <tr 
        className={isExpanded ? 'active-row' : ''}
        onClick={handleClick}
      >
        <td>{consulta.tipo_consulta_display || consulta.tipo_consulta}</td>
        <td>{getParametroDisplay(consulta)}</td>
        <td>{consulta.usuario_email || 'N/A'}</td>
        <td>{formatDate(consulta.data_consulta)}</td>
        <S.ExpandIcon>
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </S.ExpandIcon>
      </tr>
      
      {isExpanded && (
        <S.DetalhesRow>
          <td colSpan="5">
            <S.DetalhesPanel>
              <DetalhesConsulta
                consulta={consulta}
                detalhes={detalhes}
                loading={detalhesLoading}
                error={detalhesError}
              />
            </S.DetalhesPanel>
          </td>
        </S.DetalhesRow>
      )}
    </React.Fragment>
  );
};

export default HistoricoRow;