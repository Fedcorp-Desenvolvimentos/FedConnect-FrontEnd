// components/Faturamento/ConsultaFaturamentoStyles.js
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// ============================================
// FORMULÁRIO
// ============================================
export const Form = styled.form`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const FiltrosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.$secondary ? 'white' : 'linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%)'};
  color: ${props => props.$secondary ? '#0F3D5D' : 'white'};
  border: ${props => props.$secondary ? '2px solid #0F3D5D' : 'none'};
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// ============================================
// RESULTADOS - CABEÇALHO
// ============================================
export const ResultContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0F3D5D;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TotalBadge = styled.span`
  background: #e0f2fe;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #0369a1;
`;

export const FiltrosInfo = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const FiltroBadge = styled.small`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 0.7rem;
  color: #475569;
`;

// ============================================
// TABELA PRINCIPAL - FATURAS (RESPONSIVA)
// ============================================
export const TableWrapper = styled.div`
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 500px;

  th, td {
    padding: 1rem 0.75rem;
  }

  th {
    text-align: left;
    background: #f8fafc;
    color: #0F3D5D;
    font-weight: 600;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }

  td {
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  /* Desktop: mostra todas as colunas */
  @media (min-width: 769px) {
    th:nth-child(4), td:nth-child(4) { display: table-cell; } /* Administradora */
    th:nth-child(5), td:nth-child(5) { display: table-cell; } /* Emissão */
    th:nth-child(6), td:nth-child(6) { display: table-cell; } /* Status */
    th:nth-child(7), td:nth-child(7) { display: table-cell; } /* Vencimento */
  }

  /* Mobile: esconde colunas menos importantes e reduz fonte */
  @media (max-width: 768px) {
    font-size: 0.7rem;
    min-width: auto;
    
    th, td {
      padding: 0.6rem 0.4rem;
    }
    
    /* Esconde Apólice e Status no mobile */
    th:nth-child(3), td:nth-child(3) { display: none; }
    th:nth-child(6), td:nth-child(6) { display: none; }
    
    /* Mantém Fatura, Administradora (resumida), Vencimento */
    th:nth-child(2) { width: 25%; }
    th:nth-child(4) { width: 40%; }
    th:nth-child(7) { width: 20%; }
    
    /* Trunca texto da administradora */
    td:nth-child(4) {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const TableRow = styled.tr`
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &.expanded {
    background: #f0f9ff;
  }
`;

export const FaturaNumero = styled.strong`
  color: #0F3D5D;
  font-weight: 700;
`;

export const VencimentoSpan = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;

  &.vencido, &.hoje {
    background: #fee2e2;
    color: #dc2626;
  }

  &.proximo, &.pendente {
    background: #fef3c7;
    color: #d97706;
  }

  &.ok {
    background: #dcfce7;
    color: #16a34a;
  }

  &.desconhecido {
    background: #f1f5f9;
    color: #475569;
  }

  @media (max-width: 768px) {
    padding: 0.2rem 0.5rem;
    font-size: 0.65rem;
  }
`;

// ============================================
// DETALHES EXPANDIDOS - CARDS NO DESKTOP
// ============================================
export const ExpandedContent = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const SectionTitle = styled.h6`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0F3D5D;
  border-left: 3px solid #0F3D5D;
  padding-left: 0.75rem;
`;

// Cards style para desktop
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  strong {
    display: block;
    color: #0F3D5D;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  span {
    display: block;
    font-weight: 500;
    color: #1e293b;
    font-size: 0.875rem;
    word-break: break-word;
  }

  .valor {
    font-family: monospace;
    font-size: 0.875rem;
    color: #0F3D5D;
  }
`;

// Para mobile mantém o estilo linha
export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  strong {
    color: #0F3D5D;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span {
    font-weight: 500;
    color: #1e293b;
  }

  .valor {
    font-family: monospace;
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

// ============================================
// SUB-TABELA - BOLETOS
// ============================================
export const SubTable = styled.div`
  margin-top: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  
  table {
    width: 100%;
    font-size: 0.75rem;
    border-collapse: collapse;
    min-width: 500px;
  }

  th {
    text-align: left;
    padding: 0.75rem;
    background: #f1f5f9;
    color: #0F3D5D;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .valor {
    font-family: monospace;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    th, td {
      padding: 0.5rem;
    }
  }
`;

// Substitua a definição de StatusBadge por esta:

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;

  ${props => {
    switch (props.$status) {
      case 'A':
        return css`
          background: #dcfce7;
          color: #16a34a;
        `;
      case 'C':
        return css`
          background: #fee2e2;
          color: #dc2626;
        `;
      case 'P':
        return css`
          background: #fef3c7;
          color: #d97706;
        `;
      case 'Q':
        return css`
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'parcial':
        return css`
          background: #fff3cd;
          color: #856404;
        `;
      case 'processada':
        return css`
          background: #e0f2fe;
          color: #0369a1;
        `;
      case 'sem-boletos':
        return css`
          background: #f1f5f9;
          color: #475569;
        `;
      default:
        return css`
          background: #f1f5f9;
          color: #475569;
        `;
    }
  }}
`;

// ============================================
// BARRA DE PESQUISA LOCAL
// ============================================
export const SearchBar = styled.div`
  margin-bottom: 1.5rem;
`;

export const SearchInput = styled.div`
  position: relative;
  max-width: 300px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 1rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #0F3D5D;
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
    }
  }

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

export const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  display: flex;

  &:hover {
    color: #dc2626;
  }
`;

export const SearchInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const NoResults = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fef3c7;
  border-radius: 8px;
  color: #d97706;
  font-size: 0.75rem;
`;

// ============================================
// PAGINAÇÃO
// ============================================
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PaginationInfo = styled.div`
  font-size: 0.75rem;
  color: #64748b;

  strong {
    color: #0F3D5D;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

export const PageButton = styled.button`
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  background: ${props => props.$active ? '#0F3D5D' : 'white'};
  color: ${props => props.$active ? 'white' : '#475569'};
  border: 1px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #0F3D5D;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Ellipsis = styled.span`
  padding: 0 0.25rem;
  color: #94a3b8;
`;

// ============================================
// MODAL
// ============================================
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media (max-width: 640px) {
    max-width: 95%;
    border-radius: 20px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0F3D5D;
  }
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  display: flex;
  border-radius: 8px;

  &:hover {
    background: #e2e8f0;
    color: #dc2626;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const ModalSection = styled.div`
  margin-bottom: 1.5rem;

  h4 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0F3D5D;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
`;

export const ModalInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`;

export const ModalInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;

    &.valor-destaque {
      font-size: 1rem;
      font-weight: 700;
      color: #0F3D5D;
      font-family: monospace;
    }
  }
`;

export const ModalButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }
`;

// ============================================
// ERRO
// ============================================
export const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// ============================================
// COMPONENTE DE CARDS (Desktop) e LINHAS (Mobile)
// ============================================
export const DesktopCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MobileInfoList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const InfoCardDesktop = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .card-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    word-break: break-word;
  }

  .card-value-highlight {
    font-size: 1rem;
    font-weight: 700;
    color: #0F3D5D;
    font-family: monospace;
  }
`;