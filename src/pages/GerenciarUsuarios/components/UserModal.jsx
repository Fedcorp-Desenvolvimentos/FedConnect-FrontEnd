import React from 'react';
import * as S from '../GerenciarUsuariosStyles';
import { NIVEL_ACESSO_OPTIONS } from '../constants/userConstants';

const UserModal = ({ 
  isOpen, 
  type, 
  user, 
  formData, 
  onClose, 
  onConfirm, 
  onUpdateField 
}) => {
  if (!isOpen) return null;

  const isEditMode = type === 'edit';
  const isDeleteMode = type === 'delete';

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  if (isDeleteMode) {
    return (
      <S.ModalOverlay onClick={onClose}>
        <S.ModalContent onClick={(e) => e.stopPropagation()}>
          <S.ModalTitle>Confirmar Exclusão</S.ModalTitle>
          <S.ConfirmMessage>
            Tem certeza que deseja excluir <strong>{user?.nome_completo}</strong>?
          </S.ConfirmMessage>
          <S.ModalActions>
            <S.SecondaryButton onClick={onClose}>
              Cancelar
            </S.SecondaryButton>
            <S.DangerButton onClick={onConfirm}>
              Confirmar
            </S.DangerButton>
          </S.ModalActions>
        </S.ModalContent>
      </S.ModalOverlay>
    );
  }

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalTitle>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</S.ModalTitle>
        <S.ModalForm onSubmit={handleSubmit}>
          <S.FormGroup>
            <S.FormLabel>Nome completo:</S.FormLabel>
            <S.FormInput
              type="text"
              value={formData.nome_completo || ''}
              onChange={(e) => onUpdateField('nome_completo', e.target.value)}
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>E-mail:</S.FormLabel>
            <S.FormInput
              type="email"
              value={formData.email || ''}
              onChange={(e) => onUpdateField('email', e.target.value)}
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.FormLabel>Função:</S.FormLabel>
            <S.FormSelect
              value={formData.nivel_acesso || 'usuario'}
              onChange={(e) => onUpdateField('nivel_acesso', e.target.value)}
            >
              {NIVEL_ACESSO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.FormSelect>
          </S.FormGroup>

          <S.ModalActions>
            <S.SecondaryButton type="button" onClick={onClose}>
              Cancelar
            </S.SecondaryButton>
            <S.PrimaryButton type="submit">
              {isEditMode ? 'Salvar' : 'Criar'}
            </S.PrimaryButton>
          </S.ModalActions>
        </S.ModalForm>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default UserModal;