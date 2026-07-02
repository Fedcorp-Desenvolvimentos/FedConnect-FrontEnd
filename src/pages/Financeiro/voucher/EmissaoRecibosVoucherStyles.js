import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ---------------------------------------------------
   Design tokens (kept local to avoid a global refactor)
--------------------------------------------------- */
export const tokens = {
  ink: '#1a202c',
  inkSoft: '#4a5568',
  muted: '#718096',
  faint: '#a0aec0',
  line: '#e6ebf1',
  surface: '#ffffff',
  canvas: '#f4f6f9',
  primary: '#2b6cb0',
  primaryDark: '#1a365d',
  primarySoft: '#ebf8ff',
  positive: '#1f9d55',
  positiveSoft: '#e9f8ee',
  negative: '#dd6b20',
  negativeSoft: '#fff4e8',
  radius: '14px',
};

export const Container = styled.div`
  padding: 20px 24px 40px;
  max-width: 1440px;
  margin: 0 auto;
  background: ${tokens.canvas};
  min-height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
  background: ${tokens.surface};
  padding: 18px 22px;
  border-radius: ${tokens.radius};
  border: 1px solid ${tokens.line};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #edf2f7;
  border: none;
  border-radius: 9px;
  color: #2d3748;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #e2e8f0;
    transform: translateX(-2px);
  }
`;

export const Title = styled.div`
  flex: 1;
  min-width: 0;

  span {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    color: ${tokens.primary};
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: ${tokens.ink};
    margin: 0;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 13.5px;
    color: ${tokens.muted};
    margin: 4px 0 0 0;
    max-width: 640px;
  }
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  margin-bottom: 18px;
  background: ${(props) => (props.isFiltered ? '#fffbeb' : tokens.primarySoft)};
  border: 1px solid ${(props) => (props.isFiltered ? '#fde68a' : '#bee3f8')};
  border-radius: 12px;
  color: ${(props) => (props.isFiltered ? '#92400e' : '#2b6cb0')};

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 1px;

    strong {
      font-size: 13.5px;
    }

    span {
      font-size: 12.5px;
      color: ${(props) => (props.isFiltered ? '#78350f' : '#2c5282')};
    }
  }
`;

/* ---------------------------------------------------
   Page layout: main workflow column + sticky sidebar
   for taxes/retentions + issuance actions
--------------------------------------------------- */
export const PageLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;

  @media (max-width: 1100px) {
    position: static;
  }
`;

export const SingleColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;

export const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${tokens.surface};
  border-radius: ${tokens.radius};
  padding: 20px;
  border: 1px solid ${tokens.line};
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${tokens.line};
  gap: 12px;
  flex-wrap: wrap;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;

    svg {
      color: ${tokens.primary};
      font-size: 15px;
    }

    h2 {
      font-size: 15px;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }

    span {
      font-size: 12.5px;
      color: ${tokens.muted};
    }
  }

  .link-button {
    background: none;
    border: none;
    color: ${tokens.primary};
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;

    &:hover {
      color: ${tokens.primaryDark};
      text-decoration: underline;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
    background: ${tokens.primarySoft};
    color: ${tokens.primary};
  }
`;

export const SkeletonCard = styled(Card)`
  padding: 20px;
`;

export const SkeletonRow = styled.div`
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: ${pulse} 1.5s ease-in-out infinite;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: ${tokens.surface};
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${tokens.line};
  display: flex;
  align-items: center;
  gap: 14px;

  .icon {
    font-size: 20px;
    padding: 9px;
    border-radius: 9px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  > div {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    span {
      font-size: 12px;
      color: ${tokens.muted};
    }

    strong {
      font-size: 18px;
      font-weight: 700;
      color: ${tokens.ink};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    small {
      font-size: 10.5px;
      color: ${tokens.faint};
      margin-top: 2px;
    }
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 12.5px;
    font-weight: 600;
    color: #4a5568;
  }

  input,
  select {
    height: 38px;
    padding: 0 12px;
    border: 1px solid #dbe2ea;
    border-radius: 8px;
    font-size: 13.5px;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: white;
    color: ${tokens.ink};

    &:focus {
      outline: none;
      border-color: ${tokens.primary};
      box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.12);
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }
  }

  small {
    color: ${tokens.faint};
    font-size: 11px;
  }
`;

