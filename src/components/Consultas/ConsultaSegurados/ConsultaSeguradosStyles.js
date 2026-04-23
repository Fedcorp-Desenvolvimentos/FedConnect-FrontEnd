import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expandDetail = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// Opções (cards)
export const OptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const OptionCard = styled.div`
  flex: 1;
  background: white;
  border: 2px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  color: ${props => props.$active ? '#0F3D5D' : '#64748b'};
  padding: 1.25rem 1rem;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(15, 61, 93, 0.1)' : 'none'};

  &:hover {
    transform: translateY(-4px);
    border-color: #0F3D5D;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  h5 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const OptionIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border-radius: 50%;
  margin-bottom: 0.75rem;

  svg {
    font-size: 1.5rem;
  }
`;

// Formulário
export const Form = styled.form`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
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

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    
    label {
      display: none;
    }
  }
`;

export const Button = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Autocomplete
export const AutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
`;

export const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? '#e0f2fe' : 'white'};
  font-size: 0.875rem;

  &:hover {
    background: #f1f5f9;
  }
`;

// Resultados
export const ResultCard = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

export const ResultTitle = styled.h3`
  color: #0F3D5D;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const SeguradosList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SeguradoItem = styled.li`
  background: ${props => props.$expanded ? '#f0f9ff' : '#f8fafc'};
  border: 1px solid ${props => props.$expanded ? '#0F3D5D' : '#e2e8f0'};
  border-radius: 12px;
  margin-bottom: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
`;

export const SeguradoHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

export const SeguradoInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  text-align: left;
`;

export const SeguradoNome = styled.strong`
  color: #0F3D5D;
  font-size: 0.9375rem;
`;

export const SeguradoCpf = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  background: white;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
`;

export const ExpandIcon = styled.span`
  color: #64748b;
  font-size: 1rem;
`;

export const SeguradoDetails = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: white;
  animation: ${expandDetail} 0.2s ease;
`;

export const DetailRow = styled.div`
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #0F3D5D;
    margin-right: 0.5rem;
  }
`;

export const InfoText = styled.div`
  margin-top: 1rem;
  font-size: 0.75rem;
  font-style: italic;
  color: #64748b;
  text-align: center;
`;