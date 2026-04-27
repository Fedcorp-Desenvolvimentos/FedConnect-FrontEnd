import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

// ============================================
// CONTAINER PRINCIPAL
// ============================================
export const Container = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;

  @media (min-width: 1500px) {
    max-width: 1480px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

// ============================================
// FILTROS
// ============================================
export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const ChipButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1e293b;

  ${props => props.$active && css`
    background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
    color: white;
    border-color: #0F3D5D;
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  `}

  &:hover {
    transform: translateY(-2px);
    border-color: #0F3D5D;
    background: ${props => props.$active ? 'linear-gradient(135deg, #0a2e4a 0%, #0F3D5D 100%)' : 'rgba(15, 61, 93, 0.05)'};
  }

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
`;

// ============================================
// GRID DE PRODUTOS
// ============================================
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }
`;

// ============================================
// CARD DE PRODUTO
// ============================================
export const ProductCard = styled.article`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0F3D5D, #1a5a7a);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
    border-color: #cbd5e1;

    &::before {
      transform: scaleX(1);
    }
  }
`;

export const ProductBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;

  @media (max-width: 520px) {
    padding: 1.25rem;
    gap: 0.875rem;
  }
`;

export const CategoryPill = styled.span`
  display: inline-block;
  width: fit-content;
  padding: 0.25rem 0.875rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ProductName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;

  @media (max-width: 520px) {
    font-size: 1.125rem;
  }
`;

export const ProductPrice = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F3D5D;
  margin: 0;
`;

export const DestaquesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    position: relative;
    padding-left: 1.5rem;
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.4;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: bold;
    }
  }
`;

export const Observacao = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin: 0;
`;

// ============================================
// AÇÕES DO CARD
// ============================================
export const ActionsContainer = styled.div`
  margin-top: auto;
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }
`;

export const OutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #0F3D5D;
  border: 2px solid #0F3D5D;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: #0F3D5D;
    color: white;
    transform: translateY(-2px);
  }
`;

export const PdfActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  button {
    width: 100%;
  }
`;

// ============================================
// MODAL DE VISUALIZAÇÃO DE IMAGEM (Portal)
// ============================================
export const ImageViewer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Z-index altíssimo para garantir que fique acima de tudo */
  cursor: zoom-out;
  animation: ${fadeIn} 0.2s ease;
`;

export const ViewerImage = styled.img`
  max-width: 90%;
  max-height: 85%;
  width: auto;
  height: auto;
  object-fit: contain;
  cursor: default;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  animation: ${slideIn} 0.2s ease;
`;

export const ViewerClose = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 100000;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: #dc2626;
    transform: scale(1.1);
  }
`;

export const ViewerDownload = styled.button`
  position: fixed;
  top: 1rem;
  right: 5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  z-index: 100000;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #1a5a7a 0%, #0F3D5D 100%);
  }
`;

export const ViewerArrow = styled.button`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 100000;

  ${props => props.$left && css`
    left: 1.5rem;
  `}

  ${props => !props.$left && css`
    right: 1.5rem;
  `}

  svg {
    font-size: 1.5rem;
  }

  &:hover {
    background: #0F3D5D;
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    ${props => props.$left && css`
      left: 0.5rem;
    `}

    ${props => !props.$left && css`
      right: 0.5rem;
    `}
  }
`;

export const ViewerDots = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  z-index: 100000;
`;

export const ViewerDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  ${props => props.$active && css`
    width: 28px;
    border-radius: 14px;
    background: white;
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;