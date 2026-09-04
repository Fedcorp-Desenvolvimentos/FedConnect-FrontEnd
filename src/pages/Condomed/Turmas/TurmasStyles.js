import styled from "styled-components";

/*
 * Estilos próprios da página de histórico e da página de detalhe. O que é
 * comum às telas da Condomed (tabela, botão, campo, selo, aviso) continua em
 * CursoCipaStyles — aqui ficam só abas, paginação e a linha clicável.
 */

export const Abas = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5eaf0;
`;

export const Aba = styled.button`
  border: none;
  background: none;
  padding: 0.65rem 1rem;
  margin-bottom: -1px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ $ativa }) => ($ativa ? "#0f3d5d" : "#64748b")};
  border-bottom: 2px solid ${({ $ativa }) => ($ativa ? "#0f3d5d" : "transparent")};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    color: #0f3d5d;
  }

  small {
    font-weight: 600;
    font-size: 0.72rem;
    padding: 0.05rem 0.45rem;
    border-radius: 999px;
    background: ${({ $ativa }) => ($ativa ? "#e0ecf5" : "#f1f5f9")};
    color: inherit;
  }
`;

export const Superficie = styled.section`
  background: #ffffff;
  border: 1px solid #e5eaf0;
  border-radius: 14px;
  padding: 1rem 1.25rem 1.25rem;
`;

export const FiltrosLinha = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.6rem;
  align-items: end;
  margin-bottom: 0.5rem;
`;

/** Linha da tabela que abre o detalhe: o cursor e o hover dizem isso. */
export const LinhaClicavel = styled.tr`
  cursor: pointer;

  &:hover td {
    background: #f1f5f9 !important;
  }

  td.acao {
    text-align: right;
    color: #0f3d5d;
    white-space: nowrap;
  }
`;

export const Paginacao = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.85rem;
  font-size: 0.82rem;
  color: #64748b;
  flex-wrap: wrap;

  div {
    display: flex;
    gap: 0.4rem;
  }
`;

export const Resumo = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  color: #64748b;

  strong {
    color: #1e293b;
  }
`;

/** Cabeçalho do detalhe da turma: medidas rápidas em linha. */
export const Medidas = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  span {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #64748b;
  }

  strong {
    font-size: 1.15rem;
    letter-spacing: -0.02em;
    color: #0f3d5d;
    text-transform: none;
  }
`;
