import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const modalIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;
  @media (max-width: 768px) { padding: 0.5rem; }
`;

export const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
  @media (max-width: 768px) { padding: 1.25rem; }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;
`;

export const Tab = styled.button`
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${(p) => (p.$active ? "#0F3D5D" : "transparent")};
  margin-bottom: -2px;
  color: ${(p) => (p.$active ? "#0F3D5D" : "#64748b")};
  font-weight: ${(p) => (p.$active ? 700 : 500)};
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  &:hover:not(:disabled) { color: #0F3D5D; }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

export const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0F3D5D;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
  color: #0F3D5D;
`;

export const Input = styled.input`
  padding: 0.65rem 0.9rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  &:focus { outline: none; border-color: #0F3D5D; box-shadow: 0 0 0 3px rgba(15, 61, 93, 0.1); }
  &:disabled { background: #f8fafc; cursor: not-allowed; }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.875rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const ProdutoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1.5fr) auto auto minmax(110px, 0.6fr);
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: ${(p) => (p.$ativo ? "white" : "#f8fafc")};
  color: ${(p) => (p.$ativo ? "#1e293b" : "#94a3b8")};
  font-size: 0.875rem;
  label { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; white-space: nowrap; }
  @media (max-width: 640px) { grid-template-columns: 1fr 1fr; }
`;

export const Alert = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  ${(p) => p.$type === "success" && css`background: #dcfce7; border: 1px solid #a3e9a3; color: #166534;`}
  ${(p) => p.$type === "error" && css`background: #fee2e2; border: 1px solid #fecaca; color: #991b1b;`}
  ${(p) => p.$type === "warning" && css`background: #fffbeb; border: 1px solid #fde68a; color: #92400e;`}
  ${(p) => p.$type === "info" && css`background: #dbeafe; border: 1px solid #bfdbfe; color: #1e40af;`}
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;
  text-transform: uppercase;
  ${(p) => p.$status === "executando" && css`background: #dbeafe; color: #1e40af;`}
  ${(p) => p.$status === "concluido" && css`background: #dcfce7; color: #16a34a;`}
  ${(p) => p.$status === "falhou" && css`background: #fee2e2; color: #dc2626;`}
  ${(p) => p.$status === "enviado" && css`background: #ede9fe; color: #6d28d9;`}
  ${(p) => p.$status === "nao_enviado" && css`background: #f1f5f9; color: #475569;`}
`;

export const LogBox = styled.pre`
  margin: 0.75rem 0 0 0;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.78rem;
  line-height: 1.5;
  max-height: 320px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  .erro { color: #fca5a5; font-weight: 700; }
`;

export const Totais = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

export const Total = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  span { display: block; font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  strong { font-size: 1.1rem; color: #0F3D5D; }
`;

export const Actions = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const botaoBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  .spinner { animation: ${spin} 0.8s linear infinite; }
`;

export const PrimaryButton = styled.button`
  ${botaoBase}
  background: linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%);
  color: white;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15, 61, 93, 0.3); }
`;

export const SuccessButton = styled.button`
  ${botaoBase}
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); }
`;

export const SecondaryButton = styled.button`
  ${botaoBase}
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  &:hover:not(:disabled) { background: #e2e8f0; transform: translateY(-1px); }
`;

export const DangerButton = styled.button`
  ${botaoBase}
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 0.75rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  th { background: #f8fafc; color: #0F3D5D; font-weight: 700; text-align: left; padding: 0.7rem 0.8rem; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
  td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
`;

export const MonoCell = styled.td`
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.78rem;
`;

export const Muted = styled.p`
  margin: 0.5rem 0 0 0;
  color: #64748b;
  font-size: 0.82rem;
`;

export const Subgrupos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.4rem;
  max-height: 320px;
  overflow: auto;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.3rem 0.4rem; border-radius: 8px; cursor: pointer; }
  label:hover { background: #f8fafc; }
`;

export const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 420px;
`;

export const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: ${modalIn} 0.2s ease;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  h3 { margin: 0; font-size: 1.125rem; font-weight: 700; color: #0F3D5D; flex: 1; }
  svg { color: #dc2626; }
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  p { margin: 0 0 1rem 0; line-height: 1.5; color: #334155; }
  ul { margin: 0 0 1rem 0; padding-left: 1.25rem; color: #334155; font-size: 0.875rem; line-height: 1.6; }
`;

export const WarningBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  svg { flex-shrink: 0; margin-top: 2px; }
`;

export const Highlight = styled.span`
  background: #fef3c7;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
  color: #92400e;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;
