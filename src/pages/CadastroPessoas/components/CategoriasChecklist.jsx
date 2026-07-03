import React from 'react';
import { FaCheckDouble, FaEllipsisH } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';
import { CATEGORIAS_DISPONIVEIS } from '../hooks/usePessoaForm';

const CategoriasChecklist = ({ categoriasSelecionadas, onToggle, onAplicar, disabled }) => {
  return (
    <S.FormGroup $flex="1 1 100%">
      <S.FormLabel>Categorias</S.FormLabel>

      <S.InputWithButton>
        <S.ChecklistBox>
          {CATEGORIAS_DISPONIVEIS.map(categoria => (
            <S.ChecklistItem key={categoria} disabled={disabled}>
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(categoria)}
                onChange={() => onToggle(categoria)}
                disabled={disabled}
              />
              {categoria}
            </S.ChecklistItem>
          ))}
        </S.ChecklistBox>

        <S.IconSquareButton type="button" title="Gerenciar categorias" disabled={disabled}>
          <FaEllipsisH />
        </S.IconSquareButton>
      </S.InputWithButton>

      <S.ChecklistFooter>
        <S.SecondaryButton type="button" onClick={onAplicar} disabled={disabled}>
          <FaCheckDouble /> Aplicar
        </S.SecondaryButton>
      </S.ChecklistFooter>
    </S.FormGroup>
  );
};

export default CategoriasChecklist;