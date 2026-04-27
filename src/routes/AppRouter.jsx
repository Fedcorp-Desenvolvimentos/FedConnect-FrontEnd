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

// Componentes protegidos
import ConsultasHome from '../pages/Consultas/ConsultasHome';
import ConsultaPF from '../components/Consultas/ConsultaPF/ConsultaPF';
import ConsultaEnd from '../components/Consultas/ConsultaEnd/ConsultaEnd';
import ConsultaCNPJ from '../components/Consultas/ConsultaCNPJ/ConsultaCNPJ';
// import Comercial from '../components/Consultas/Comercial';
import ConsultaComercial from '../components/Consultas/ConsultaComercial/ConsultaComercial';  // **********
// import ConsultaComercial from '../components/Consultas/Comercial';
// import BuscaRegiao from '../components/Consultas/ComercialRegiao';
import ComercialRegiao from '../components/Consultas/ComercialRegiao/ComercialRegiao';
// import Segurados from '../components/Consultas/Segurados';
import ConsultaSegurados from '../components/Consultas/ConsultaSegurados/ConsultaSegurados';
import ConsultaFat from '../components/Consultas/ConsultaFat';
import ConsultaFaturamento from '../components/Consultas/ConsultaFaturamento';
import ConsultaDetalhe from '../components/Detalhes/ConsultaDetalhe';
import CotacaoConteudo from '../components/Cotação/CotacaoConteudo';

// Dropdown itens
// import GerenciarUsuarios from '../components/Dropdown/dropItens/GerenciarUsuarios/GerenciarUsuarios';
// import MinhaConta from '../components/Dropdown/dropItens/MinhaConta/MinhaConta';
// import Cadastro from '../components/Dropdown/dropItens/Cadastro/Cadastro';
// import HistoricoPage from '../components/Dropdown/dropItens/Historico/Historico';

// Novas páginas de usuario e conta
import MinhaConta from '../pages/MinhaConta/MinhaConta';
import GerenciarUsuarios from '../pages/GerenciarUsuarios/GerenciarUsuarios';
import Cadastro from '../pages/Cadastro/Cadastro';
import HistoricoPage from '../pages/Historico/Historico';

// Administrativo
import HomeAdm from '../components/Adm/ImportacaoAdmPage';
import Upload from '../components/Adm/Upload';
import ImportVida from '../components/Adm/ImportVida';

// Views
// import Metricas from '../components/Views/Metricas';
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
import Financeiro from '../components/Comercial/Financeiro';
import Produtos from '../components/Produtos/Produtos';

// Faturamento
// import OperacionalHome from '../components/Faturamento/OperacionalHome';
import FaturamentoHome from '../pages/Faturamento/FaturamentoHome';
import PdfAutomation from '../components/Faturamento/PdfAutomation';
// import OperacionalCancelamento from '../components/Faturamento/OperacionalCancelamento';
import FaturamentoCancelamentoFedBnk from '../components/Faturamento/FaturamentoCancelamentoFedBnk/FaturamentoCancelamentoFedBnk';
import ReimpressaoBoleto from '../components/Faturamento/ReimpressaoBoleto';
import Payxbox from '../components/Faturamento/Paybox';

// Utils e Providers
import PrivateRouter from './PrivateRouter';

// Automação
import AutomacaoHome from '../components/Automacao/AutomacaoHome';
import PDFAutomacao from '../components/Automacao/PDF/PDFAutomacao';
import BBZAutomacao from '../components/Automacao/Faturamento/BBZAutomacao';
import EmailAutomacao from '../components/Automacao/Email/EmailAutomacao';

// Teste renderização Mapa
import Mapa from '../components/Mapa/Mapa';
import { Analytics } from '../pages/Analytics/Analytics';
import Ferramentas from '../pages/Ferramentas/Ferramentas';

// Testes de novas paginas
import WorkflowHub from '../pages/Workflow/WorkflowHub';
import RHHub from '../pages/RH/RHHub';
import TestePage from '../pages/Teste';

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/recuperar-senha" element={isAuthenticated ? <Navigate to="/home" /> : <RecuperarSenha />} />
      <Route path="/resetar-senha/:token" element={isAuthenticated ? <Navigate to="/home" /> : <ResetarSenha />} />

      {/* Rotas Protegidas */}
      <Route element={<PrivateRouter />}>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Consultas */}
          <Route path="/consultas" element={<ConsultasHome />} />
          <Route path="/consulta-comercial" element={<ConsultaComercial />} />
          
          <Route path="/consultas/consulta-pf" element={<ConsultaPF />} />
          <Route path="/consultas/consulta-end" element={<ConsultaEnd />} />
          <Route path="/consultas/consulta-cnpj" element={<ConsultaCNPJ />} />
          <Route path="/consultas/comercial-regiao" element={<ComercialRegiao />} />
          <Route path="/consultas/consulta-segurados" element={<ConsultaSegurados />} />
          <Route path="/consultas/consulta-faturas" element={<ConsultaFat />} />
          <Route path="/consultas/consulta-faturamento" element={<ConsultaFaturamento />} />
          <Route path="/consultas/consulta-detalhes/:id" element={<ConsultaDetalhe />} />
          
          {/* Cotação */}
          <Route path="/cotacao-conteudo" element={<CotacaoConteudo />} />
          
          {/* Usuário */}
          <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/historico" element={<HistoricoPage />} />
          
          {/* Administrativo */}
          <Route path="/home-adm" element={<HomeAdm />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/importacao-vida" element={<ImportVida />} />
          
          {/* Ferramentas e Views */}
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/envio-email" element={<EnvEmail />} />
          <Route path="/config-email" element={<ConfigEmail />} />
          
          {/* Agenda */}
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda-comercial" element={<AgendaComercial />} />
          
          {/* Comercial e Financeiro */}
          <Route path="/acompanhamento" element={<Acompanhamento />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/produtos" element={<Produtos />} />
          
          {/* Faturamento */}
          <Route path="/faturamento" element={<FaturamentoHome />} />
          <Route path="/faturamento/pdf-automation" element={<PdfAutomation />} />
          <Route path="/faturamento/cancelamento" element={<FaturamentoCancelamentoFedBnk />} />
          <Route path="/faturamento/reimpressao-boleto" element={<ReimpressaoBoleto />} />
          <Route path="/faturamento/paybox" element={<Payxbox />} />

          {/* Automação */}
          <Route path="/automacao" element={<AutomacaoHome />} />
          <Route path="/automacao/bbz" element={<BBZAutomacao />} />
          <Route path="/automacao/pdf" element={<PDFAutomacao />} />
          <Route path="/automacao/email" element={<EmailAutomacao />} />

          <Route path="/mapa" element={<Mapa />} />

          <Route path="/analytics" element={<Analytics/>} />

          <Route path="/workflow" element={< WorkflowHub />} />

          <Route path="/rh" element={<RHHub />} />

          <Route path="/teste-page" element={<TestePage />} />

        </Route>
      </Route>

      {/* Rota 404 - SEMPRE no final */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;