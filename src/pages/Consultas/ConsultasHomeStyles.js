import styled, { css, keyframes } from 'styled-components';
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

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  animation: ${fadeInUp} 0.4s ease-out;

  /* Layout responsivo */
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
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  
  /* Efeito de borda gradiente no hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$color || 'var(--color-primary, #2463eb)'};
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.$color || 'var(--color-border, #cbd5e1)'};
    color: ${props => props.$color || 'var(--color-primary, #2463eb)'};
    
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

export const CardBody = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  min-height: 320px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: auto;
  }
`;

export const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${props => `${props.$color}10` || 'var(--color-primary-light, #e8f0fe)'};
  color: ${props => props.$color || 'var(--color-primary, #2463eb)'};
  border-radius: 20px;
  font-size: 28px;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    font-size: 28px;
  }

  ${Card}:hover & {
    transform: scale(1.05) rotate(2deg);
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    margin-bottom: 1rem;

    svg {
      font-size: 24px;
    }
  }
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-tertiary, #64748b);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
    -webkit-line-clamp: 4;
  }
`;

export const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: ${props => props.$color || 'var(--color-primary, #2463eb)'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  width: auto;
  min-width: 140px;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    background: ${props => {
      const color = props.$color || 'var(--color-primary, #2463eb)';
      // Escurece a cor em 10%
      return color;
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    svg {
      transform: translateX(2px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    min-width: auto;
  }
`;

// Estilo adicional para o PageTemplate se necessário
export const Container = styled.div`
  width: 100%;
  padding: 0;

  @media (max-width: 768px) {
    padding: 0;
  }
`;