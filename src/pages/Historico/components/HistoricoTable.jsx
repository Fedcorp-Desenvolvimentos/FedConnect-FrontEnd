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
  if (!consultas || consultas.length === 0) {
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
          {consultas.map((consulta) => {
            const id = consulta?.id ? String(consulta.id) : null;

            return (
              <HistoricoRow
                key={id}
                consulta={consulta}
                isExpanded={expandedId === id}
                onToggle={onToggle}
                detalhes={id ? detalhesMap?.[id] : null}
                detalhesLoading={id ? loadingMap?.[id] : false}
                detalhesError={id ? errorMap?.[id] : null}
              />
            );
          })}
        </tbody>
      </S.Table>
    </S.TableWrapper>
  );
};

export default HistoricoTable;