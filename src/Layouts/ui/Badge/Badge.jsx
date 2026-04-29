// src/styles/ui/Badge/Badge.jsx

import styled, { css } from 'styled-components';

const badgeVariants = {
  primary: css`
    background: var(--color-primary-light);
    color: var(--color-primary);
  `,
  success: css`
    background: var(--color-success-bg);
    color: var(--color-success);
  `,
  danger: css`
    background: var(--color-danger-bg);
    color: var(--color-danger);
  `,
  warning: css`
    background: var(--color-warning-bg);
    color: var(--color-warning);
  `,
  info: css`
    background: var(--color-info-bg);
    color: var(--color-info);
  `,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  width: fit-content;
  
  ${props => badgeVariants[props.$variant || 'primary']}
`;