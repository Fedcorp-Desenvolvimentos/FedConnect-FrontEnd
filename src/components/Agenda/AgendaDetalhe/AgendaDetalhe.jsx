import React, { useState } from "react";
import { format, isDate } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTimes, FaTrash, FaUserFriends, FaClock, FaCalendar, FaQuestionCircle } from "react-icons/fa";
import * as S from "./AgendaDetalheStyles";
import { useAuth } from "../../../context/AuthContext";

export default function AgendaDetalhe({ reserva, onClose, onDelete }) {
  const { user } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const access = String(user?.nivel_acesso || user?.role || user?.perfil || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const canSeeSensitive = ["admin", "gestor", "coordenador", "ti"].includes(access);
  const canManage = canSeeSensitive && typeof onDelete === "function";

  if (!reserva) return null;

  const dataObj = isDate(reserva?.data) ? reserva.data : new Date(reserva?.data);
  const dataFmt =
    reserva?.data && !isNaN(dataObj)
      ? format(dataObj, "dd/MM/yyyy", { locale: ptBR })
      : "-";

  const participantesArray = Array.isArray(reserva?.participantes)
    ? reserva.participantes
    : typeof reserva?.participantes === "string"
    ? reserva.participantes.split(",").map((p) => p.trim()).filter(Boolean)
    : [];

  const tema = reserva?.tema ?? reserva?.assunto ?? reserva?.titulo ?? "-";

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(reserva);
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <S.Overlay onClick={onClose}>
        <S.Modal onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose}>
            <FaTimes size={18} />
          </S.CloseButton>

          <S.Title>Detalhes da Reserva</S.Title>

          <S.InfoGroup>
            <S.InfoItem>
              <FaQuestionCircle size={16} />
              <S.InfoContent>
                <S.InfoLabel>Tema</S.InfoLabel>
                <S.InfoValue>{tema}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            <S.InfoItem>
              <FaCalendar size={16} />
              <S.InfoContent>
                <S.InfoLabel>Data</S.InfoLabel>
                <S.InfoValue>{dataFmt}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            <S.InfoItem>
              <FaClock size={16} />
              <S.InfoContent>
                <S.InfoLabel>Horário</S.InfoLabel>
                <S.InfoValue>{reserva?.horario ?? "-"}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            <S.InfoItem>
              <FaClock size={16} />
              <S.InfoContent>
                <S.InfoLabel>Duração</S.InfoLabel>
                <S.InfoValue>{reserva?.duracao ?? "-"} minutos</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>

            {canSeeSensitive && participantesArray.length > 0 && (
              <S.InfoItem>
                <FaUserFriends size={16} />
                <S.InfoContent>
                  <S.InfoLabel>Participantes</S.InfoLabel>
                  <S.InfoValue>{participantesArray.join(", ")}</S.InfoValue>
                </S.InfoContent>
              </S.InfoItem>
            )}
          </S.InfoGroup>

          <S.Actions>
            {canManage && (
              <S.DeleteButton onClick={handleDeleteClick}>
                <FaTrash size={14} /> Excluir
              </S.DeleteButton>
            )}
            <S.CloseButtonAction onClick={onClose}>Fechar</S.CloseButtonAction>
          </S.Actions>
        </S.Modal>
      </S.Overlay>

      {/* Modal de confirmação de exclusão */}
      {showConfirmModal && (
        <S.ConfirmOverlay onClick={handleCancelDelete}>
          <S.ConfirmModal onClick={(e) => e.stopPropagation()}>
            <S.ConfirmTitle>Confirmar exclusão</S.ConfirmTitle>
            <S.ConfirmMessage>
              Tem certeza que deseja excluir esta reserva?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </S.ConfirmMessage>
            <S.ConfirmActions>
              <S.CancelConfirmButton onClick={handleCancelDelete}>
                Cancelar
              </S.CancelConfirmButton>
              <S.ConfirmDeleteButton onClick={handleConfirmDelete}>
                Sim, excluir
              </S.ConfirmDeleteButton>
            </S.ConfirmActions>
          </S.ConfirmModal>
        </S.ConfirmOverlay>
      )}
    </>
  );
}