// src/pages/Teste/_outro/TesteStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
`;

export const ChatHeader = styled.div`
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 50%, #D3D3D2 100%);
  color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #ffffff;
  }
  
  .health-status {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      
      &.healthy {
        background-color: #4ade80;
        box-shadow: 0 0 5px #4ade80;
      }
      
      &.unhealthy {
        background-color: #ef4444;
        box-shadow: 0 0 5px #ef4444;
      }
    }
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #ffffff;
`;

export const Message = styled.div`
  display: flex;
  gap: 12px;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
    
    &.user {
      color: #ffffff;
    }
    
    &.ai {
      color: #374151;
    }
  }
  
  .content {
    flex: 1;
    
    .sender {
      font-weight: 600;
      font-size: 0.85rem;
      margin-bottom: 5px;
      color: #6b7280;
    }
    
    .text {
      background: ${props => props.isUser ? '#f3f4f6' : '#ffffff'};
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      color: #1f2937;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      
      ${props => props.isUser && `
        background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 50%, #D3D3D2 100%);
        color: white;
        border: none;
      `}
    }
    
    .metadata {
      font-size: 0.7rem;
      color: #9ca3af;
      margin-top: 5px;
      display: flex;
      gap: 10px;
      
      .badge {
        background: #f3f4f6;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }
  }
`;

export const InputContainer = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  
  textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #667eea;
    }
    
    &:disabled {
      background: #f9fafb;
      cursor: not-allowed;
    }
  }
  
  button {
    padding: 0 24px;
    background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 50%, #D3D3D2 100%);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      opacity: 0.9;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const TestPanel = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 15px 20px;
  
  .panel-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 2px 8px;
      border-radius: 4px;
      
      &:hover {
        background: #f3f4f6;
      }
    }
  }
  
  .test-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    
    button {
      padding: 6px 12px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
      
      &:hover {
        background: #e5e7eb;
        border-color: #667eea;
      }
    }
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;