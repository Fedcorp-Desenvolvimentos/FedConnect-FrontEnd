import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.25rem;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border: none;
  background: ${props => props.$active ? '#0f3d5d' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border-radius: 10px 10px 0 0;
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? '#0f3d5d' : '#f1f5f9'};
    color: ${props => props.$active ? 'white' : '#0f3d5d'};
  }

  svg {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
    gap: 0.3rem;

    span {
      display: none;
    }
  }
`;

const PessoaFormTabs = ({ activeTab, onTabChange, tabs }) => {
  const getTabLabel = (tab) => {
    const labels = {
      identificacao: 'Identificação',
      endereco: 'Endereço',
      bancario: 'Dados Bancários',
      contato: 'Contato',
      configuracoes: 'Configurações',
      agenciamento: 'Agenciamento',
    };
    return labels[tab.key] || tab.label;
  };

  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          $active={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          type="button"
        >
          {tab.icon}
          <span>{getTabLabel(tab)}</span>
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default PessoaFormTabs;