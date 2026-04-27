// src/styles/ui/Button/Button.jsx
import styled, { css } from 'styled-components';
import { Link } from "react-router-dom";

const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    color: white;
    border: none;
  `,
  secondary: css`
    background: var(--color-bg-primary);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  `,
  danger: css`
    background: linear-gradient(135deg, var(--color-danger) 0%, #b91c1c 100%);
    color: white;
    border: none;
  `,
  success: css`
    background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
    color: white;
    border: none;
  `,
  outline: css`
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    &:hover {
      background: var(--color-primary);
      color: white;
    }
  `,
  ghost: css`
    background: transparent;
    color: var(--color-primary);
    border: none;
    &:hover {
      background: var(--color-primary-light);
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: var(--font-size-xs);
    height: 36px;
  `,
  md: css`
    padding: 0.625rem 1.25rem;
    font-size: var(--font-size-sm);
    height: 42px;
  `,
  lg: css`
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-md);
    height: 48px;
  `,
};

export const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;

  background: ${({ $color }) => $color || 'var(--color-primary)'};
  color: #fff;

  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;

  transition: all 0.2s ease;
  min-width: 140px;

  svg {
    transition: transform 0.2s ease, color 0.2s ease;
  }

  &:hover {
    background: #fff;
    color: ${({ $color }) => $color || 'var(--color-primary)'};
    border-color: ${({ $color }) => $color || 'var(--color-primary)'};

    transform: translateY(-2px);
    box-shadow: var(--shadow-md);

    svg {
      transform: translateX(2px);
      color: ${({ $color }) => $color || 'var(--color-primary)'};
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  
  &:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    color: var(--color-primary);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;