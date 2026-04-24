import React from 'react';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import * as S from '../ComercialStyles';

function formatDateBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function getComercialName(v) {
  const r = v?.responsavel;
  if (!r) return "";
  return r.nome_completo || r.username || r.nome || "";
}

export default function KanbanVisitas({ visitas, onCardClick }) {
  const statusColors = {
    agendado: { label: "Agendada", color: "#f59e0b", bg: "#fffbeb" },
    realizada: { label: "Realizada", color: "#10b981", bg: "#ecfdf5" },
    cancelada: { label: "Cancelada", color: "#ef4444", bg: "#fef2f2" }
  };

  const statusValues = ["agendado", "realizada", "cancelada"];

  return (
    <S.KanbanContainer>
      {statusValues.map(status => {
        const statusVisitas = visitas.filter(v => v?.status === status);
        const statusInfo = statusColors[status];

        return (
          <S.KanbanColumn key={status}>
            <S.KanbanColumnHeader $color={statusInfo.color}>
              <h4>{statusInfo.label}</h4>
              <span>{statusVisitas.length}</span>
            </S.KanbanColumnHeader>
            <S.KanbanColumnBody>
              {statusVisitas.length === 0 ? (
                <S.EmptyColumn>Nenhuma visita</S.EmptyColumn>
              ) : (
                statusVisitas.map(v => (
                  <S.KanbanCard key={v.id} onClick={() => onCardClick && onCardClick(v)}>
                    <S.KanbanCardTitle>
                      <FaBuilding />
                      <span>{v?.empresa || "—"}</span>
                    </S.KanbanCardTitle>
                    <S.KanbanCardInfo>
                      <span><FiCalendar size={12} /> {formatDateBR(v?.data)}</span>
                      {v?.hora && <span><FiClock size={12} /> {v.hora.substring(0, 5)}</span>}
                    </S.KanbanCardInfo>
                    <S.KanbanCardResponsavel>
                      <FiUser size={12} />
                      {getComercialName(v) || "Sem responsável"}
                    </S.KanbanCardResponsavel>
                  </S.KanbanCard>
                ))
              )}
            </S.KanbanColumnBody>
          </S.KanbanColumn>
        );
      })}
    </S.KanbanContainer>
  );
}