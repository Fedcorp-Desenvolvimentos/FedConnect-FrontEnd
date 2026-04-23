import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Container
export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.5rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #0F3D5D;
    color: #0F3D5D;
  }
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
    color: white;
    transform: translateY(-2px);
  }
`;

// Alerts
export const ErrorAlert = styled.div`
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Search Bar
export const SearchBarWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  max-width: 400px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 1rem;
  }

  @media (max-width: 640px) {
    max-width: 100%;
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

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    font-weight: 600;
    color: #0F3D5D;
    background: #f8fafc;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    th, td {
      padding: 0.75rem 0.5rem;
      font-size: 0.875rem;
    }
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  color: ${props => props.$danger ? '#dc2626' : '#0F3D5D'};

  &:hover {
    opacity: 0.7;
    transform: scale(1.05);
  }

  svg {
    font-size: 1.125rem;
  }
`;

export const ActionsCell = styled.td`
  white-space: nowrap;
`;

// Pagination
export const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button`
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
  color: #64748b;
  font-size: 0.875rem;
`;

export const TotalRegistros = styled.span`
  margin-left: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    padding: 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
`;

export const ModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
`;

export const FormInput = styled.input`
  padding: 0.75rem 1rem;
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

export const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ConfirmMessage = styled.p`
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  strong {
    color: #0F3D5D;
  }
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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