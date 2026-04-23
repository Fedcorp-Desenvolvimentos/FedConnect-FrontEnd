import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Card = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
  }
`;

export const ResetButton = styled.button`
  background: #f1f5f9;
  border: none;
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2e8f0;
    color: #0F3D5D;
    transform: rotate(180deg);
  }
`;

// Form
export const Form = styled.form`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #1e293b;
`;

export const Required = styled.span`
  color: #dc2626;
  margin-left: 0.25rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$error ? '#dc2626' : '#e2e8f0'};
  border-radius: 10px;
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
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$error ? '#dc2626' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
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

export const ErrorMessage = styled.span`
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fffbeb;
  color: #d97706;
  border-radius: 8px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

export const LoadingSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
  color: #64748b;
  border: 1px solid #e2e8f0;

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

// Message Alert
export const MessageAlert = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideIn} 0.3s ease;

  ${props => props.$type === 'success' && `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #a3e9a3;
  `}

  ${props => props.$type === 'error' && `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}

  ${props => props.$type === 'warning' && `
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
  `}
`;

export const AlertClose = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

// Submit Button
export const SubmitButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
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