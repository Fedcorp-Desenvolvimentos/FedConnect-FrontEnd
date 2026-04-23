import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  width: 100%;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  animation: ${fadeInUp} 0.4s ease-out;

  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1200px) and (max-width: 1399px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
`;

export const Card = styled.div`
  background: var(--color-bg-card, #ffffff);
  border: 1px solid var(--color-border-light, #e2e8f0);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color || 'var(--color-primary, #2463eb)'};
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.$color || 'var(--color-border, #cbd5e1)'};
    
    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: 767px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 1.5rem 1rem 1.5rem;
`;

export const LogoImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 20px;
  background: #f8fafc;
  padding: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  ${Card}:hover & {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    padding: 0.75rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary, #1e293b);
  margin: 0.5rem 1rem 0.5rem 1rem;
  line-height: 1.3;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin: 0.5rem 0.75rem 0.5rem 0.75rem;
  }
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-tertiary, #64748b);
  line-height: 1.5;
  margin: 0 1rem 1.5rem 1rem;
  flex: 1;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    margin: 0 0.75rem 1.25rem 0.75rem;
  }
`;

// Botão para links externos (Power BI)
export const ExternalButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
  color: white;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 0 1rem 1.5rem 1rem;
  width: calc(100% - 2rem);

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: white;
    color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    border-color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateX(2px);
      color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    margin: 0 0.75rem 1.25rem 0.75rem;
    padding: 0.75rem;
    width: calc(100% - 1.5rem);
  }
`;

// Botão para links internos (caso use)
export const InternalButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
  color: white;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 0 1rem 1.5rem 1rem;
  width: calc(100% - 2rem);

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: white;
    color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    border-color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    svg {
      transform: translateX(2px);
      color: ${({ $color }) => $color || 'var(--color-primary, #2463eb)'};
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    margin: 0 0.75rem 1.25rem 0.75rem;
    padding: 0.75rem;
    width: calc(100% - 1.5rem);
  }
`;