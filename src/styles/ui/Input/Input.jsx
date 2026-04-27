// src/styles/ui/Input/Input.jsx

import styled, { css } from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  transition: all var(--transition-base);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
  
  &:disabled {
    background: var(--color-bg-tertiary);
    cursor: not-allowed;
  }
  
  ${props => props.$error && css`
    border-color: var(--color-danger);
    &:focus {
      box-shadow: 0 0 0 3px var(--color-danger-bg);
    }
  `}
`;

export const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
`;