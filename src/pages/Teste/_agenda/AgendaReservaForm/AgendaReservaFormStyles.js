import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const Hint = styled.span`
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 400;
  margin-left: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.7rem 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.7rem 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const ErrorMessage = styled.div`
  padding: 0.6rem 0.8rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.7rem 1.5rem;
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CancelButton = styled.button`
  padding: 0.7rem 1.5rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Estilo para o DatePicker
export const DatePickerWrapper = styled.div`
  .custom-datepicker {
    width: 100%;
    padding: 0.7rem 0.8rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.875rem;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #0F3D5D;
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
    }
  }
`;