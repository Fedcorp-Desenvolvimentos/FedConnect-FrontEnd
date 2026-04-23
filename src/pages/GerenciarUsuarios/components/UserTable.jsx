import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import * as S from '../GerenciarUsuariosStyles';

const UserTable = ({ usuarios, onEdit, onDelete, currentUserId }) => {
  const getNivelAcessoLabel = (nivel) => {
    const labels = {
      admin: 'Admin',
      usuario: 'Usuário',
      comercial: 'Comercial',
      moderador: 'Moderador',
      ti: 'TI',
      faturamento: 'Faturamento'
    };
    return labels[nivel] || nivel || 'Usuário';
  };

  return (
    <S.TableWrapper>
      <S.Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nome_completo}</td>
              <td>{usuario.email}</td>
              <td>
                <S.Badge>{getNivelAcessoLabel(usuario.nivel_acesso)}</S.Badge>
              </td>
              <S.ActionsCell>
                <S.ActionButton
                  onClick={() => onEdit(usuario)}
                  title="Editar usuário"
                >
                  <FaEdit />
                </S.ActionButton>

                {usuario.id !== currentUserId && (
                  <S.ActionButton
                    $danger
                    onClick={() => onDelete(usuario)}
                    title="Excluir usuário"
                  >
                    <FaTrash />
                  </S.ActionButton>
                )}
              </S.ActionsCell>
            </tr>
          ))}

          {usuarios.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </S.Table>
    </S.TableWrapper>
  );
};

export default UserTable;