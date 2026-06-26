import styled, { css } from 'styled-components';

// ================================
// LAYOUT GERAL
// ================================
export const Container = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: #f4f6f8;
`;

// ================================
// TABS
// ================================
export const TabsWrapper = styled.div`
  display: flex;
  border-bottom: 2px solid #0F3D5D;
  margin-bottom: 20px;
`;

export const TabBtn = styled.button`
  padding: 8px 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #0F3D5D;
  border-radius: 6px 6px 0 0;
  margin-bottom: -2px;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;

  ${({ $active }) => $active && css`
    background: #0F3D5D;
    color: #fff;
    border-bottom-color: #0F3D5D;
  `}

  &:hover:not([data-active="true"]) {
    background: #e6f1fb;
  }
`;

// ================================
// BLOCOS
// ================================
export const FloorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  
`;

export const BlocosRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Bloco = styled.div`
  background: white;
  border: 2px solid #0F3D5D;
  border-radius: 10px;
  padding: 12px;
  flex: ${({ $flex }) => $flex || 2};
  min-width: 0;
`;

export const BlocoTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  color: #0F3D5D;
  border-bottom: 2px solid #0F3D5D;
  padding-bottom: 4px;
  margin-bottom: 10px;
  display: inline-block;
`;

// ================================
// GRID DE ESTAÇÕES
// ================================
export const EstacaoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 3}, 1fr);
  gap: 8px;

`;

// ================================
// ESTAÇÃO DESKTOP
// ================================
export const MesaCard = styled.div`
  background: #dbeafe;
  border: 2px solid #0F3D5D;
  border-radius: 6px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  transition: all 0.2s;

  ${({ $isOver }) => $isOver && css`
    background: #bfdbfe;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  `}

  &:hover {
    background: #bfdbfe;
  }
`;

export const MesaIconWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0F3D5D;
  gap: 2px;

  svg { font-size: 18px; }
`;

export const Rotulo = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: #0F3D5D;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  padding: 1px 4px;
  text-align: center;
`;

export const PessoaSlot = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 4px;
  min-height: 24px;
`;

export const PessoaChip = styled.div`
  background: #16a34a;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 10px;
  cursor: grab;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;

  &:hover {
    background: #15803d;
    transform: scale(1.05);
  }

  ${({ $isDragging }) => $isDragging && css`
    opacity: 0.4;
    transform: scale(0.9);
  `}
`;

export const VazioSlot = styled.span`
  font-size: 9px;
  color: #94a3b8;
`;

// ================================
// ESTAÇÃO VAZIA / PLACEHOLDER
// ================================
export const VazioCard = styled.div`
  background: transparent;
  border: 1.5px dashed #cbd5e1;
  border-radius: 6px;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  opacity: 0.5;
`;

export const VazioLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
`;

// ================================
// EQUIPAMENTOS
// ================================
export const SwitchBox = styled.div`
  background: #fbcfe8;
  border: 1px solid #9d174d;
  border-radius: 4px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #9d174d;
  gap: 3px;

  svg { font-size: 16px; }
`;

export const ImpBox = styled.div`
  background: #1e293b;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: white;
  gap: 3px;

  svg { font-size: 16px; }
`;

export const ServidorBox = styled.div`
  background: #dc2626;
  border: 1px solid #7f1d1d;
  border-radius: 6px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  gap: 10px;
  flex: 1;

  svg { font-size: 18px; }
`;

export const RodapeRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
`;

// ================================
// LEGENDA
// ================================
export const LegendaContainer = styled.div`
  background: white;
  border: 2px solid #0F3D5D;
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;

  strong {
    color: #0F3D5D;
    font-size: 11px;
  }
`;

export const LegendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #5f5e5a;
`;

const LegendBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid #666;
  flex-shrink: 0;
`;

export const MesaLegend = styled(LegendBox)` background: #0F3D5D; `;
export const DesktopLegend = styled(LegendBox)` background: #dbeafe; border-color: #0F3D5D; `;
export const ColabLegend = styled(LegendBox)` background: #16a34a; border-radius: 50%; border: none; width: 13px; height: 13px; `;
export const ImpLegend = styled(LegendBox)` background: #1e293b; `;
export const SwLegend = styled(LegendBox)` background: #fbcfe8; border-color: #9d174d; `;
export const ServLegend = styled(LegendBox)` background: #dc2626; `;

export const LegendaNota = styled.span`
  font-size: 10px;
  color: #94a3b8;
  margin-left: auto;
`;