// src/pages/FormatosArquivos/ConverterBoletoCSVStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #2463eb;
    box-shadow: 0 0 0 3px rgba(36, 99, 235, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

export const Button = styled.button`
  padding: 0.875rem 1.5rem;
  background: ${props => props.$loading ? '#ccc' : '#2463eb'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$loading ? '#ccc' : '#1a52c4'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #2463eb;
    color: #2463eb;
  }
`;

export const InfoBox = styled.div`
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #666;
  border-left: 3px solid #2463eb;
  
  p {
    margin: 0.5rem 0;
    line-height: 1.5;
  }
  
  strong {
    color: #333;
  }
`;

export const SpinAnimation = styled.div`
  display: inline-flex;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;