import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
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

// Tabs
export const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    background: transparent;
    gap: 0.75rem;
    padding: 0;
  }
`;

export const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#0F3D5D' : '#64748b'};
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'};

  svg {
    font-size: 1.125rem;
  }

  &:hover:not(:active) {
    background: ${props => props.$active ? 'white' : '#e2e8f0'};
    color: #0F3D5D;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    background: ${props => props.$active ? '#f8fafc' : 'transparent'};
    border: 1px solid ${props => props.$active ? '#0F3D5D' : '#e2e8f0'};
  }
`;

// Forms
export const Form = styled.form`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.3s ease;
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
  
  ${props => props.required && css`
    &::after {
      content: '*';
      color: #dc2626;
      margin-left: 4px;
    }
  `}
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
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

// Massa
export const MassContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ButtonOutline = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #0F3D5D;
  border: 2px solid #0F3D5D;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0F3D5D;
    color: white;
    transform: translateY(-2px);
  }
`;

export const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e0f2fe;
  border-radius: 12px;
  color: #0369a1;
  font-weight: 500;

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const InfoMessage = styled.div`
  padding: 1rem;
  background: ${props => props.$isError ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$isError ? '#b91c1c' : '#166534'};
  border-radius: 12px;
  font-weight: 500;
`;

// Resultados
export const ResultCard = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.3s ease;
`;

export const ResultTitle = styled.h3`
  color: #0F3D5D;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const ResultField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const ResultLabel = styled.span`
  font-weight: 600;
  color: #64748b;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ResultValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  flex-wrap: wrap;
`;

export const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0F3D5D;
  }
`;

export const MapsButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e2e8f0;
  color: #0F3D5D;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0F3D5D;
    color: white;
  }
`;

export const MapsButtonSmall = styled.button`
  background: #e2e8f0;
  border: none;
  cursor: pointer;
  color: #0F3D5D;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #0F3D5D;
    color: white;
  }
`;

export const ResultItem = styled.div`
  margin-bottom: 0.75rem;
  border: 1px solid ${props => props.$expanded ? '#0F3D5D' : '#e2e8f0'};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
`;

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${props => props.$expanded ? '#f0f9ff' : 'white'};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  strong {
    color: #0F3D5D;
    font-size: 0.9375rem;
  }

  small {
    color: #64748b;
    font-size: 0.75rem;
  }

  svg {
    color: #64748b;
    font-size: 1.125rem;
  }
`;

export const ResultDetails = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

export const DetailRow = styled.div`
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #334155;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  strong {
    color: #0F3D5D;
    margin-right: 0.5rem;
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-weight: 500;
`;