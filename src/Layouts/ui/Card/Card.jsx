// src/styles/ui/Card/Card.jsx

import styled, { css } from 'styled-components';

export const Card = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  overflow: hidden;
  height: 100%;
  position: relative;
  
  ${props => props.$hover && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-border);
    }
  `}
  
  ${props => props.$withBorder && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${props.$color || 'var(--color-primary)'};
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: left;
    }
    
    &:hover::before {
      transform: scaleX(1);
    }
  `}
`;

export const CardBody = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;