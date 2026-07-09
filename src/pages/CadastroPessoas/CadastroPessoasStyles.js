import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 1.5rem;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
`;

export const Title = styled.h2`
  font-size: 1.35rem;
  font-weight: 600;
  color: #0f3d5d;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg {
    font-size: 1.4rem;
    color: #3b82f6;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Section = styled.div`
  padding: 1.25rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  opacity: ${props => props.disabled ? 0.7 : 1};
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0f3d5d;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const SectionInlineHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: center;
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormGroup = styled.div`
  flex: ${props => props.$flex || '1 1 100%'};
  min-width: 120px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.25rem;

  .required {
    color: #ef4444;
    margin-left: 2px;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${props => props.disabled ? '#f8fafc' : 'white'};

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  &:hover:not(:disabled) {
    border-color: #94a3b8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.disabled ? '#f8fafc' : 'white'};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${props => props.disabled ? '#f8fafc' : 'white'};

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const InputWithButton = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;

  > *:first-child {
    flex: 1;
  }
`;

export const IconSquareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  min-width: 2.4rem;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: ${props => props.disabled ? '#e2e8f0' : '#f1f5f9'};
  color: ${props => props.disabled ? '#94a3b8' : '#475569'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f3d5d;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

export const PhoneGroup = styled.div`
  display: flex;
  gap: 0.4rem;

  > *:first-child {
    flex: 0 1 76px;
  }

  > *:last-child {
    flex: 1;
  }
`;

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.disabled ? '#94a3b8' : '#475569'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  input {
    width: 1.1rem;
    height: 1.1rem;
    accent-color: #3b82f6;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

export const ChecklistBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.8rem;
  padding: 0.75rem;
  border: 1.5px solid ${props => props.$error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  background: #fafbfc;
  min-height: 50px;
  max-height: 120px;
  overflow-y: auto;
  flex: 1;
`;

export const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.disabled ? '#94a3b8' : '#334155'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  input {
    width: 0.9rem;
    height: 0.9rem;
    accent-color: #3b82f6;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`;

export const ChecklistFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

export const ErrorMessage = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

// ==================== AÇÕES DO FORMULÁRIO ====================
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 0.9rem;
  }
`;

export const SuccessButton = styled(Button)`
  background: #22c55e;
  color: white;

  &:hover:not(:disabled) {
    background: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(34,197,94,0.3);
  }
`;

export const DangerButton = styled(Button)`
  background: #ef4444;
  color: white;

  &:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(239,68,68,0.3);
  }
`;

export const SecondaryButton = styled(Button)`
  background: #f1f5f9;
  color: #475569;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f3d5d;
  }
`;

// ==================== TABELA ====================
export const TableWrapper = styled.div`
  margin-top: 1rem;
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead {
    background: #f8fafc;
  }

  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }

  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #f1f5f9;
    }

    &.selected {
      background: #dbeafe;
      border-left: 3px solid #3b82f6;
    }

    &.empty {
      cursor: default;
    }
  }

  .empty {
    padding: 2rem;
    text-align: center;
    color: #94a3b8;
  }
`;

export const EmptyRow = styled.td`
  text-align: center;
  color: #94a3b8;
  padding: 2rem !important;
`;

// ==================== LOGO ====================
export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

export const LogoPreview = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  svg {
    font-size: 1.5rem;
    color: #94a3b8;
  }
`;

// CadastroPessoasStyles.js - adicione:

export const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

export const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #0f3d5d;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #0f3d5d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1a5a7a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ClearButton = styled.button`
  padding: 0.6rem 1rem;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }
`;

export const ResultInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
`;