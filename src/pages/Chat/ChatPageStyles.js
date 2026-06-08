// src/pages/ChatPage/ChatPageStyles.js
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const skeletonAnimation = css`
  animation: ${shimmer} 2s infinite linear;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 30%, #f0f0f0 60%, #f0f0f0 100%);
  background-size: 1000px 100%;
`;

const typingAnimation = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
`;

export const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    background: var(--color-bg-primary);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--color-border-light);
    
    @media (max-width: 768px) {
      height: calc(100vh - 100px);
      border-radius: 0;
    }
  `,

  // Header do chat
  ChatHeader: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border-light);
    
    @media (max-width: 768px) {
      padding: 12px 16px;
    }
  `,

  HeaderInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  HeaderIcon: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
    border-radius: 12px;
    color: white;
    
    svg {
      font-size: 20px;
    }
  `,

  HeaderText: styled.div`
    h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    
    p {
      margin: 4px 0 0;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }
  `,

  StatusBadge: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: ${props => props.$online ? '#10b98120' : '#ef444420'};
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 500;
    color: ${props => props.$online ? '#10b981' : '#ef4444'};
    
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      background: ${props => props.$online ? '#10b981' : '#ef4444'};
      border-radius: 50%;
      animation: ${props => props.$online ? 'pulse 1.5s infinite' : 'none'};
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,

  // Área de mensagens
  MessagesArea: styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--color-bg-tertiary);
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--color-border-light);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 3px;
    }
    
    @media (max-width: 768px) {
      padding: 16px;
    }
  `,

  // Mensagem individual
  MessageWrapper: styled.div`
    display: flex;
    justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
    animation: ${fadeIn} 0.3s ease;
  `,

  MessageBubble: styled.div`
    max-width: 70%;
    padding: 12px 16px;
    background: ${props => props.$isUser ? 'var(--color-primary)' : 'var(--color-bg-primary)'};
    color: ${props => props.$isUser ? 'white' : 'var(--color-text-primary)'};
    border-radius: ${props => props.$isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
    border: ${props => !props.$isUser && '1px solid var(--color-border-light)'};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 768px) {
      max-width: 85%;
      padding: 10px 14px;
    }
  `,

  MessageText: styled.div`
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    
    p {
      margin: 0;
    }
  `,

  MessageMeta: styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
    gap: 8px;
    margin-top: 6px;
    font-size: 0.65rem;
    color: ${props => props.$isUser ? 'rgba(255,255,255,0.7)' : 'var(--color-text-secondary)'};
  `,

  MessageTime: styled.span``,

  // Indicador de digitação
  TypingIndicator: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--color-bg-primary);
    border-radius: 18px 18px 18px 4px;
    border: 1px solid var(--color-border-light);
    width: fit-content;
    
    span {
      width: 8px;
      height: 8px;
      background: var(--color-text-secondary);
      border-radius: 50%;
      animation: ${typingAnimation} 1.4s infinite;
      
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  `,

  // Área de input
  InputArea: styled.div`
    padding: 20px 24px;
    background: var(--color-bg-secondary);
    border-top: 1px solid var(--color-border-light);
    
    @media (max-width: 768px) {
      padding: 12px 16px;
    }
  `,

  InputContainer: styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-end;
  `,

  InputWrapper: styled.div`
    flex: 1;
    position: relative;
  `,

  Input: styled.textarea`
    width: 100%;
    padding: 12px 16px;
    background: var(--color-bg-primary);
    border: 1px solid var(--color-border-light);
    border-radius: 24px;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    font-family: inherit;
    resize: none;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &::placeholder {
      color: var(--color-text-secondary);
    }
  `,

  SendButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: var(--color-primary);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
      transform: scale(1.05);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    svg {
      font-size: 20px;
    }
  `,

  // Skeleton para loading inicial
  SkeletonMessage: styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
  `,

  SkeletonBubble: styled.div`
    padding: 12px 16px;
    background: var(--color-bg-primary);
    border-radius: 18px 18px 18px 4px;
    border: 1px solid var(--color-border-light);
    min-width: 200px;
  `,

  SkeletonLine: styled.div`
    height: ${props => props.$height || '16px'};
    width: ${props => props.$width || '100%'};
    ${skeletonAnimation}
    border-radius: 8px;
    margin-bottom: ${props => props.$marginBottom || '0'};
  `,

  // Empty state
  EmptyState: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--color-text-secondary);
    
    svg {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }
    
    h3 {
      margin: 0 0 8px;
      font-size: 1.125rem;
      color: var(--color-text-primary);
    }
    
    p {
      margin: 0;
      font-size: 0.875rem;
    }
  `,

  // Error state
  ErrorMessage: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    background: #ef444420;
    border-radius: 12px;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 16px;
    
    svg {
      font-size: 18px;
    }
  `,
};