export const DataCorteGroup = styled(FormGroup)`
  input {
    border-color: #bfdcf3;
    background: ${tokens.primarySoft};
    font-weight: 600;
    color: ${tokens.primaryDark};

    &:focus {
      background: white;
    }
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${tokens.line};
  margin: 16px 0;
`;

export const ComissaoList = styled.div`
  max-height: 540px;
  overflow-y: auto;
  border: 1px solid ${tokens.line};
  border-radius: 12px;
`;

export const ComissaoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid ${tokens.line};
  transition: background 0.12s;
  background: ${(props) => (props.checked ? tokens.primarySoft : 'transparent')};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.checked ? '#dbeefc' : '#f7fafc')};
  }

  &:last-child {
    border-bottom: none;
  }

  input[type='checkbox'] {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    cursor: pointer;
    accent-color: ${tokens.primary};
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;

    strong {
      font-size: 13.5px;
      color: #2d3748;
    }

    span {
      font-size: 12.5px;
      color: #4a5568;
      word-break: break-word;
    }
  }

  .value {
    font-weight: 700;
    color: ${tokens.primary};
    font-size: 14.5px;
    white-space: nowrap;
  }
`;

export const TotalsBar = styled.div`
  display: flex;
  gap: 20px;
  padding: 12px 16px;
  margin-top: 12px;
  background: ${tokens.canvas};
  border-radius: 10px;
  flex-wrap: wrap;

  span {
    font-size: 13px;
    color: #4a5568;

    strong {
      color: #2d3748;
    }
  }

  .net {
    color: ${tokens.primary};
    font-weight: 600;
  }
`;

export const EmissaoOptions = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    font-weight: 500;
    color: #4a5568;
    flex-wrap: wrap;

    select {
      height: 36px;
      padding: 0 12px;
      border: 1px solid #dbe2ea;
      border-radius: 8px;
      font-size: 13.5px;
      background: white;
    }
  }
`;

export const EmissionResult = styled.div`
  padding: 12px 14px;
  margin: 12px 0;
  background: ${tokens.positiveSoft};
  border: 1px solid #b7ecc8;
  border-radius: 10px;
  color: #17663f;
  font-size: 13px;
  line-height: 1.6;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 40px;

  &.primary {
    background: ${tokens.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${tokens.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(43, 108, 176, 0.25);
    }
  }

  &.secondary {
    background: #edf2f7;
    color: #2d3748;

    &:hover:not(:disabled) {
      background: #e2e8f0;
    }
  }

  &.ghost {
    background: transparent;
    color: ${tokens.muted};
    border: 1px solid ${tokens.line};

    &:hover:not(:disabled) {
      background: #f7fafc;
      color: #2d3748;
    }
  }

  &.block {
    width: 100%;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${tokens.faint};
  font-size: 14px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: ${tokens.muted};

  svg,
  .spin {
    font-size: 28px;
    color: ${tokens.primary};
    animation: ${spin} 1s linear infinite;
  }
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 56px 20px;
  background: ${tokens.surface};
  border-radius: ${tokens.radius};
  border: 1px solid ${tokens.line};
`;

export const EmptyStateIcon = styled.div`
  font-size: 44px;
  color: #cbd5e0;
  margin-bottom: 14px;

  svg {
    display: inline-block;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 6px 0;
`;

export const EmptyStateText = styled.p`
  font-size: 13.5px;
  color: ${tokens.muted};
  margin: 0;
  max-width: 380px;
  margin: 0 auto;

  strong {
    color: ${tokens.primary};
  }
`;

/* ---------------------------------------------------
   Retenções (sidebar tax card)
--------------------------------------------------- */
export const RetentionCard = styled(Card)`
  padding: 18px;
`;

export const RetentionStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;

  > div {
    background: ${tokens.canvas};
    border-radius: 9px;
    padding: 9px 10px;

    span {
      display: block;
      font-size: 10.5px;
      color: ${tokens.muted};
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 2px;
    }

    strong {
      font-size: 14px;
      color: ${tokens.ink};
    }

    &.net strong {
      color: ${tokens.primary};
    }

    &.retained strong {
      color: ${tokens.negative};
    }
  }
