// src/pages/Financeiro/Santander/Empresas/SantanderEmpresasStyles.js
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

  ResumoCard: styled.div`
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 12px;
    padding: 20px 24px;
    animation: ${fadeIn} 0.3s ease;
  `,

  ResumoGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  `,

  ResumoItem: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  `,

  ResumoValor: styled.span`
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.color || 'var(--color-text-primary)'};
  `,

  ResumoLabel: styled.span`
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-top: 2px;
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
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
    
    svg {
      font-size: 14px;
    }
  `,

  CardBody: styled.div`
    padding: 20px;
  `,

  InfoGrid: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 16px;
    
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
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    letter-spacing: 0.5px;
  `,

  InfoValue: styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    color: var(--color-text-primary);
    
    code {
      background: var(--color-bg-tertiary);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.7rem;
      color: var(--color-text-primary);
    }
  `,

  EnvironmentBadge: styled.span`
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 500;
    background: ${props => props.$ambiente === 'producao' ? '#10b98120' : '#f59e0b20'};
    color: ${props => props.$ambiente === 'producao' ? '#10b981' : '#f59e0b'};
  `,

  Divider: styled.hr`
    margin: 16px 0;
    border: none;
    border-top: 1px solid var(--color-border-light);
  `,

  CertificadoInfo: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  CertificadoTitle: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text-primary);
    
    svg {
      font-size: 16px;
    }
  `,

  CertificadoGrid: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,

  CertificadoItem: styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    
    > span:first-child {
      color: var(--color-text-tertiary);
      min-width: 90px;
    }
    
    > span:last-child, code {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--color-text-primary);
      
      svg {
        font-size: 14px;
      }
    }
    
    code {
      background: var(--color-bg-tertiary);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.7rem;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
      white-space: nowrap;
    }
  `,

  DiasRestantes: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    color: ${props => props.$color};
    
    svg {
      font-size: 14px;
    }
  `,

  AlertaCard: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.8rem;
    background: ${props => `${props.$color}15`};
    border: 1px solid ${props => `${props.$color}30`};
    color: ${props => props.$color};
    
    svg {
      font-size: 18px;
    }
  `,
};