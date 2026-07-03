// src/pages/CadastrosGerais/CadastroPessoasStyles.js

import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Container
export const Container = styled.div`
  padding: 2rem;
  max-width: 1300px;
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
    padding: 1.5rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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
  color: #0f3d5d;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    font-size: 1.5rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 640px) {
    width: 100%;

    button {
      flex: 1 1 auto;
    }
  }
`;

// Buttons
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, #0f3d5d 0%, #1a5a7a 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }
`;

export const SuccessButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, #15803d 0%, #22a35a 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(21, 128, 61, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #0f3d5d;
    color: #0f3d5d;
  }
`;

export const DangerButton = styled.button`
  ${buttonBase}
  background: #fee2e2;
  color: #dc2626;

  &:hover:not(:disabled) {
    background: #dc2626;
    color: white;
    transform: translateY(-2px);
  }
`;

export const IconSquareButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #0f3d5d;
    color: #0f3d5d;
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Form
export const Form = styled.form`
  animation: ${fadeIn} 0.3s ease;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: ${props => props.$flex || '1 1 200px'};
  min-width: ${props => props.$minWidth || '160px'};

  @media (max-width: 768px) {
    flex: 1 1 100%;
    min-width: 0;
  }
`;

export const FormLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .required {
    color: #dc2626;
    margin-left: 0.15rem;
  }
`;

export const InputWithButton = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;

  > *:first-child {
    flex: 1;
  }
`;

export const FormInput = styled.input`
  padding: 0.65rem 0.85rem;
  border: 2px solid ${props => (props.$error ? '#dc2626' : '#e2e8f0')};
  border-radius: 10px;
  font-size: 0.875rem;
  background: ${props => (props.disabled ? '#f1f5f9' : 'white')};
  color: #1e293b;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => (props.$error ? '#dc2626' : '#0f3d5d')};
    box-shadow: 0 0 0 3px ${props => (props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)')};
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
    color: #64748b;
  }
`;

export const FormSelect = styled.select`
  padding: 0.65rem 0.85rem;
  border: 2px solid ${props => (props.$error ? '#dc2626' : '#e2e8f0')};
  border-radius: 10px;
  font-size: 0.875rem;
  background: ${props => (props.disabled ? '#f1f5f9' : 'white')};
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => (props.$error ? '#dc2626' : '#0f3d5d')};
    box-shadow: 0 0 0 3px ${props => (props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)')};
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
    color: #64748b;
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.65rem 0.85rem;
  border: 2px solid ${props => (props.$error ? '#dc2626' : '#e2e8f0')};
  border-radius: 10px;
  font-size: 0.875rem;
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
  background: ${props => (props.disabled ? '#f1f5f9' : 'white')};
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => (props.$error ? '#dc2626' : '#0f3d5d')};
    box-shadow: 0 0 0 3px ${props => (props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)')};
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
    color: #64748b;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.72rem;
  color: #dc2626;
`;

export const HelpText = styled.span`
  font-size: 0.72rem;
  color: #94a3b8;
`;

// Phone group (DDD + number)
export const PhoneGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  input:first-child {
    max-width: 70px;
    text-align: center;
  }
`;

// Checkbox
export const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => (props.disabled ? '#94a3b8' : '#1e293b')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  white-space: nowrap;

  input {
    width: 18px;
    height: 18px;
    accent-color: #0f3d5d;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

// Section
export const Section = styled.fieldset`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 0 1.5rem 0;
  border: 1px solid #eef2f6;

  &:last-child {
    margin-bottom: 0;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const SectionTitle = styled.legend`
  padding: 0 0.5rem;
  margin-left: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #0f3d5d;
`;

export const SectionInlineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

// Logo box
export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const LogoPreview = styled.div`
  width: 90px;
  height: 70px;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
  color: #94a3b8;
  font-size: 1.25rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// Categorias checklist
export const ChecklistBox = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  max-height: 160px;
  overflow-y: auto;
  padding: 0.5rem 0;
`;

export const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  color: ${props => (props.disabled ? '#94a3b8' : '#334155')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${props => (props.disabled ? 'transparent' : '#f8fafc')};
  }

  input {
    width: 16px;
    height: 16px;
    accent-color: #0f3d5d;
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  }
`;

export const ChecklistFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

// Table
export const TableWrapper = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
`;

export const TableScroll = styled.div`
  max-height: 260px;
  overflow-y: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  thead th {
    position: sticky;
    top: 0;
    background: #0f3d5d;
    color: white;
    text-align: left;
    padding: 0.65rem 0.9rem;
    font-weight: 600;
    white-space: nowrap;
  }

  tbody td {
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  tbody tr.selected {
    background: #0f3d5d;
  }

  tbody tr.selected td {
    color: white;
  }

  tbody tr.empty:hover {
    background: transparent;
    cursor: default;
  }
`;

export const EmptyRow = styled.td`
  text-align: center;
  padding: 1.5rem !important;
  color: #94a3b8 !important;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: #0f3d5d;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  p {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

// Tabs
export const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.25rem;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border: none;
  background: ${props => props.active ? '#0f3d5d' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border-radius: 10px 10px 0 0;
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#0f3d5d' : '#f1f5f9'};
    color: ${props => props.active ? 'white' : '#0f3d5d'};
  }

  svg {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.3rem;

    span {
      display: none;
    }
  }
`;