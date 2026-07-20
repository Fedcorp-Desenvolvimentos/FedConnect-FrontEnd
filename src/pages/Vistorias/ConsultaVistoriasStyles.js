// src/pages/Vistorias/ConsultaVistoriasStyles.js

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
  height: 46px;
  min-height: 46px;
  max-height: 46px;
  box-sizing: border-box;

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
  height: 46px;
  min-height: 46px;
  max-height: 46px;
  box-sizing: border-box;

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
// TABELA PRINCIPAL
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
  min-width: 700px;

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

  .valor {
    font-family: monospace;
    font-weight: 600;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    min-width: auto;
    
    th, td {
      padding: 0.6rem 0.4rem;
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
  max-width: 700px;
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
  font-size: 1.5rem;

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

  p {
    margin: 0;
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
// SHIMMER EFFECT
// ============================================
const shimmerAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const ShimmerInput = styled.div`
  width: 100%;
  height: 46px;
  min-height: 46px;
  max-height: 46px;
  border-radius: 12px;
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px 100%;
  animation: ${shimmerAnimation} 1.2s ease-in-out infinite;
  border: 2px solid #e2e8f0;
`;
