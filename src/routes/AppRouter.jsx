import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import MainLayout from '../Layouts/MainLayout/MainLayout';

// Componentes públicos
import NotFound from '../components/NotFound/NotFound';

// Login e Recuperação de Senha
import Login from '../pages/Login/Login';
import ResetarSenha from '../pages/ResetarSenha/ResetarSenha';
import RecuperarSenha from '../pages/RecuperarSenha/RecuperarSenha';

// Home
import HomePage from '../pages/Home/Home';

// Consultas
import ConsultasHome from '../pages/Consultas/ConsultasHome';
import ConsultaPF from '../components/Consultas/ConsultaPF/ConsultaPF';
import ConsultaEnd from '../components/Consultas/ConsultaEnd/ConsultaEnd';
import ConsultaCNPJ from '../components/Consultas/ConsultaCNPJ/ConsultaCNPJ';
import ConsultaComercial from '../components/Consultas/ConsultaComercial/ConsultaComercial';
import ComercialRegiao from '../components/Consultas/ComercialRegiao/ComercialRegiao';
import ConsultaSegurados from '../components/Consultas/ConsultaSegurados/ConsultaSegurados';
import ConsultaFat from '../components/Consultas/ConsultaFat';
import ConsultaFaturamento from '../components/Consultas/ConsultaFaturamento';
import ConsultaDetalhe from '../components/Detalhes/ConsultaDetalhe';
import CotacaoConteudo from '../components/Cotação/CotacaoConteudo';

// Conta e Gerenciamento de Usuários
import MinhaConta from '../pages/MinhaConta/MinhaConta';
import GerenciarUsuarios from '../pages/GerenciarUsuarios/GerenciarUsuarios';
import Cadastro from '../pages/Cadastro/Cadastro';
import HistoricoPage from '../pages/Historico/Historico';

// Administrativo
import HomeAdm from '../components/Adm/ImportacaoAdmPage';
import Upload from '../components/Adm/Upload';
import ImportVida from '../components/Adm/ImportVida';

// Dados
import Metricas from '../pages/Metricas/Metricas';
// import Ferramentas from '../components/Views/Ferramentas';

import EnvEmail from '../components/Views/EnvEmail';
import ConfigEmail from '../components/Views/ConfigEmail';

// Agenda
// import AgendaSala from '../pages/Agenda/AgendaSala';
import Agenda from '../pages/Agenda/Agenda';

// Comercial
import Acompanhamento from '../components/Comercial/DashboardComercial';
import AgendaComercial from '../components/Comercial/AgendaComercial';
import Produtos from '../components/Produtos/Produtos';
import Material from '../pages/Comercial/materiais/ComercialMateriais.jsx';

// Financeiro
import FinanceiroHome from '../pages/Financeiro/Home/FinanceiroHome.jsx';
import ConsultaComissao from '../pages/Financeiro/consulta/ConsultaComissao.jsx';
import Comissoes from '../pages/Financeiro/comissoes/Comissoes.jsx';

// import Santander from '../pages/Financeiro/santander/Santander.jsx';
// import SantanderWorkspaces from '../pages/Financeiro/santander/SantanderWorkspaces.jsx';
// import SantanderEmpresas from '../pages/Financeiro/santander/SantanderEmpresas.JSX';
// import SantanderBoletos from '../pages/Financeiro/santander/SantanderBoletos.jsx';

// Faturamento
// import OperacionalHome from '../components/Faturamento/OperacionalHome';
import FaturamentoHome from '../pages/Faturamento/FaturamentoHome';
import PdfAutomation from '../components/Faturamento/PdfAutomation';
// import OperacionalCancelamento from '../components/Faturamento/OperacionalCancelamento';
import CancelamentoReemissaoFedBnk from '../components/Faturamento/CancelamentoReemissaoFedBnk/CancelamentoReemissaoFedBnk';
import ReimpressaoBoleto from '../components/Faturamento/ReimpressaoBoleto';
import Payxbox from '../components/Faturamento/Paybox';
import SegundaVia from '../pages/SegundaVia/SegundaVia.jsx';


// Utils e Providers
import PrivateRouter from './PrivateRouter';
import { ROUTE_ACCESS } from '../utils/routeAccess';