`;

export const RetentionOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const RetentionOption = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 11px;
  border-radius: 9px;
  border: 1px solid ${(props) => (props.checked ? '#bfdcf3' : tokens.line)};
  background: ${(props) => (props.checked ? tokens.primarySoft : tokens.surface)};
  cursor: pointer;
  transition: all 0.12s;
  font-size: 13px;

  &:hover {
    border-color: ${tokens.primary};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 9px;

    input[type='checkbox'] {
      cursor: pointer;
      accent-color: ${tokens.primary};
      width: 15px;
      height: 15px;
    }

    .name {
      font-weight: 600;
      color: #2d3748;
    }

    .rate {
      color: ${tokens.muted};
      font-size: 11.5px;
    }
  }

  .amount {
    font-size: 12.5px;
    font-weight: 600;
    color: ${(props) => (props.checked ? tokens.negative : tokens.faint)};
    white-space: nowrap;
  }
`;

/* ---------------------------------------------------
   Preview modal (document-style receipt/voucher preview)
--------------------------------------------------- */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
  z-index: 1200;
  animation: ${fadeIn} 0.15s ease-out;
`;

export const ModalCard = styled.div`
  background: ${tokens.surface};
  border-radius: 16px;
  width: 100%;
  max-width: 760px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.3);
  animation: ${slideUp} 0.18s ease-out;
  margin-top: 60px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;

  h2 {
    margin: 0 0 3px 0;
    font-size: 17px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 12.5px;
    color: #cbd9ea;
  }

  button {
    background: rgba(255, 255, 255, 0.12);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.22);
    }
  }
`;

export const ModalBody = styled.div`
  padding: 22px 24px 6px;
  max-height: 62vh;
  overflow-y: auto;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid ${tokens.line};
  background: ${tokens.canvas};
`;

export const DocMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }

  > div {
    span {
      display: block;
      font-size: 10.5px;
      color: ${tokens.muted};
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-bottom: 3px;
    }

    strong {
      font-size: 13.5px;
      color: ${tokens.ink};
    }
  }
`;

export const DocTable = styled.div`
  border: 1px solid ${tokens.line};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 18px;
`;

export const DocTableHead = styled.div`
  display: grid;
  grid-template-columns: 2.4fr 1.1fr 1fr 1fr;
  gap: 8px;
  padding: 9px 14px;
  background: ${tokens.canvas};
  font-size: 11px;
  font-weight: 700;
  color: ${tokens.muted};
  text-transform: uppercase;
  letter-spacing: 0.03em;

  @media (max-width: 560px) {
    display: none;
  }
`;

export const DocTableRow = styled.div`
  display: grid;
  grid-template-columns: 2.4fr 1.1fr 1fr 1fr;
  gap: 8px;
  padding: 11px 14px;
  border-top: 1px solid ${tokens.line};
  font-size: 13px;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 3px;
    padding: 12px 14px;
  }

  .primary-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    strong {
      color: #2d3748;
      font-size: 13px;
    }

    span {
      color: ${tokens.faint};
      font-size: 11.5px;
    }
  }

  .cell-label {
    display: none;
    font-size: 10.5px;
    color: ${tokens.faint};
    text-transform: uppercase;

    @media (max-width: 560px) {
      display: inline;
    }
  }

  .value-cell {
    color: #4a5568;
    font-variant-numeric: tabular-nums;
  }

  .money-cell {
    font-weight: 700;
    color: ${tokens.ink};
    font-variant-numeric: tabular-nums;
    text-align: right;

    @media (max-width: 560px) {
      text-align: left;
    }
  }
`;

export const DocSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: auto;
  width: 100%;
  max-width: 320px;

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    color: #4a5568;

    strong {
      font-variant-numeric: tabular-nums;
    }
  }

  .row.deduction strong {
    color: ${tokens.negative};
  }

  .row.total {
    padding-top: 10px;
    border-top: 1px solid ${tokens.line};
    font-size: 15.5px;
    font-weight: 700;
    color: ${tokens.ink};

    strong {
      color: ${tokens.primary};
    }
  }
`;

export const RawDataToggle = styled.div`
  margin-top: 18px;

  summary {
    cursor: pointer;
    font-size: 12.5px;
    font-weight: 600;
    color: ${tokens.primary};
    list-style: none;
    display: flex;
    align-items: center;
    gap: 6px;

    &::-webkit-details-marker {
      display: none;
    }
  }

  pre {
    margin-top: 10px;
    background: #0f172a;
    color: #cbe4ff;
    padding: 14px;
    border-radius: 10px;
    font-size: 11.5px;
    line-height: 1.55;
    overflow-x: auto;
    max-height: 260px;
  }
`;