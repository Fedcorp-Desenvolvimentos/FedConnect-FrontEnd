import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(36, 99, 235, 0.07);
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// ============================================
// FLAGS GRID
// ============================================
export const FlagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// ============================================
// FORMULÁRIO
// ============================================
export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  color: #1e293b;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ReadonlyInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  width: 100%;
  cursor: not-allowed;
`;

// ============================================
// RADIO GROUP
// ============================================
export const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  border-radius: 40px;
  background: ${props => props.$active ? '#f0f7ff' : 'white'};
  color: ${props => props.$active ? '#0F3D5D' : '#475569'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0F3D5D;
    background: #f8fafc;
  }

  input {
    display: none;
  }

  svg {
    font-size: 0.875rem;
  }
`;

// ============================================
// BOTÃO
// ============================================
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
`;

export const ResultButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 240px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 61, 93, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: auto;
  }
`;

// ============================================
// RESULTADOS
// ============================================
export const ResultContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.3s ease;
`;

export const ResultRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  text-align: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ResultInput = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.$highlight ? '#10b981' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  background: white;
  color: ${props => props.$highlight ? '#10b981' : '#1e293b'};
  width: 100%;

  &:focus {
    outline: none;
  }
`;