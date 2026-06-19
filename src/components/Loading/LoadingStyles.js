import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.3; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 0.6; 
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  display: flex;
  flex-direction: column; /* Importante: column para empilhar verticalmente */
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeIn)} 0.4s ease forwards;
  pointer-events: ${({ $isExiting }) => ($isExiting ? 'none' : 'auto')};
  gap: 20px; /* Espaço entre os elementos */
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;

  /* Glow suave - sem cores fortes */
  &::before {
    content: '';
    position: absolute;
    width: 260px;
    height: 260px;
    background: radial-gradient(
      circle at center,
      rgba(24, 95, 165, 0.08) 0%,
      rgba(24, 95, 165, 0.04) 40%,
      transparent 70%
    );
    border-radius: 50%;
    z-index: 0;
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    width: 160px;
    height: 160px;
    
    &::before {
      width: 200px;
      height: 200px;
    }
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const OrbitalSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  animation: ${spin} 40s linear infinite;
`;

export const LogoImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.06));

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

export const PercentageBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #185FA5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  white-space: nowrap;
  z-index: 3;
  
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: 480px) {
    bottom: 4px;
    font-size: 12px;
    padding: 3px 12px;
  }
`;

export const MessageContainer = styled.div`
  opacity: 0;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeIn)} 0.3s ease forwards;
  animation-delay: ${({ $isExiting }) => ($isExiting ? '0s' : '0.1s')};
`;

export const MessageText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;