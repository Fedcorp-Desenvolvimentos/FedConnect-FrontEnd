// src/components/Loading/LoadingStyles.js
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.97); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeIn)} 0.3s ease forwards;
  pointer-events: ${({ $isExiting }) => ($isExiting ? 'none' : 'auto')};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 36px 44px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.08);
  opacity: 0;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeIn)} 0.3s ease forwards;
  animation-delay: ${({ $isExiting }) => ($isExiting ? '0s' : '0.05s')};

  @media (max-width: 480px) {
    padding: 24px 28px;
    gap: 18px;
    border-radius: 20px;
  }
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 170px;
    height: 170px;
  }
`;

/* Full-size SVG overlay, rings rotate via transform in JSX */
export const OrbitalSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

export const LogoImg = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    width: 76px;
    height: 76px;
  }
`;

export const PercentageBadge = styled.div`
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  font-weight: 600;
  color: #185FA5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, monospace;
  white-space: nowrap;
  z-index: 3;

  @media (max-width: 480px) {
    bottom: 16px;
    font-size: 13px;
  }
`;

export const MessageContainer = styled.div`
  opacity: 0;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOut : fadeIn)} 0.3s ease forwards;
  animation-delay: ${({ $isExiting }) => ($isExiting ? '0s' : '0.1s')};
`;

export const MessageText = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;