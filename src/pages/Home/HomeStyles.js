import styled, { css } from 'styled-components';

export const HomeContainer = styled.div`
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin: 0 !important;
    padding: 0 16px !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: auto !important;
    background: none !important;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    padding: 0 12px !important;
  }
`;

export const HomeWrapper = styled.div`
  padding: 32px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 24px auto;
  border-radius: 30px;
  box-shadow: 0 10px 44px rgba(36, 99, 235, 0.10), 0 1.5px 2px #c0c4ce21;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;
    margin: 16px auto !important;
    border-radius: 24px !important;
    box-shadow: 0 5px 20px rgba(36, 99, 235, 0.15) !important;
  }

  @media (max-width: 480px) {
    border-radius: 20px !important;
  }
`;

export const CarouselLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
`;

export const CarouselImage = styled.img`
  width: 100%;
  min-height: 140px;
  max-height: 600px;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
  transition: opacity 0.18s;
  border-radius: 30px;

  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    max-height: 350px !important;
    object-fit: cover !important;
    border-radius: 24px !important;
    aspect-ratio: 16/9;
  }

  @media (max-width: 480px) {
    border-radius: 20px !important;
  }
`;

export const Indicators = styled.div`
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 11px;
  z-index: 3;
  margin-left: 0;

  @media (max-width: 768px) {
    bottom: 16px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    gap: 8px !important;
    margin-left: 0 !important;
  }

  @media (max-width: 480px) {
    bottom: 12px !important;
    gap: 6px !important;
  }
`;

export const Dot = styled.button`
  width: 13px;
  height: 13px;
  background: ${props => props.$active ? '#2463eb' : '#e0e7ef'};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.16s, transform 0.2s;
  opacity: ${props => props.$active ? '1' : '0.7'};
  margin-bottom: 0;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    width: 10px !important;
    height: 10px !important;
    margin-bottom: 0 !important;
  }

  @media (max-width: 480px) {
    width: 8px !important;
    height: 8px !important;
  }
`;