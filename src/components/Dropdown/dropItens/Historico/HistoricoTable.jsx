// pages/Historico/HistoricoTable.jsx
import React from 'react';
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
      <div className="empty-state">
        <i className="bi bi-inbox"></i>
        <p>Nenhuma consulta encontrada.</p>
      </div>
    );
  }

  return (
    <table className="historico-table">
      <thead>
        <tr>
          <th>Tipo de Consulta</th>
          <th>Parâmetro</th>
          <th>Realizada por</th>
          <th>Data</th>
          <th></th>
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
    </table>
  );
};

export default HistoricoTable;