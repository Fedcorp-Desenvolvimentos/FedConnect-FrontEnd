import styled, { keyframes } from 'styled-components';

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

const pulse = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

const stroke = keyframes`
  100% {
    stroke-dashoffset: 0;
  }
`;

const ringPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
`;

const fadeInStep = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const GradientBg = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 50%, #D3D3D2 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${fadeInUp} 0.5s ease;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const LogoWrapper = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const LogoImg = styled.img`
  max-width: 180px;
  height: auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 480px) {
    max-width: 150px;
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: #0F3D5D;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 2rem;
`;

export const InfoBox = styled.div`
  background: #d4edda;
  border-left: 4px solid #10b981;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  svg {
    color: #10b981;
    font-size: 1.25rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: #065f46;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

export const Form = styled.form`
  margin-bottom: 1.5rem;
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #0F3D5D;
  font-weight: 600;
  font-size: 0.875rem;

  svg {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }

  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 2.5rem 0.75rem 0.875rem;
    font-size: 0.875rem;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    color: #0F3D5D;
  }

  svg {
    font-size: 1.125rem;
  }
`;

export const PasswordHint = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 0.75rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
    transform: none;
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

// Estados de validação
export const VerificandoContainer = styled.div`
  text-align: center;
  padding: 2rem 1rem;
`;

export const VerificandoAnimation = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
`;

export const CircleCheck = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const PulseRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(15, 61, 93, 0.2);
  border-radius: 50%;
  animation: ${ringPulse} 2s ease-out infinite;
  z-index: 0;
`;

export const CheckmarkSvg = styled.svg`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`;

export const CheckmarkCircle = styled.circle`
  stroke: #0F3D5D;
  stroke-width: 3;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: ${stroke} 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
`;

export const CheckmarkCheck = styled.path`
  stroke: #0F3D5D;
  stroke-width: 3;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: ${stroke} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
`;

export const VerificandoTitle = styled.h3`
  color: #0F3D5D;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

export const VerificandoSteps = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #64748b;
  font-size: 0.9rem;
  opacity: 0;
  animation: ${fadeInStep} 0.3s ease forwards;
  animation-delay: ${props => props.$delay};

  svg {
    font-size: 1.1rem;
    color: #0F3D5D;
  }
`;

export const VerificandoText = styled.p`
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 1rem;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 1rem;

  svg {
    font-size: 4rem;
    color: #dc2626;
    margin-bottom: 1rem;
  }

  h2 {
    color: #0F3D5D;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #0F3D5D;
    color: #0F3D5D;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ─── Lista de boletos (Segunda Via) ─────────────────────────────────────

export const ListContainer = styled.div`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ListCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ListCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ListTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
  }
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 1rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const FaturaInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 250px;
`;

export const FaturaInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0F3D5D;
    box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1);
  }
`;

export const ConsultButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  .spinner {
    animation: ${spin} 0.6s linear infinite;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 1.5rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }

  th {
    padding: 0.875rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #0F3D5D;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #1e293b;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f8fafc;
    }
  }

  @media (max-width: 768px) {
    th, td {
      padding: 0.625rem 0.5rem;
      font-size: 0.8rem;
    }
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;

  svg {
    font-size: 0.7rem;
  }

  ${props => {
    switch (props.$status) {
      case 'pago':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'vencido':
        return `
          background: #fee2e2;
          color: #dc2626;
        `;
      case 'pendente':
        return `
          background: #fef9c3;
          color: #a16207;
        `;
      default:
        return `
          background: #e2e8f0;
          color: #475569;
        `;
    }
  }}
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  cursor: pointer;
  position: relative;
`;

export const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0F3D5D;
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const ActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const SelectedInfo = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;

  strong {
    color: #0F3D5D;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;

  svg {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  h3 {
    color: #475569;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #94a3b8;
    font-size: 0.85rem;
    margin: 0;
  }
`;

export const Valor = styled.span`
  font-weight: 600;
  color: #0F3D5D;
`;