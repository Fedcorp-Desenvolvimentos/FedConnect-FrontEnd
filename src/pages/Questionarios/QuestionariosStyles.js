// src/pages/Questionarios/QuestionariosStyles.js
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const modalIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 1.5rem;
  color: #1f2937;

  @media (max-width: 560px) {
    padding: 1rem;
  }
`;

export const Header = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
  
  @media (max-width: 900px) {
    text-align: center;
  }
`;

export const HeaderTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0.75rem;
  border-radius: 999px;
  background: #e8f0ff;
  color: #1d4ed8;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;

  @media (max-width: 560px) {
    font-size: 1.5625rem;
  }
`;

export const HeaderSubtitle = styled.p`
  margin: 0.5rem 0 0;
  max-width: 720px;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const HeaderCard = styled.div`
  min-width: 190px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: center;

  strong {
    font-size: 2.125rem;
    color: #1d4ed8;
    line-height: 1;
  }

  span {
    margin-top: 0.375rem;
    color: #6b7280;
    font-size: 0.8125rem;
  }
`;

export const Alert = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 14px;
  margin-bottom: 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;

  ${props => props.$variant === 'success' && `
    background: #ecfdf3;
    color: #166534;
    border: 1px solid #bbf7d0;
  `}

  ${props => props.$variant === 'error' && `
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  `}
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const FormTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }

  h2 {
    margin: 0;
    color: #111827;
    font-size: 1.375rem;
    font-weight: 800;
  }

  p {
    margin: 0.375rem 0 0;
    color: #6b7280;
    font-size: 0.8125rem;
  }
`;

export const FormActionsTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 900px) {
    width: 100%;
    flex-direction: column;
  }

  button {
    @media (max-width: 900px) {
      width: 100%;
    }
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);

  @media (max-width: 560px) {
    padding: 1rem;
  }

  h3 {
    margin: 0 0 1rem;
    color: #111827;
    font-size: 1.0625rem;
    font-weight: 800;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const QuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;

  label {
    color: #374151;
    font-size: 0.8125rem;
    font-weight: 700;
  }

  input, textarea {
    width: 100%;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    border-radius: 12px;
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
    outline: none;
    transition: 0.2s ease;

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
  }

  textarea {
    min-height: 95px;
    resize: vertical;
    line-height: 1.5;
  }
`;

export const Button = styled.button`
  border: none;
  border-radius: 12px;
  padding: 0.6875rem 0.9375rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled(Button)`
  background: #2563eb;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`;

export const SecondaryButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #e5e7eb;
  }
`;

export const DangerButton = styled(Button)`
  background: #dc2626;
  color: #ffffff;

  &:hover {
    background: #b91c1c;
  }
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.97);
  }
`;

export const ViewIconButton = styled(IconButton)`
  background: #e0f2fe;
  color: #0369a1;
`;

export const EditIconButton = styled(IconButton)`
  background: #fef3c7;
  color: #b45309;
`;

export const DeleteIconButton = styled(IconButton)`
  background: #fee2e2;
  color: #b91c1c;
`;

export const ListSection = styled.section`
  margin-top: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);

  @media (max-width: 560px) {
    padding: 1rem;
  }
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.125rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
  }

  h2 {
    margin: 0;
    color: #111827;
    font-size: 1.375rem;
    font-weight: 800;
  }

  p {
    margin: 0.375rem 0 0;
    color: #6b7280;
    font-size: 0.8125rem;
  }
`;

export const SearchBox = styled.div`
  width: 360px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 0.75rem;
  color: #6b7280;

  @media (max-width: 900px) {
    width: 100%;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0.75rem 0;
    font-size: 0.875rem;
    color: #111827;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;

  th, td {
    padding: 0.875rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
  }

  th {
    color: #374151;
    background: #f9fafb;
    font-weight: 800;
  }

  td {
    color: #4b5563;
  }

  tbody tr:hover {
    background: #f8fafc;
  }
`;

export const ActionsCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const EmptyState = styled.div`
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 2.5rem 1.25rem;
  text-align: center;
  background: #f8fafc;

  svg {
    font-size: 2.125rem;
    color: #2563eb;
    margin-bottom: 0.75rem;
  }

  h3 {
    margin: 0;
    color: #111827;
    font-size: 1.125rem;
  }

  p {
    margin: 0.5rem auto 0;
    max-width: 520px;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

// Modal styles
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
`;

export const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
  border: 1px solid #e5e7eb;
  animation: ${modalIn} 0.2s ease;
  width: 100%;
  max-width: ${props => props.$small ? '430px' : '900px'};
  max-height: ${props => props.$small ? 'auto' : '86vh'};
  overflow: ${props => props.$small ? 'auto' : 'hidden'};
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0;
    color: #111827;
    font-size: 1.375rem;
    font-weight: 800;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

export const ModalCardSmall = styled(ModalCard)`
  padding: 1.5rem;
  max-width: 430px;
`;

export const ModalHeader = styled.div`
  padding: 1.375rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  p {
    margin: 0.375rem 0 0;
  }
`;

export const ModalCloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #f3f4f6;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e7eb;
  }
`;

export const ModalContent = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalActions = styled.div`
  margin-top: 1.375rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
`;

export const ResumoItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0.875rem;

  strong {
    display: block;
    margin-bottom: 0.4375rem;
    color: #111827;
    font-size: 0.8125rem;
  }

  p {
    margin: 0;
    color: #4b5563;
    white-space: pre-wrap;
  }
`;

export const SpinnerIcon = styled.div`
  animation: ${spin} 0.6s linear infinite;
  display: inline-flex;
`;

// Adicione no QuestionariosStyles.js, após os outros componentes

export const StyledSelect = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 12px;
  padding: 0.75rem 0.875rem;
  font-size: 0.875rem;
  outline: none;
  transition: 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  background-size: 1rem;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }
`;

export const NewButton = styled(PrimaryButton)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 0.75rem 1.5rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  /* Responsividade */
  @media (max-width: 900px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.8125rem;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
    white-space: normal;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }

  svg {
    @media (max-width: 640px) {
      font-size: 0.875rem;
    }
  }
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid #e5e7eb;

  button {
    min-width: 200px;
  }

  @media (max-width: 640px) {
    button {
      width: 100%;
    }
  }
`;

export const ListActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ExportButton = styled.button`
  border: none;
  background: #1f8f4d;
  color: #ffffff;
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: 0.2s ease;

  &:hover:not(:disabled) {
    background: #18743e;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;