// src/styles/ui/Grid/Grid.jsx

import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.$minWidth || '300px'}, 1fr));
  gap: ${props => props.$gap || '1.5rem'};
  width: 100%;
  
  @media (max-width: 768px) {
    gap: ${props => props.$mobileGap || '1rem'};
  }
`;