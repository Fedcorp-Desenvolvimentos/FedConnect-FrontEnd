import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../Layouts/DashboardLayout';

// Componentes públicos
import NotFound from '../components/NotFound/NotFound';

// Componentes protegidos
import ConsultasHome from '../components/Consultas/ConsultasHome';
import ConsultaPF from '../components/Consultas/ConsultaPF';
import ConsultaEnd from '../components/Consultas/ConsultaEnd';
import ConsultaCNPJ from '../components/Consultas/ConsultaCNPJ';
import Comercial from '../components/Consultas/Comercial';
import BuscaRegiao from '../components/Consultas/ComercialRegiao';
import Segurados from '../components/Consultas/Segurados';
import ConsultaFat from '../components/Consultas/ConsultaFat';
import ConsultaFaturamento from '../components/Consultas/Faturamento';
import ConsultaDetalhe from '../components/Detalhes/ConsultaDetalhe';
import CotacaoConteudo from '../components/Cotação/CotacaoConteudo';

// Dropdown itens
import GerenciarUsuarios from '../components/Dropdown/dropItens/GerenciarUsuarios/GerenciarUsuarios';
import MinhaConta from '../components/Dropdown/dropItens/MinhaConta/MinhaConta';
import Cadastro from '../components/Dropdown/dropItens/Cadastro/Cadastro';
import HistoricoPage from '../components/Dropdown/dropItens/Historico/Historico';

// Administrativo
import HomeAdm from '../components/Adm/ImportacaoAdmPage';
import Upload from '../components/Adm/Upload';
import ImportVida from '../components/Adm/ImportVida';

// Views
import Metricas from '../components/Views/Metricas';
import Ferramentas from '../components/Views/Ferramentas';
import EnvEmail from '../components/Views/EnvEmail';
import ConfigEmail from '../components/Views/ConfigEmail';

// Agenda
import AgendaSala from '../components/Agenda/AgendaSala';

// Comercial
import Acompanhamento from '../components/Comercial/DashboardComercial';
import AgendaComercial from '../components/Comercial/AgendaComercial';
import Financeiro from '../components/Comercial/Financeiro';
import Produtos from '../components/Produtos/Produtos';

// Faturamento
import OperacionalHome from '../components/Faturamento/OperacionalHome';
import PdfAutomation from '../components/Faturamento/PdfAutomation';
import OperacionalCancelamento from '../components/Faturamento/OperacionalCancelamento';
import ReimpressaoBoleto from '../components/Faturamento/ReimpressaoBoleto';
import Payxbox from '../components/Faturamento/Paybox';

// Utils e Providers
import PrivateRouter from './PrivateRouter';
import ResetarSenha from '../components/Login/ResetarSenha';
import RecuperarSenha from '../components/Login/RecuperarSenha';
import { useAuth } from '../context/AuthContext';
import Mapa from '../components/Mapa/Mapa';
import Login from '../pages/Login/Login';
import HomePage from '../pages/Home/Home';


const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/resetar-senha/:token" element={<ResetarSenha />} />

      {/* Rotas Protegidas */}
      <Route element={<PrivateRouter />}>
        <Route element={<DashboardLayout />}>
          {/* Home */}
          <Route path="/home" element={<HomePage />} />
          
          {/* Consultas */}
          <Route path="/consultas" element={<ConsultasHome />} />
          <Route path="/consulta-comercial" element={<Comercial />} />
          
          <Route path="/consultas/consulta-pf" element={<ConsultaPF />} />
          <Route path="/consultas/consulta-end" element={<ConsultaEnd />} />
          <Route path="/consultas/consulta-cnpj" element={<ConsultaCNPJ />} />
          <Route path="/consultas/comercial-regiao" element={<BuscaRegiao />} />
          <Route path="/consultas/consulta-segurados" element={<Segurados />} />
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
          <Route path="/agenda" element={<AgendaSala />} />
          <Route path="/agenda-comercial" element={<AgendaComercial />} />
          
          {/* Comercial e Financeiro */}
          <Route path="/acompanhamento" element={<Acompanhamento />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/produtos" element={<Produtos />} />
          
          {/* Faturamento */}
          <Route path="/faturamento" element={<OperacionalHome />} />
          <Route path="/faturamento/pdf-automation" element={<PdfAutomation />} />
          <Route path="/faturamento/cancelamento" element={<OperacionalCancelamento />} />
          <Route path="/faturamento/reimpressao-boleto" element={<ReimpressaoBoleto />} />
          <Route path="/faturamento/paybox" element={<Payxbox />} />

          <Route path="/mapa" element={<Mapa />} />

        </Route>
      </Route>

      {/* Rota 404 - SEMPRE no final */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;