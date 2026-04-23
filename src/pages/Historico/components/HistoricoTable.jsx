import React from 'react';
import { FaInbox } from 'react-icons/fa';
import * as S from '../HistoricoStyles';
import HistoricoRow from './HistoricoRow';

const HistoricoTable = ({ 
  consultas, 
  expandedId, 
  onToggle,
  detalhesMap,
  loadingMap,
  errorMap
}) => {
  if (consultas.length === 0) {
    return (
      <S.EmptyState>
        <FaInbox />
        <p>Nenhuma consulta encontrada.</p>
      </S.EmptyState>
    );
  }

  return (
    <S.TableWrapper>
      <S.Table>
        <thead>
          <tr>
            <th>Tipo de Consulta</th>
            <th>Parâmetro</th>
            <th>Realizada por</th>
            <th>Data</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => (
            <HistoricoRow
              key={consulta.id}
              consulta={consulta}
              isExpanded={expandedId === consulta.id}
              onToggle={onToggle}
              detalhes={detalhesMap[consulta.id]}
              detalhesLoading={loadingMap[consulta.id]}
              detalhesError={errorMap[consulta.id]}
            />
          ))}
        </tbody>
      </S.Table>
    </S.TableWrapper>
  );
};

export default HistoricoTable;