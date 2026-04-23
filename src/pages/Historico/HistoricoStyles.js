import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Search Bar
export const SearchBarWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 1rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

// Table
export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 1.5rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #0F3D5D;
    font-size: 0.875rem;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #1e293b;
    font-size: 0.875rem;
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc;
    }

    &.active-row {
      background-color: #e0f2fe;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;

    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
`;

export const ExpandIcon = styled.td`
  text-align: center;
  width: 40px;

  svg {
    font-size: 1rem;
    color: #64748b;
    transition: transform 0.3s ease;
  }
`;

// Detalhes Panel
export const DetalhesRow = styled.tr`
  background-color: #f8fafc;
`;

export const DetalhesPanel = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  margin: 0.5rem;
  animation: ${slideDown} 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const DetalhesTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DetalhesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const DetalhesItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: #64748b;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span {
    color: #1e293b;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

export const ResultadoBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #0F3D5D;

  h5 {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    font-weight: 700;
    color: #0F3D5D;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const ResultadoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ResultadoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  strong {
    color: #64748b;
    font-size: 0.7rem;
  }

  span {
    font-size: 0.875rem;
    color: #1e293b;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
`;

export const MatchKeys = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  color: #475569;
`;

// Pagination
export const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PaginationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background: #0F3D5D;
    color: white;
    border-color: #0F3D5D;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  color: #475569;
  font-weight: 500;
  font-size: 0.875rem;
`;

export const TotalRegistros = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

// States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: #0F3D5D;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 12px;

  svg {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

export const DetalhesLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 0.5rem;

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #e2e8f0;
    border-top-color: #0F3D5D;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  p {
    color: #64748b;
    font-size: 0.75rem;
  }
`;

export const DetalhesError = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.75rem;
`;

export const DetalhesEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;

  svg {
    font-size: 2rem;
    color: #cbd5e1;
  }

  p {
    color: #64748b;
    font-size: 0.75rem;
  }
`;