// src/components/Loading/LoadingStyles.js
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// Overlay com blur - fundo claro
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.3s ease forwards;
  pointer-events: ${props => props.$isExiting ? 'none' : 'auto'};
`;

// Container principal
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.08);
  opacity: 0;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.3s ease forwards;
  animation-delay: ${props => props.$isExiting ? '0s' : '0.05s'};

  @media (max-width: 768px) {
    padding: 24px;
    gap: 20px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    gap: 16px;
    border-radius: 16px;
  }
`;

// Wrapper da logo
export const LogoWrapper = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
  }

  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
  }
`;

// Logo
export const LogoImg = styled.img`
  width: 130px;
  height: 130px;
  object-fit: contain;
  z-index: 2;
  display: block;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

// SVG do progresso circular
export const ProgressSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

// Badge de porcentagem - dentro do círculo, abaixo da logo
export const PercentageBadge = styled.div`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 20px;
  z-index: 3;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  
  @media (max-width: 768px) {
    bottom: 20px;
    font-size: 16px;
    padding: 3px 10px;
  }

  @media (max-width: 480px) {
    bottom: 15px;
    font-size: 14px;
    padding: 2px 8px;
  }
`;

// Container da mensagem
export const MessageContainer = styled.div`
  text-align: center;
  opacity: 0;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 0.3s ease forwards;
  animation-delay: ${props => props.$isExiting ? '0s' : '0.1s'};
`;

// Texto da mensagem
export const MessageText = styled.p`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;