// Automação
import AutomacaoHome from '../components/Automacao/AutomacaoHome';
import PDFAutomacao from '../components/Automacao/PDF/PDFAutomacao';
import BBZAutomacao from '../pages/Automacao/BBZ/BBZAutomacao';
import EnvioPorto from '../components/Automacao/EnvioPorto/EnvioPorto';
// import EmailAutomacao from '../components/Automacao/Email/EmailAutomacao';

// Questionario
import Questionario from '../pages/Questionarios/Questionarios';

// Teste renderização Mapa
import Mapa from '../components/Mapa/Mapa';
import Analytics from '../pages/Analytics/Analytics';
import Ferramentas from '../pages/Ferramentas/Ferramentas';

// Testes de novas paginas
import Workflow from '../pages/Workflow/Workflow';
import RH from '../pages/RH/RH';

// Testes
import TestePageSC from '../pages/Teste/_styled_components/Teste';
import TestePageCH from '../pages/Teste/_outro//Teste';
import TesteAgenda from '../pages/Teste/_agenda/Agenda';
import ChatPage from '../pages/Chat/ChatPage';

import TratamentoErros from '../pages/TratamentoErros/TratamentoErros';
import TratamentoErrosBOAT from '../components/TratamentoErros/TratamentoErrosBOAT';

import FormatosArquivos from '../pages/FormatosArquivos/FormatosArquivos';
import ConverterBoletoCSV from '../components/FormatosArquivos/ConverterBoletoCSV';
import MapaRedes from '../pages/MapaRedes/MapaRedes.jsx';


import CadastroPessoasHome from '../pages/CadastroPessoas/CadastroPessoasHome';
import CadastroPessoas from '../pages/CadastroPessoas/CadastroPessoas';
import AtualizarPessoas from '../pages/CadastroPessoas/AtualizarPessoas';

// Vistorias
import ConsultaVistorias from '../pages/Vistorias/ConsultaVistorias';

