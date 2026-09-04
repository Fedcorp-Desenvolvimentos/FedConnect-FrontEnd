import styled, { css, keyframes } from "styled-components";

const entrada = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

/** As duas cores que separam os locais no calendário, na legenda e no painel. */
export const CORES_LOCAL = {
  AUDITORIO: { forte: "#0F3D5D", media: "#5b8fb4", clara: "#eef4f9" },
  SALA_REUNIAO: { forte: "#0f766e", media: "#5aa39c", clara: "#e9f4f2" },
};

export const cor = (local, tom = "forte") =>
  (CORES_LOCAL[local] || CORES_LOCAL.AUDITORIO)[tom];

export const Container = styled.div`
  animation: ${entrada} 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* As superfícies que o navegador desenha também são a interface. */
  ::selection {
    background: #cfe3f2;
    color: #0f3d5d;
  }

  :focus-visible {
    outline: 2px solid #0f3d5d;
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const superficie = css`
  background: #ffffff;
  border: 1px solid #e5eaf0;
  border-radius: 12px;
`;

/* ---------- Faixa de medidas ---------- */

export const Medidas = styled.section`
  ${superficie};
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Medida = styled.div`
  padding: 0.9rem 1.25rem;
  border-right: 1px solid #eef2f6;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 900px) {
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-child(-n + 2) {
      border-bottom: 1px solid #eef2f6;
    }
  }
`;

export const MedidaRotulo = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
`;

export const MedidaValor = styled.strong`
  font-size: 1.7rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f3d5d;
  font-variant-numeric: tabular-nums;
`;

export const MedidaNota = styled.span`
  font-size: 0.78rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
`;

/* ---------- Barra de filtros ---------- */

export const Filtros = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  ${superficie};
  width: 2.25rem;
  height: 2.25rem;
  cursor: pointer;
  color: #0f3d5d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

export const MesLabel = styled.h2`
  ${superficie};
  margin: 0;
  padding: 0.45rem 0.9rem;
  color: #0f3d5d;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-transform: capitalize;
  min-width: 10.5rem;
`;

export const Select = styled.select`
  ${superficie};
  padding: 0.5rem 0.7rem;
  font-size: 0.85rem;
  font-family: inherit;
  color: #1e293b;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0f3d5d;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.12);
  }
`;

export const Busca = styled.div`
  ${superficie};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.7rem;
  flex: 1;
  min-width: 13rem;
  max-width: 22rem;
  color: #64748b;

  &:focus-within {
    border-color: #0f3d5d;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.12);
  }

  input {
    border: none;
    outline: none;
    padding: 0.55rem 0;
    font-size: 0.85rem;
    font-family: inherit;
    color: #1e293b;
    width: 100%;
    background: transparent;
  }
`;

export const Limpar = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: #0f3d5d;
  font-size: 0.83rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &:hover:not(:disabled) {
    background: #f1f5f9;
  }

  &:disabled {
    color: #94a3b8;
    cursor: default;
  }
`;

export const Legenda = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-bottom: 0.7rem;
`;

export const ItemLegenda = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #475569;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $local }) => cor($local)};
  }
`;

/* ---------- Estrutura ---------- */

export const Painel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 21rem;
  gap: 1rem;
  align-items: start;

  @media (max-width: 1180px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/* ---------- Calendário ---------- */

export const Calendario = styled.div`
  ${superficie};
  overflow: hidden;
`;

export const Semana = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));

  & + & {
    border-top: 1px solid #eef2f6;
  }
`;

export const CabecalhoSemana = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: #fafbfc;
  border-bottom: 1px solid #e5eaf0;
`;

export const DiaSemana = styled.div`
  padding: 0.6rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #64748b;
  text-transform: uppercase;
  text-align: center;
`;

/*
 * O dia é uma div, não um botão: dentro dele moram os botões das turmas, e
 * interativo dentro de interativo quebra teclado e leitor de tela. O clique no
 * dia é atalho de mouse; pelo teclado se agenda pelo botão "Nova turma".
 */
export const Dia = styled.div`
  min-height: 104px;
  border-right: 1px solid #eef2f6;
  background: ${({ $foraDoMes }) => ($foraDoMes ? "#fafbfc" : "#ffffff")};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.3rem;
  text-align: left;
  font-family: inherit;
  cursor: ${({ $foraDoMes }) => ($foraDoMes ? "default" : "pointer")};
  transition: background 0.15s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ $foraDoMes }) => ($foraDoMes ? "#fafbfc" : "#f7fafc")};
  }
`;

export const NumeroDia = styled.span`
  align-self: flex-start;
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ $foraDoMes }) => ($foraDoMes ? "#a3aebd" : "#64748b")};
  font-variant-numeric: tabular-nums;

  ${({ $hoje }) =>
    $hoje &&
    css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      background: #0f3d5d;
      color: #ffffff;
      font-weight: 700;
    `}
