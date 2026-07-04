import React from 'react';
import { FaUserPlus, FaUserEdit, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CardGridLayout from '../../Layouts/CardGridLayout/CardGridLayout';
import { Card, CardBody, IconWrapper, Title, Description, Button } from '../../Layouts/CardGridLayout/CardGridLayoutStyles';

const opcoesCadastro = [
  {
    key: 'pessoas-cadastrar',
    icon: <FaUserPlus />,
    title: 'Novo Cadastro',
    desc: 'Cadastre uma nova pessoa física ou jurídica no sistema. Preencha todos os dados necessários.',
    to: '/cadastro-pessoas/cadastrar',
    niveis: ['admin', 'usuario', 'comercial', 'faturamento', 'ti'],
    color: '#0f3d5d',
  },
  {
    key: 'pessoas-atualizar',
    icon: <FaUserEdit />,
    title: 'Atualizar Cadastro',
    desc: 'Consulte e atualize os dados de pessoas já cadastradas no sistema.',
    to: '/cadastro-pessoas/atualizar',
    niveis: ['admin', 'usuario', 'comercial', 'faturamento', 'ti'],
    color: '#1a5a7a',
  },
];

const CadastroPessoasHome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  const opcoesPermitidas = opcoesCadastro.filter(c =>
    c.niveis.includes(currentUserType)
  );

  const handleCardClick = (to) => {
    navigate(to);
  };

  return (
    <CardGridLayout
      title="Cadastro de Pessoas"
      subtitle="Escolha uma opção para gerenciar pessoas físicas e jurídicas"
      icon={<FaSearch />}
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
                handleCardClick(opcao.to);
              }}
            >
              {opcao.key === 'pessoas-cadastrar' ? 'Cadastrar' : 'Consultar'}
            </Button>
          </CardBody>
        </Card>
      )}
    />
  );
};

export default CadastroPessoasHome;