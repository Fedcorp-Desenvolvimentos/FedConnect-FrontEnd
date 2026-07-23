// src/pages/Financeiro/Santander/Workspaces/SantanderWorkspacesStyles.js
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

  ConfigCard: styled.div`
    background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    animation: ${fadeIn} 0.3s ease;
  `,

  ConfigHeader: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  `,

  ConfigIcon: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    
    svg {
      font-size: 24px;
    }
  `,

  ConfigInfo: styled.div`
    flex: 1;
  `,

  ConfigTitle: styled.h3`
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  `,

  ConfigSubtitle: styled.p`
    margin: 4px 0 0;
    font-size: 0.8rem;
    opacity: 0.8;
  `,

  ConfigBadge: styled.span`
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 500;
  `,

  ConfigDetails: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `,

  ConfigItem: styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    
    span {
      opacity: 0.7;
      min-width: 140px;
    }
    
    code {
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.75rem;
    }
  `,

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
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    
    svg {
      color: var(--color-primary);
    }
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

  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
    animation: ${fadeIn} 0.3s ease;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

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
    padding: 16px 20px;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border-light);
  `,

  CardTitle: styled.h3`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary);
    
    svg {
      font-size: 18px;
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
    
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${props => props.$color};
    }
  `,

  CardBody: styled.div`
    padding: 16px 20px 20px;
  `,

  CardInfo: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  `,

  InfoRow: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    
    > span:first-child {
      min-width: 100px;
      color: var(--color-text-tertiary);
    }
    
    > span:last-child {
      color: var(--color-text-primary);
      font-weight: 500;
    }
    
    code {
      background: var(--color-bg-tertiary);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.7rem;
      color: var(--color-text-primary);
    }
  `,

  WebhookStatus: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${props => props.$active ? '#10b981' : '#ef4444'};
    font-weight: 500;
    
    svg {
      font-size: 14px;
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
};