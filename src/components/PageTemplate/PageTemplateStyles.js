import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  padding: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #e8f0fe;
  border-radius: 16px;
  color: #2463eb;
  flex-shrink: 0;

  svg {
    font-size: 28px;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    
    svg {
      font-size: 24px;
    }
  }
`;

export const TitlesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2463eb;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const HelpButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    color: #2463eb;
  }

  &:hover {
    background: #e8f0fe;
    border-color: #2463eb;
    color: #2463eb;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    
    span {
      display: none;
    }
  }
`;

export const Content = styled.div`
  width: 100%;
`;

// Estados
export const StateContainer = styled.div`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 3rem;
`;

export const SpinnerWrapper = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: #2463eb;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const ErrorIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: #ef4444;
  }
`;

export const EmptyIcon = styled.div`
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: #64748b;
  }
`;

export const StateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

export const StateMessage = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #e2e8f0;
    color: #ef4444;
  }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  color: #475569;
  line-height: 1.5;
  font-size: 0.875rem;

  p {
    margin: 0;
  }

  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  li {
    margin: 0.25rem 0;
  }
`;