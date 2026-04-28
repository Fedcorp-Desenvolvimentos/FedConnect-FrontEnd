import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

// ============================================
// SEÇÕES
// ============================================
export const Section = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  ${props => props.$highlight && `
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-left: 4px solid #0F3D5D;
  `}

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F3D5D;
  margin: 0 0 0.5rem 0;

  svg {
    font-size: 1.25rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

// ============================================
// ÁREA DE UPLOAD
// ============================================
export const FileInputArea = styled.div`
  margin-bottom: 1.5rem;
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
  color: #1e293b;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    border-color: #0F3D5D;
    background: #f0f7ff;
    transform: translateY(-1px);
  }
`;

// ============================================
// LISTA DE ARQUIVOS
// ============================================
export const FilesList = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
`;

export const FilesListTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.75rem 0;
`;

export const FilesListUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

export const FilesListLi = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }

  span {
    flex: 1;
    color: #1e293b;
    font-family: monospace;
    font-size: 0.8125rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  color: #64748b;

  &:hover:not(:disabled) {
    background: #fee2e2;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// BOTÕES
// ============================================
export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #0F3D5D;
    color: #0F3D5D;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SuccessButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    animation: ${spin} 0.8s linear infinite;
  }
`;

// ============================================
// PROGRESSO
// ============================================
export const ProgressIndicator = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;

  p {
    margin: 0;
    font-size: 0.875rem;
    color: #475569;
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #0F3D5D;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// ============================================
// BADGE
// ============================================
export const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 1rem;
  flex-wrap: wrap;

  strong {
    color: #0F3D5D;
  }
`;

// ============================================
// RESULTADO
// ============================================
export const ResultSummary = styled.div`
  background: #e0f2fe;
  border-left: 3px solid #0F3D5D;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;

  strong {
    font-size: 0.8125rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    font-size: 0.75rem;
  }
`;