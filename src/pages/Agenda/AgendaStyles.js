import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  padding: 1rem;
  background: #f7fafc;
  min-height: 100vh;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const NavButton = styled.button`
  background: #e9f2ff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #cfe0ff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.7rem;
  }
`;

export const WeekRange = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #133c86;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    text-align: center;
  }
`;

export const CalendarButton = styled.button`
  background: #f2f8ff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #2052d9;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #cfe0ff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const NewReservaButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

export const GridContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: 0 -0.5rem;
  }
`;

export const GridTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  th, td {
    border: 1px solid #e6eaf3;
    padding: 10px 8px;
    text-align: center;
  }

  @media (max-width: 768px) {
    min-width: 500px;
    
    th, td {
      padding: 6px 4px;
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    min-width: 450px;
    
    th, td {
      padding: 4px 2px;
      font-size: 0.7rem;
    }
  }
`;

export const GridHeader = styled.th`
  background: #f8fafc;
  font-weight: 600;
  color: #0F3D5D;
`;

export const DiaSemana = styled.span`
  font-weight: 600;
  color: #0F3D5D;
  display: block;
  font-size: 0.85rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const DataDia = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  display: block;
  margin-top: 2px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const HorarioCell = styled.td`
  font-weight: 600;
  color: #0F3D5D;
  background: #f8fafc;
  font-size: 0.85rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const GridCell = styled.td`
  background: ${props => props.$isLivre ? '#ffffff' : '#f8fafc'};
  height: 60px;
  vertical-align: middle;
  position: relative;
  transition: background 0.2s ease;

  @media (max-width: 768px) {
    height: 48px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

export const SlotButton = styled.button`
  background: #e0f6e7;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22c55e;
  cursor: pointer;
  margin: 0 auto;
  transition: all 0.2s ease;

  &:hover {
    background: #b6e8cb;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const ReservedPill = styled.button`
  width: 90%;
  min-height: 34px;
  padding: 4px 8px;
  border-radius: 20px;
  border: 1px solid rgba(24, 88, 214, 0.25);
  background: #e9f0ff;
  color: #1858d6;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(24, 88, 214, 0.15);
    background: #cfe0ff;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 3px 6px;
    min-height: 28px;
    width: 95%;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 2px 4px;
    min-height: 24px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 550px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.2s ease;

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 1rem;
  }
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;
  line-height: 1;

  &:hover {
    color: #dc2626;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;