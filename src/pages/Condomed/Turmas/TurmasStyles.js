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

/** Situação com ponto colorido, como no histórico. */
export const SeloPonto = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === "cancelada" ? "#fee2e2" : $status === "realizada" ? "#dbeafe" : "#dcfce7"};
  color: ${({ $status }) =>
    $status === "cancelada" ? "#991b1b" : $status === "realizada" ? "#1e40af" : "#166534"};

  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: currentColor;
  }
`;

/** Botão redondo de recolher/expandir no canto do cartão de filtros. */
export const BotaoRecolher = styled.button`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 12px;
  border: 1px solid #e5eaf0;
  background: #ffffff;
  color: #0f3d5d;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    transition: transform 0.18s ease;
    transform: rotate(${({ $aberto }) => ($aberto ? "0deg" : "180deg")});
  }
`;

/** Campo de texto com ícone à esquerda, do tamanho dos demais inputs. */
export const EntradaComIcone = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding-left: 2.2rem !important;
  }
`;

/** "Abrir ›" na coluna de ações. */
export const LinkAbrir = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #0f3d5d;
  font-weight: 600;
`;

