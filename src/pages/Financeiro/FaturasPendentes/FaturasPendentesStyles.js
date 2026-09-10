import styled from "styled-components";
import { tokens } from "../comissoes/ComissoesStyles";

/** Tabela do relatório: um documento por linha, como no PDF do legado. */
export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;

  th {
    text-align: left;
    padding: 9px 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${tokens.muted};
    border-bottom: 2px solid ${tokens.line};
    white-space: nowrap;
  }

  td {
    padding: 8px;
    border-bottom: 1px dashed #dbe2ea;
    vertical-align: top;
    color: ${tokens.ink};
  }

  td.num,
  th.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  td.mono {
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 12px;
    white-space: nowrap;
  }

  tbody tr:hover td {
    background: #f7fafc;
  }

  small {
    display: block;
    color: ${tokens.muted};
    font-size: 11.5px;
    margin-top: 2px;
  }
`;

export const LinhaGrupo = styled.tr`
  td {
    background: ${tokens.primarySoft};
    color: ${tokens.primaryDark};
    font-weight: 700;
    font-size: 12px;
    border-bottom: 1px solid ${tokens.line};
  }
`;

export const LinhaSubtotal = styled.tr`
  td {
    font-weight: 600;
    color: ${tokens.primaryDark};
    background: #f7fafc;
    border-bottom: 2px solid ${tokens.line};
  }
`;

export const Selo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $tom }) => ($tom === "erro" ? "#fee2e2" : $tom === "aviso" ? "#fef3c7" : "#f1f5f9")};
  color: ${({ $tom }) => ($tom === "erro" ? "#991b1b" : $tom === "aviso" ? "#92400e" : "#475569")};
`;

export const Rolagem = styled.div`
  overflow-x: auto;
`;

export const Aviso = styled.div`
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 9px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  color: #92400e;
  font-size: 12.5px;
`;
