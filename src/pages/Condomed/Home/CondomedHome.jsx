import React from 'react';
import { FaUserMd, FaChalkboardTeacher, FaHistory } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import CardGridLayout from '../../../Layouts/CardGridLayout/CardGridLayout';
import { Card, CardBody, IconWrapper, Title, Description, Button } from '../../../Layouts/CardGridLayout/CardGridLayoutStyles';
import CondomedHomeHelp from './CondomedHomeHelp';

// Mesma cor do restante das telas da Condomed (CursoCipaStyles).
const COR_CONDOMED = '#0f3d5d';

const opcoesCondomed = [
  {
    key: 'cursos-cipa',
    icon: <FaChalkboardTeacher />,
    title: 'Cursos CIPA',
    desc: 'Agende turmas no auditório ou na sala de reunião e registre os funcionários inscritos.',
    to: '/condomed/cursos-cipa',
    niveis: ['admin', 'condomed'],
    color: COR_CONDOMED,
  },
  {
    key: 'turmas',
    icon: <FaHistory />,
    title: 'Turmas e participantes',
    desc: 'Histórico das turmas por período e consulta de quem participou, por nome, CPF, condomínio ou administradora.',
    to: '/condomed/turmas',
    niveis: ['admin', 'condomed'],
    color: COR_CONDOMED,
  },
];

const CondomedHome = () => {
  const { user, isLoading } = useAuth();
  const nivelUsuario = user?.nivel_acesso;

  const opcoesPermitidas = opcoesCondomed.filter((opcao) =>
    opcao.niveis.includes(nivelUsuario)
  );

  return (
    <CardGridLayout
      title="Condomed"
      subtitle="Medicina e segurança do trabalho: agendamento de cursos e turmas"
      icon={<FaUserMd />}
      loading={isLoading}
      empty={opcoesPermitidas.length === 0}
      emptyMessage="Nenhuma ferramenta da Condomed disponível para seu nível de acesso"
      helpContent={<CondomedHomeHelp />}
      items={opcoesPermitidas}
      renderCard={(opcao) => (
        <Card key={opcao.key} $color={opcao.color}>
          <CardBody>
            <IconWrapper $color={opcao.color}>{opcao.icon}</IconWrapper>
            <Title>{opcao.title}</Title>
            <Description>{opcao.desc}</Description>
            <Button to={opcao.to} $color={opcao.color}>
              Acessar
            </Button>
          </CardBody>
        </Card>
      )}
    />
  );
};

export default CondomedHome;
