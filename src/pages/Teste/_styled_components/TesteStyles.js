// src/pages/Teste/TesteStyles.js
import styled from 'styled-components';
import { Card } from '../../../Layouts/ui';

// Container de demonstração
export const DemoCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin: 16px 0 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

// Card que muda de cor baseado na prop $isLiked
export const LikeCard = styled(Card)`
  border: 2px solid ${props => props.$isLiked ? '#ef4444' : '#e2e8f0'};
  background: ${props => props.$isLiked ? '#fef2f2' : 'white'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.$isLiked ? 'translateY(-2px)' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isLiked 
      ? '0 8px 24px rgba(239, 68, 68, 0.15)' 
      : '0 8px 24px rgba(0, 0, 0, 0.1)'};
  }
`;

// Flex container
export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

// Botão de like que muda cor e ícone via prop
export const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.$isLiked ? '#fee2e2' : '#f1f5f9'};
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${props => props.$isLiked ? '#ef4444' : '#64748b'};
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.$isLiked ? '#fecaca' : '#e2e8f0'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

// Caixa de explicação
export const ExplanationBox = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  margin-top: 32px;
  
  h4 {
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
  }
  
  li {
    color: #475569;
    margin: 8px 0;
    line-height: 1.5;
  }
  
  code {
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #1e40af;
  }
`;