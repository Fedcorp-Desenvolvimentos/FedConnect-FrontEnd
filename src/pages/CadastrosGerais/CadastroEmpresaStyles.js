// src/pages/CadastrosGerais/CadastroEmpresaStyles.js

import styled, { keyframes } from 'styled-components';

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
    padding: 1.5rem;
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
  gap: 0.75rem;

  svg {
    font-size: 1.5rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

// Buttons
export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #0F3D5D;
    color: #0F3D5D;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #dc2626;
    color: white;
    transform: translateY(-2px);
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

export const StepContent = styled.div`
  min-height: 400px;
  padding: 1.5rem 0;

  @media (max-width: 768px) {
    min-height: 300px;
    padding: 1rem 0;
  }
`;

export const StepTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Form Groups
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .required {
    color: #dc2626;
    margin-left: 0.25rem;
  }
`;

export const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$error ? '#dc2626' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#dc2626' : '#0F3D5D'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)'};
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }
`;

export const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$error ? '#dc2626' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#dc2626' : '#0F3D5D'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)'};
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$error ? '#dc2626' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#dc2626' : '#0F3D5D'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(15, 61, 93, 0.1)'};
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
`;

export const HelpText = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
`;

// Stepper
export const StepperContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 4rem);
    height: 2px;
    background: #e2e8f0;
    z-index: 0;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 0;

    &::before {
      display: none;
    }
  }
`;

export const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  position: relative;
  z-index: 1;
  padding: 0.5rem;

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.5rem 0;
  }
`;

export const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.$completed) return '#0F3D5D';
    if (props.$active) return '#0F3D5D';
    return '#e2e8f0';
  }};
  color: ${props => {
    if (props.$completed) return 'white';
    if (props.$active) return 'white';
    return '#94a3b8';
  }};

  ${props => props.$clickable && `
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.2);
    }
  `}
`;

export const StepLabel = styled.span`
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#0F3D5D' : '#64748b'};
  display: ${props => props.$hideOnMobile ? 'none' : 'inline'};

  @media (min-width: 641px) {
    display: inline;
  }
`;

export const StepStatus = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-left: 0.5rem;
`;

// Section
export const Section = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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