`;

/**
 * Uma turma dentro do dia. Sem turma o dia fica limpo — o clique agenda.
 * O local se lê no ponto colorido e no nome, não numa tarja lateral.
 */
export const Turma = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  font-family: inherit;
  border-radius: 6px;
  border: 1px solid ${({ $local }) => `${cor($local, "media")}59`};
  background: ${({ $local }) => cor($local, "clara")};
  padding: 0.3rem 0.4rem;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.97);
  }

  ${({ $cancelada }) =>
    $cancelada &&
    css`
      opacity: 0.55;
    `}
`;

export const TurmaHora = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.66rem;
  color: #475569;
  font-variant-numeric: tabular-nums;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex: none;
    background: ${({ $local }) => cor($local)};
  }
`;

export const TurmaNome = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $local }) => cor($local)};
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TurmaContagem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  color: #475569;
  font-variant-numeric: tabular-nums;
`;

/* ---------- Painel lateral ---------- */

export const Trilho = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Cartao = styled.section`
  ${superficie};
  padding: 0.9rem 1rem 1rem;
`;

export const CartaoTopo = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.6rem;

  h3 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #0f3d5d;
    letter-spacing: -0.01em;
  }
`;

export const Etiqueta = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: 5px;
  white-space: nowrap;
  background: ${({ $local }) => cor($local, "clara")};
  color: ${({ $local }) => cor($local)};
`;

export const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const Item = styled.li`
  & + & {
    border-top: 1px solid #f1f5f9;
  }
`;

export const LinhaTurma = styled.button`
  width: calc(100% + 0.8rem);
  margin: 0 -0.4rem;
  background: none;
  border: none;
  padding: 0.55rem 0.4rem;
  border-radius: 8px;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  display: grid;
  grid-template-columns: 2.9rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.6rem;
  transition: background 0.15s ease;

  &:hover {
    background: #f7fafc;
  }
`;

export const LinhaData = styled.time`
  font-size: 0.78rem;
  font-weight: 600;
  color: #475569;
  font-variant-numeric: tabular-nums;
`;

export const LinhaNome = styled.span`
  display: block;
  font-size: 0.83rem;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LinhaMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 0.1rem;
`;

export const Ocupacao = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ $lotada }) => ($lotada ? "#b45309" : "#475569")};
`;

/** Barra de ocupação: a proporção é o dado, não enfeite. */
export const Barra = styled.span`
  display: block;
  height: 4px;
  border-radius: 999px;
  background: #eef2f6;
  overflow: hidden;
  margin-top: 0.35rem;

  &::after {
    content: "";
    display: block;
    height: 100%;
    border-radius: inherit;
    width: ${({ $porcento }) => Math.min(100, Math.max(0, $porcento))}%;
    background: ${({ $local }) => cor($local)};
  }
`;

export const Alerta = styled.button`
  width: calc(100% + 0.8rem);
  margin: 0 -0.4rem;
  display: grid;
  grid-template-columns: 1.1rem minmax(0, 1fr);
  gap: 0.55rem;
  align-items: start;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.4rem;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  color: ${({ $grave }) => ($grave ? "#b91c1c" : "#b45309")};
  transition: background 0.15s ease;

  &:hover {
    background: #f7fafc;
  }

  strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: #1e293b;
  }

  span {
    display: block;
    font-size: 0.74rem;
    color: #64748b;
  }
`;

export const LinhaLocal = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.2rem 0.75rem;
  padding: 0.55rem 0;
  align-items: baseline;

  & + & {
    border-top: 1px solid #f1f5f9;
  }

  b {
    font-size: 0.83rem;
    font-weight: 600;
    color: #1e293b;
  }

  em {
    font-style: normal;
    font-size: 0.78rem;
    font-weight: 600;
    color: #475569;
    font-variant-numeric: tabular-nums;
  }

  small {
    grid-column: 1 / -1;
    font-size: 0.72rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
  }
`;

export const Vazio = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  margin: 0;
  padding: 0.35rem 0;
`;

/* ---------- Botões ---------- */

export const Botao = styled.button`
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.15s ease, border-color 0.15s ease;

  background: ${({ $variante }) => {
    if ($variante === "perigoSolido") return "#b91c1c";
    return $variante ? "#ffffff" : "#0f3d5d";
  }};
  color: ${({ $variante }) => {
    if ($variante === "perigo") return "#b91c1c";
    if ($variante === "secundario") return "#0f3d5d";
    return "#ffffff";
  }};
  border-color: ${({ $variante }) => {
    if ($variante === "perigo") return "#fca5a5";
    if ($variante === "secundario") return "#cbd5e1";
    return "transparent";
  }};
  margin-right: ${({ $variante }) => ($variante === "perigo" ? "auto" : 0)};

  &:hover:not(:disabled) {
    background: ${({ $variante }) => {
      if ($variante === "perigoSolido") return "#991b1b";
      if ($variante === "perigo") return "#fef2f2";
      if ($variante === "secundario") return "#f7fafc";
      return "#14507a";
    }};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

/* ---------- Modais ---------- */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ $acima }) =>
    $acima ? "rgba(15, 23, 42, 0.55)" : "rgba(15, 23, 42, 0.45)"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: ${({ $acima }) => ($acima ? 1300 : 1200)};
