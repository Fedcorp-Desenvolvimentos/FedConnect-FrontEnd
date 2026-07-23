// src/pages/Financeiro/Santander/Santander.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CardGridLayout from '../../../Layouts/CardGridLayout/CardGridLayout';
import { Card, CardBody, IconWrapper, Title, Description, Button } from '../../../Layouts/CardGridLayout/CardGridLayoutStyles';
import { FaBuilding, FaBarcode, FaBuilding as FaEmpresa } from 'react-icons/fa';
import { FiGlobe, FiUsers } from 'react-icons/fi';

const opcoesSantander = [
  {
    key: 'empresas',
    icon: <FiUsers />,
    title: 'Empresas',
    desc: 'Gerencie empresas cadastradas, certificados e status de integração.',
    to: '/financeiro/santander/empresas',
    niveis: ['admin', 'ti', 'financeiro'],
    color: '#0F3D5D',
  },
  {
    key: 'workspaces',
    icon: <FaBuilding />,
    title: 'Workspaces',
    desc: 'Gerencie workspaces, convênios e webhooks do Santander.',
    to: '/financeiro/santander/workspaces',
    niveis: ['admin', 'ti', 'financeiro'],
    color: '#EC0000',
  },
  {
    key: 'boletos',
    icon: <FaBarcode />,
    title: 'Boletos',
    desc: 'Gerencie boletos, emissão, cancelamento e reimpressão.',
    to: '/financeiro/santander/boletos',
    niveis: ['admin', 'ti', 'financeiro'],
    color: '#1a5a7a',
    disabled: false,
  },
];

const Santander = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  const opcoesPermitidas = opcoesSantander.filter(c =>
    c.niveis.includes(currentUserType)
  );

  const handleCardClick = (to) => {
    navigate(to);
  };

  return (
    <CardGridLayout
      title="Santander"
      subtitle="Gerencie integrações e serviços do Santander"
      icon={<FiGlobe />}
      loading={loading}
      empty={opcoesPermitidas.length === 0}
      emptyMessage="Nenhuma opção disponível para seu nível de acesso"
      items={opcoesPermitidas}
      renderCard={(opcao) => (
        <Card key={opcao.key} $color={opcao.color}>
          <CardBody>
            <IconWrapper $color={opcao.color}>
              {opcao.icon}
            </IconWrapper>
            <Title>{opcao.title}</Title>
            <Description>{opcao.desc}</Description>
            <Button
              to="#"
              $color={opcao.color}
              onClick={(e) => {
                e.preventDefault();
                if (!opcao.disabled) {
                  handleCardClick(opcao.to);
                }
              }}
              disabled={opcao.disabled}
              style={opcao.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {opcao.disabled ? 'Em breve' : 'Acessar'}
            </Button>
          </CardBody>
        </Card>
      )}
    />
  );
};

export default Santander;