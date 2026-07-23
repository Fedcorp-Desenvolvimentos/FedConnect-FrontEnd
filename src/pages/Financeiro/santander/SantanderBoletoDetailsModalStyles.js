// src/pages/Financeiro/Santander/Boletos/SantanderBoletoDetailsModalStyles.js
import styled from 'styled-components';

export const S = {
  Overlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  Modal: styled.div`
    background: var(--color-bg-primary);
    border-radius: 16px;
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.2s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @media (max-width: 640px) {
      max-width: 95%;
      margin: 16px;
    }
  `,

  Header: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--color-border-light);
  `,

  Title: styled.h3`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text-primary);
    
    svg {
      color: var(--color-primary);
    }
  `,

  CloseButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-border-light);
      color: var(--color-text-primary);
    }
  `,

  Body: styled.div`
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--color-border-light);
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 2px;
    }
  `,

  Section: styled.div`
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  `,

  SectionTitle: styled.h4`
    margin: 0 0 10px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--color-border-light);
  `,

  InfoGrid: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
    
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
    font-size: 0.85rem;
    color: var(--color-text-primary);
    word-break: break-all;
    
    code {
      background: var(--color-bg-tertiary);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--color-text-primary);
    }
    
    svg {
      font-size: 14px;
      color: var(--color-text-secondary);
      flex-shrink: 0;
    }
  `,

  StatusBadge: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${props => `${props.$color}20`};
    color: ${props => props.$color};
    
    svg {
      font-size: 14px;
    }
  `,

  ReturnCode: styled.div`
    padding: 10px 14px;
    background: var(--color-bg-tertiary);
    border-radius: 8px;
    font-size: 0.85rem;
    color: var(--color-text-primary);
    border-left: 4px solid var(--color-primary);
  `,

  Footer: styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
    border-top: 1px solid var(--color-border-light);
  `,

  CloseFooterButton: styled.button`
    padding: 10px 24px;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    color: var(--color-text-secondary);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-border-light);
    }
  `,
};