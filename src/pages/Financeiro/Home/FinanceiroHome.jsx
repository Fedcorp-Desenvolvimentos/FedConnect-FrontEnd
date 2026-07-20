import React from 'react';
import { FaFileInvoiceDollar, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CardGridLayout from '../../../Layouts/CardGridLayout/CardGridLayout';
import { Card, CardBody, IconWrapper, Title, Description, Button } from '../../../Layouts/CardGridLayout/CardGridLayoutStyles';

const opcoesFinanceiro = [
  {
    key: 'emissao-comissao',
    icon: <FaFileInvoiceDollar />,
    title: 'Emissão de Comissão',
    desc: 'Emita recibos e vouchers de comissão para corretores e parceiros.',
    to: '/financeiro/comissoes',
    niveis: ['admin', 'ti', 'financeiro'],
    color: '#0f3d5d',
  },
  {
    key: 'consulta-comissao',
    icon: <FaSearch />,
    title: 'Consulta / Cancelamento de Comissão',
    desc: 'Consulte comissões emitidas ou realize cancelamentos quando necessário.',
    to: '/financeiro/consulta-comissao',
    niveis: ['admin', 'ti', 'financeiro'],
    color: '#1a5a7a',
  },
  // {
  //   key: 'santander',
  //   icon: <img
  //     src="/imagens/santander-logo.png"
  //     alt="Santander"
  //     style={{ width: 24, height: 24 }}
  //   />,
  //   title: 'Santander',
  //   desc: 'Acesse informações e serviços relacionados ao Santander.',
  //   to: '/financeiro/santander',
  //   niveis: ['admin', 'ti', 'financeiro'],
  //   color: '#1a5a7a',
  // },
];

const FinanceiroHome = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUserType = user?.nivel_acesso;

  const opcoesPermitidas = opcoesFinanceiro.filter(c =>
    c.niveis.includes(currentUserType)
  );

  const handleCardClick = (to) => {
    navigate(to);
  };

  return (
    <CardGridLayout
      title="Financeiro"
      subtitle="Gerencie comissões, recibos e vouchers"
      icon={<FaFileInvoiceDollar />}
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
              {opcao.key === 'emissao-comissao' ? 'Acessar' : 'Consultar'}
            </Button>
          </CardBody>
        </Card>
      )}
    />
  );
};

export default FinanceiroHome;