`;

export const ModalConfirmacao = styled.div`
  background: #ffffff;
  border-radius: 14px;
  width: 100%;
  max-width: 26rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 18px 48px -12px rgba(15, 23, 42, 0.4);
  animation: ${entrada} 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  h2 {
    margin: 0 0 0.4rem;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    color: #0f3d5d;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
    color: #475569;
  }

`;

export const AcoesConfirmacao = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
`;

/**
 * Saída menos destrutiva dentro da confirmação (ex.: cancelar a turma em vez
 * de apagá-la). Discreta de propósito: é uma alternativa, não a ação principal.
 */
export const BotaoAlternativo = styled.button`
  margin-right: auto;
  border: none;
  background: none;
  padding: 0.55rem 0;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f3d5d;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    color: #164e6f;
  }

  @media (max-width: 480px) {
    margin-right: 0;
    width: 100%;
    text-align: center;
  }
`;

export const ListaConfirmacao = styled.ul`
  list-style: none;
  margin: 0.85rem 0 0;
  padding: 0;
  text-align: left;
  border: 1px solid #e5eaf0;
  border-radius: 10px;
  overflow: hidden;

  li {
    padding: 0.55rem 0.75rem;
    font-size: 0.82rem;
  }

  li + li {
    border-top: 1px solid #eef2f6;
  }

  strong {
    display: block;
    font-weight: 600;
    color: #1e293b;
  }

  span {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    font-variant-numeric: tabular-nums;
  }
`;

export const IconeAviso = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  margin: 0 auto 0.85rem;
  border-radius: 50%;
  background: ${({ $tom }) => ($tom === "aviso" ? "#fffbeb" : "#fef2f2")};
  color: ${({ $tom }) => ($tom === "aviso" ? "#b45309" : "#b91c1c")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
`;

export const Modal = styled.div`
  background: #ffffff;
  border-radius: 14px;
  width: 100%;
  max-width: ${({ $largo }) => ($largo ? "740px" : "540px")};
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 18px 48px -12px rgba(15, 23, 42, 0.35);
  animation: ${entrada} 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    color: #0f3d5d;
  }

  p {
    margin: 0.2rem 0 0;
    font-size: 0.8rem;
    color: #64748b;
  }
`;

export const FecharButton = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 6px;
  line-height: 0;

  &:hover {
    color: #0f3d5d;
    background: #f1f5f9;
  }
`;

export const Campo = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.85rem;
  font-size: 0.78rem;
  color: #475569;
  font-weight: 600;

  input,
  select,
  textarea {
    border: 1px solid ${({ $erro }) => ($erro ? "#dc2626" : "#cbd5e1")};
    border-radius: 8px;
    padding: 0.55rem 0.7rem;
    font-size: 0.88rem;
    font-weight: 400;
    font-family: inherit;
    color: #1e293b;
    background: #ffffff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #0f3d5d;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.12);
  }

  input:disabled,
  select:disabled {
    background: #f8fafc;
    color: #94a3b8;
  }

  span.erro {
    color: #dc2626;
    font-weight: 500;
    font-size: 0.75rem;
  }
`;

export const Linha = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $colunas = 2 }) => $colunas}, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Acoes = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
`;

export const Contador = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ $lotado }) => ($lotado ? "#b45309" : "#0f3d5d")};

  small {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #64748b;
    margin-left: 0.4rem;
  }
`;

export const BarraTurma = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5eaf0;
  flex-wrap: wrap;
`;

/** Ações da turma na barra do painel de inscritos, agrupadas à direita. */
export const BarraTurmaAcoes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const AvisoEspelho = styled.p`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.85rem 0 0;
  font-size: 0.78rem;
  color: #b45309;
`;

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.85rem;
  font-size: 0.85rem;

  th,
  td {
    text-align: left;
    padding: 0.55rem 0.5rem;
    border-bottom: 1px solid #eef2f6;
  }

  td {
    color: #1e293b;
  }

  td.numero {
    font-variant-numeric: tabular-nums;
    color: #475569;
  }

  th {
    color: #64748b;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  tbody tr:hover td {
    background: #f8fafc;
  }

  /* A linha em edição fica marcada enquanto o formulário abaixo a carrega. */
  tbody tr[data-editando="true"] td {
    background: #eef4f9;
  }

  /* Quem já está na turma com o CPF que está sendo digitado. */
  tbody tr[data-duplicado="true"] td {
    background: #fffbeb;
  }
`;

export const AvisoCampo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #b45309;
`;

export const AcoesLinha = styled.div`
  display: flex;
  align-items: center;
  gap: 0.15rem;
  justify-content: flex-end;
`;

export const BotaoIcone = styled.button`
  border: none;
  background: transparent;
  color: ${({ $perigo }) => ($perigo ? "#b91c1c" : "#64748b")};
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 6px;
  line-height: 0;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    color: ${({ $perigo }) => ($perigo ? "#991b1b" : "#0f3d5d")};
    background: ${({ $perigo }) => ($perigo ? "#fef2f2" : "#f1f5f9")};
  }
`;

export const Secao = styled.div`
  border-top: 1px solid #e5eaf0;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
`;

export const SecaoTitulo = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #64748b;
`;
