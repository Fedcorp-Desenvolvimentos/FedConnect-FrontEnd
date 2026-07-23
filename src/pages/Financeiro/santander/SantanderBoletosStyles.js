// src/pages/Financeiro/Santander/Boletos/SantanderBoletosStyles.js
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 4px 0;
  `,

  BackButton: styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
    width: fit-content;
    
    &:hover {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }
    
    svg {
      font-size: 16px;
    }
  `,

  // Filtros
  FiltrosCard: styled.div`
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 20px 24px;
    animation: ${fadeIn} 0.3s ease;
  `,

  FiltrosGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr 1fr;
    }
    
    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  `,

  FiltroGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  FiltroLabel: styled.label`
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  FiltroInput: styled.input`
    padding: 8px 12px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 0.85rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
    }
  `,

  FiltroSelect: styled.select`
    padding: 8px 12px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 0.85rem;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
    }
  `,

  FiltroActions: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-light);
    
    @media (max-width: 400px) {
      flex-direction: column;
    }
  `,

  FiltroButton: styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    ${props => props.variant === 'primary' && `
      background: var(--color-primary);
      color: white;
      
      &:hover {
        background: var(--color-primary-dark);
        box-shadow: 0 2px 8px rgba(15, 61, 93, 0.3);
      }
    `}
    
    ${props => props.variant === 'secondary' && `
      background: var(--color-bg-secondary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border-light);
      
      &:hover {
        background: var(--color-bg-tertiary);
        color: var(--color-text-primary);
      }
    `}
    
    svg {
      font-size: 16px;
    }
  `,

  // Header
  Header: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  `,

  HeaderLeft: styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  Title: styled.h2`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
  `,

  Subtitle: styled.p`
    margin: 0;
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  `,

  HeaderRight: styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  `,

  RefreshButton: styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    color: var(--color-text-primary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: var(--color-bg-tertiary);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    svg {
      font-size: 16px;
      
      &.spinning {
        animation: ${spin} 1s linear infinite;
      }
    }
  `,

  CreateButton: styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--color-primary);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
    }
    
    svg {
      font-size: 18px;
    }
  `,

  // Loading
  LoadingContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 16px;
    color: var(--color-text-secondary);
  `,

  LoadingSpinner: styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border-light);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  `,

  // Empty State
  EmptyState: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    background: var(--color-bg-secondary);
    border-radius: 16px;
    border: 2px dashed var(--color-border-light);
    
    h3 {
      margin: 16px 0 8px;
      color: var(--color-text-primary);
    }
    
    p {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }
  `,

  EmptyIcon: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: var(--color-bg-tertiary);
    border-radius: 50%;
    
    svg {
      font-size: 32px;
      color: var(--color-text-secondary);
    }
  `,

  // Grid
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    animation: ${fadeIn} 0.3s ease;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

  // Card
  Card: styled.div`
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-light);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }
  `,

  CardHeader: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border-light);
  `,

  CardTitle: styled.h3`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-primary);
    
    svg {
      font-size: 16px;
      color: var(--color-primary);
    }
  `,

  StatusBadge: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 500;
    background: ${props => `${props.$color}20`};
    color: ${props => props.$color};
    
    svg {
      font-size: 14px;
    }
  `,

  CardBody: styled.div`
    padding: 16px 18px 18px;
  `,

  InfoGrid: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
    margin-bottom: 14px;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,

  InfoItem: styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  InfoLabel: styled.span`
    font-size: 0.6rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    letter-spacing: 0.5px;
  `,

  InfoValue: styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: var(--color-text-primary);
    word-break: break-word;
    
    code {
      background: var(--color-bg-tertiary);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.7rem;
      color: var(--color-text-primary);
    }
    
    svg {
      font-size: 14px;
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }
  `,

  CardActions: styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid var(--color-border-light);
  `,

  ActionButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    svg {
      font-size: 16px;
    }
    
    ${props => {
      switch (props.variant) {
        case 'details':
          return `
            background: var(--color-bg-tertiary);
            color: var(--color-text-secondary);
            
            &:hover {
              background: var(--color-primary);
              color: white;
            }
          `;
        case 'edit':
          return `
            background: var(--color-bg-tertiary);
            color: #3b82f6;
            
            &:hover {
              background: #3b82f6;
              color: white;
            }
          `;
        case 'delete':
          return `
            background: var(--color-bg-tertiary);
            color: #ef4444;
            
            &:hover {
              background: #ef4444;
              color: white;
            }
          `;
        default:
          return '';
      }
    }}
  `,

  // Pagination
  Pagination: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 4px;
    border-top: 1px solid var(--color-border-light);
    
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
    }
  `,

  PaginationInfo: styled.span`
    font-size: 0.85rem;
    color: var(--color-text-secondary);
  `,

  PaginationButtons: styled.div`
    display: flex;
    gap: 8px;
  `,

  PaginationButton: styled.button`
    padding: 6px 16px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: var(--color-bg-tertiary);
    }
    
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
};