import React from 'react';
import { FaTimes, FaBuilding, FaCalendar, FaUser, FaClock, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import * as S from '../ComercialStyles';

function formatDateBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function DetalheVisita({ visita, onClose }) {
  if (!visita) return null;

  const isCancelada = visita?.status?.toLowerCase() === "cancelada";

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>
            <FaBuilding /> Detalhes da Visita
          </S.ModalTitle>
          <S.ModalClose onClick={onClose}>
            <FaTimes />
          </S.ModalClose>
        </S.ModalHeader>
        <S.ModalBody>
          <S.InfoRow>
            <S.InfoLabel><FaBuilding /> Empresa</S.InfoLabel>
            <S.InfoValue>{visita?.empresa || "—"}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel><FaCalendar /> Data</S.InfoLabel>
            <S.InfoValue>{formatDateBR(visita?.data)}</S.InfoValue>
          </S.InfoRow>
          {visita?.hora && (
            <S.InfoRow>
              <S.InfoLabel><FaClock /> Horário</S.InfoLabel>
              <S.InfoValue>{visita.hora}</S.InfoValue>
            </S.InfoRow>
          )}
          <S.InfoRow>
            <S.InfoLabel><FaUser /> Responsável</S.InfoLabel>
            <S.InfoValue>{visita?.responsavel?.nome_completo || visita?.responsavel?.username || "—"}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel><FaInfoCircle /> Status</S.InfoLabel>
            <S.StatusBadge $status={visita?.status?.toLowerCase()}>
              {visita?.status || "—"}
            </S.StatusBadge>
          </S.InfoRow>
          {visita?.obs && (
            <S.InfoRow>
              <S.InfoLabel>Observações</S.InfoLabel>
              <S.InfoValue>{visita.obs}</S.InfoValue>
            </S.InfoRow>
          )}
          {isCancelada && visita?.motivo_cancelamento && (
            <S.WarningRow>
              <FaExclamationTriangle />
              <div>
                <strong>Motivo do Cancelamento:</strong>
                <p>{visita.motivo_cancelamento}</p>
              </div>
            </S.WarningRow>
          )}
        </S.ModalBody>
        <S.ModalFooter>
          <S.CloseModalButton onClick={onClose}>Fechar</S.CloseModalButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
}