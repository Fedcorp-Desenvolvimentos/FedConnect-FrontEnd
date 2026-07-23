// src/pages/Financeiro/Santander/Boletos/SantanderBoletoModalStyles.js
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
    max-width: 720px;
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

  Tabs: styled.div`
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--color-border-light);
    padding-bottom: 4px;
    overflow-x: auto;
    
    &::-webkit-scrollbar {
      height: 2px;
    }
  `,

  Tab: styled.button`
    padding: 8px 16px;
    background: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
    color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    
    &:hover:not(${props => props.$active}) {
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
    }
  `,

  TabContent: styled.div`
    animation: fadeIn 0.2s ease;
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,

  FieldGroup: styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,

  FieldRow: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,

  Label: styled.label`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-primary);
  `,

  Input: styled.input`
    padding: 8px 12px;
    background: var(--color-bg-secondary);
    border: 1px solid ${props => props.$error ? '#ef4444' : 'var(--color-border-light)'};
    border-radius: 6px;
    color: var(--color-text-primary);
    font-size: 0.85rem;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.$error ? '#ef4444' : 'var(--color-primary)'};
      box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 61, 93, 0.1)'};
    }
    
    &::placeholder {
      color: var(--color-text-tertiary);
    }
  `,

  Select: styled.select`
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

  ErrorText: styled.span`
    font-size: 0.7rem;
    color: #ef4444;
    margin-top: 2px;
  `,

  SectionTitle: styled.h4`
    margin: 4px 0 0;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary);
    padding-top: 8px;
    border-top: 1px solid var(--color-border-light);
  `,

  DiscountRow: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding-left: 12px;
    border-left: 3px solid var(--color-border-light);
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,

  SharingRow: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 10px;
    align-items: end;
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `,

  SharingActions: styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    padding-bottom: 2px;
  `,

  MessageRow: styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    
    /* Estiliza o input diretamente dentro do MessageRow */
    input {
      flex: 1;
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
      
      &::placeholder {
        color: var(--color-text-tertiary);
      }
    }
  `,

  AddButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-primary);
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      background: var(--color-primary-dark);
    }
  `,

  RemoveButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border-light);
    border-radius: 6px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      background: #ef444420;
      border-color: #ef4444;
      color: #ef4444;
    }
  `,

  Footer: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--color-border-light);
  `,

  CancelButton: styled.button`
    padding: 10px 20px;
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

  SubmitButton: styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: var(--color-primary);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    svg {
      font-size: 18px;
    }
  `,
};