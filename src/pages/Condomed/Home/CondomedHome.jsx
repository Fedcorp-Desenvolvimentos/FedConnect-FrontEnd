import React, { useState } from 'react';
import { FaUserMd, FaChalkboardTeacher, FaHistory, FaRobot, FaExternalLinkAlt, FaSpinner, FaUserCog } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import CardGridLayout from '../../../Layouts/CardGridLayout/CardGridLayout';
import { Card, CardBody, IconWrapper, Title, Description, Button, ExternalButton } from '../../../Layouts/CardGridLayout/CardGridLayoutStyles';
import CondomedHomeHelp from './CondomedHomeHelp';
import { URL_PAINEL_ROBO, abrirOuIniciarRobo } from './roboEsocial';

// Mesma cor do restante das telas da Condomed (CursoCipaStyles).
const COR_CONDOMED = '#0f3d5d';

const opcoesCondomed = [
  {
    key: 'cursos-cipa',
    icon: <FaChalkboardTeacher />,
    title: 'Cursos CIPA',
    desc: 'Agende turmas no auditório ou na sala de reunião e registre os funcionários inscritos.',
    to: '/condomed/cursos-cipa',
    niveis: ['admin', 'condomed', 'esocial'],
    color: COR_CONDOMED,
  },
  {
    key: 'turmas',
    icon: <FaHistory />,
    title: 'Turmas e participantes',
    desc: 'Histórico das turmas por período e consulta de quem participou, por nome, CPF, condomínio ou administradora.',
    to: '/condomed/turmas',
    niveis: ['admin', 'condomed', 'esocial'],
    color: COR_CONDOMED,
  },
  {
    key: 'cadastros',
    icon: <FaUserCog />,
    title: 'Cadastros',
    desc: 'Palestrantes que assinam o certificado (com a assinatura digitalizada) e locais onde o curso acontece, com capacidade.',
    to: '/condomed/cadastros',
    niveis: ['admin', 'condomed', 'esocial'],
    color: COR_CONDOMED,
  },
  {
    key: 'robo-esocial',
    icon: <FaRobot />,
    title: 'Robô eSocial (SOC)',
    desc: 'Coleta os recibos S-2220 no Portal eSocial do SOC a partir da planilha de controle. Roda nesta máquina: o cartão abre ou inicia o painel.',
    robo: true,
    // Restrito: só quem tem o nível eSocial (dois operadores) e o admin.
    niveis: ['admin', 'esocial'],
    color: COR_CONDOMED,
  },
];

const TEXTO_ESTADO_ROBO = {
  verificando: 'Verificando o painel...',
  iniciando: 'Iniciando o robô nesta máquina (aguarde, até 30 s)...',
  falhou:
    'O painel não respondeu. Confira se o atalho fedrobo:// foi instalado neste PC (instalar-atalho-fedconnect.bat, na pasta do robô) ou inicie o iniciar-robo.bat à mão.',
};

/** Botão do robô: abre o painel se está de pé; senão lança o .bat pelo protocolo e espera. */
const BotaoRobo = ({ color }) => {
  const [estado, setEstado] = useState('ocioso');
  const ocupado = estado === 'verificando' || estado === 'iniciando';

  const acionar = async (evento) => {
    evento.preventDefault();
    if (ocupado) return;
    const resultado = await abrirOuIniciarRobo({ aoMudar: setEstado });
    if (resultado === 'pronto') {
      // Pode ser bloqueado como pop-up se demorou; o link "Abrir painel" abaixo cobre.
      window.open(URL_PAINEL_ROBO, '_blank', 'noopener');
    }
  };

  return (
    <>
      <ExternalButton href={URL_PAINEL_ROBO} onClick={acionar} $color={color} aria-busy={ocupado}>
        {ocupado ? <FaSpinner size={12} className="spin" /> : <FaExternalLinkAlt size={12} />}
        {estado === 'pronto' ? 'Abrir painel' : 'Abrir robô'}
      </ExternalButton>
      {TEXTO_ESTADO_ROBO[estado] && (
        <Description as="p" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }} role="status">
          {TEXTO_ESTADO_ROBO[estado]}
        </Description>
      )}
    </>
  );
};

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
            {opcao.robo ? (
              <BotaoRobo color={opcao.color} />
            ) : (
              <Button to={opcao.to} $color={opcao.color}>
                Acessar
              </Button>
            )}
          </CardBody>
        </Card>
      )}
    />
  );
};

export default CondomedHome;