// Condomed
import CondomedHome from '../pages/Condomed/Home/CondomedHome';
import CursoCipa from '../pages/Condomed/CursoCipa/CursoCipa';
import HistoricoTurmas from '../pages/Condomed/Turmas/HistoricoTurmas';
import TurmaDetalhe from '../pages/Condomed/Turmas/TurmaDetalhe';
import CadastrosCondomed from '../pages/Condomed/Cadastros/CadastrosCondomed';
import FaturasPendentes from '../pages/Financeiro/FaturasPendentes/FaturasPendentes';
import Loading from '../components/Loading/Loading.jsx';

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="Carregando aplicação..." />;
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />

      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/recuperar-senha" element={isAuthenticated ? <Navigate to="/home" /> : <RecuperarSenha />} />
      <Route path="/resetar-senha/:token" element={isAuthenticated ? <Navigate to="/home" /> : <ResetarSenha />} />

      {/* Rotas Protegidas — cada grupo tem guarda real por nível (ROUTE_ACCESS),
          não só o item escondido no menu. */}
      <Route element={<PrivateRouter />}>
        <Route element={<MainLayout />}>

          {/* Área comum: todos os níveis operacionais */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.home} />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/minha-conta" element={<MinhaConta />} />
            <Route path="/historico" element={<HistoricoPage />} />
            <Route path="/ferramentas" element={<Ferramentas />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/questionarios" element={<Questionario />} />
          </Route>

          {/* Consultas */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.consultas} />}>
            <Route path="/consultas" element={<ConsultasHome />} />
            <Route path="/consultas/consulta-pf" element={<ConsultaPF />} />
            <Route path="/consultas/consulta-end" element={<ConsultaEnd />} />
            <Route path="/consultas/consulta-cnpj" element={<ConsultaCNPJ />} />
            <Route path="/consultas/comercial-regiao" element={<ComercialRegiao />} />
            <Route path="/consultas/consulta-segurados" element={<ConsultaSegurados />} />
            <Route path="/consultas/consulta-faturas" element={<ConsultaFat />} />
            <Route path="/consultas/consulta-faturamento" element={<ConsultaFaturamento />} />
            <Route path="/consultas/consulta-detalhes/:id" element={<ConsultaDetalhe />} />
            <Route path="/vistorias" element={<ConsultaVistorias />} />
          </Route>

          {/* Comercial */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.comercial} />}>
            <Route path="/consulta-comercial" element={<ConsultaComercial />} />
            <Route path="/cotacao-conteudo" element={<CotacaoConteudo />} />
            <Route path="/agenda-comercial" element={<AgendaComercial />} />
            <Route path="/acompanhamento" element={<Acompanhamento />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/material" element={<Material />} />
          </Route>

          {/* Faturamento */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.faturamento} />}>
            <Route path="/faturamento" element={<FaturamentoHome />} />
            <Route path="/faturamento/pdf-automation" element={<PdfAutomation />} />
            <Route path="/faturamento/cancelamento" element={<CancelamentoReemissaoFedBnk />} />
            <Route path="/faturamento/reimpressao-boleto" element={<ReimpressaoBoleto />} />
            <Route path="/faturamento/paybox" element={<Payxbox />} />
            <Route path="/faturamento/segunda-via" element={<SegundaVia />} />
            <Route path="/tratamento-erros" element={<TratamentoErros />} />
            <Route path="/tratamento-erros/tratamento-de-erros-boat" element={<TratamentoErrosBOAT />} />
            <Route path="/formatos-arquivos" element={<FormatosArquivos />} />
            <Route path="/formatos-arquivos/converter-boleto-csv" element={<ConverterBoletoCSV />} />
          </Route>

          {/* Financeiro */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.financeiro} />}>
            <Route path="/financeiro" element={<FinanceiroHome />} />
            <Route path="/financeiro/comissoes" element={<Comissoes />} />
            <Route path="/financeiro/consulta-comissao" element={<ConsultaComissao />} />
            {/* Santander */}
            {/* <Route path="/financeiro/santander" element={<Santander />} />
            <Route path="/financeiro/santander/workspaces" element={<SantanderWorkspaces />} />
            <Route path="/financeiro/santander/empresas" element={<SantanderEmpresas />} />
            <Route path="/financeiro/santander/boletos" element={<SantanderBoletos />} /> */}
          </Route>

          {/* Relatório de faturas pendentes: financeiro, faturamento e admin */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.faturasPendentes} />}>
            <Route path="/financeiro/faturas-pendentes" element={<FaturasPendentes />} />
          </Route>

          {/* Automação */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.automacao} />}>
            <Route path="/automacao" element={<AutomacaoHome />} />
            <Route path="/automacao/bbz" element={<BBZAutomacao />} />
            <Route path="/automacao/pdf" element={<PDFAutomacao />} />
            <Route path="/automacao/envio-porto" element={<EnvioPorto />} />
            {/* <Route path="/automacao/email" element={<EmailAutomacao />} /> */}
          </Route>

          {/* Estatísticas e Cadastro de pessoas (admin e TI) */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.analytics} />}>
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.cadastroPessoas} />}>
            <Route path="/cadastro-pessoas" element={<CadastroPessoasHome />} />
            <Route path="/cadastro-pessoas/cadastrar" element={<CadastroPessoas />} />
            <Route path="/cadastro-pessoas/atualizar" element={<AtualizarPessoas />} />
          </Route>

          {/* Métricas */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.metricas} />}>
            <Route path="/metricas" element={<Metricas />} />
          </Route>

          {/* Administrativo e telas sem entrada no menu: só admin */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.admin} />}>
            <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/home-adm" element={<HomeAdm />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/importacao-vida" element={<ImportVida />} />
            <Route path="/envio-email" element={<EnvEmail />} />
            <Route path="/config-email" element={<ConfigEmail />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/mapa-redes" element={<MapaRedes />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/rh" element={<RH />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/teste-page-styled" element={<TestePageSC />} />
            <Route path="/teste-page-chat" element={<TestePageCH />} />
            <Route path="/teste-page-agenda" element={<TesteAgenda />} />
          </Route>

          {/* Condomed */}
          <Route element={<PrivateRouter allowed={ROUTE_ACCESS.condomed} />}>
            <Route path="/condomed" element={<CondomedHome />} />
            <Route path="/condomed/cursos-cipa" element={<CursoCipa />} />
            <Route path="/condomed/turmas" element={<HistoricoTurmas />} />
            <Route path="/condomed/turmas/:id" element={<TurmaDetalhe />} />
            <Route path="/condomed/cadastros" element={<CadastrosCondomed />} />
          </Route>

        </Route>
      </Route>

      {/* Rota 404  */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;