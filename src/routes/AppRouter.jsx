import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routeConstants';

// Layouts
import DashboardLayout from '../Layouts/DashboardLayout';

// Componentes públicos
import Login from '../components/Login/Login';
import RecuperarSenha from '../components/Login/EsqueciSenha';
import NotFound from '../components/NotFound/NotFound';

// Componentes protegidos
import Home from '../components/Home/Home';
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
import GerenciarUsuarios from '../components/Dropdown/dropItens/GerenciarUsuarios';
import MinhaConta from '../components/Dropdown/dropItens/MinhaConta/MinhaConta';
import Cadastro from '../components/Dropdown/dropItens/Cadastro';
import HistoricoPage from '../components/Dropdown/dropItens/HistoricoPage';

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
// import ConsultaNotasFiscais from '../components/Consultas/ConsultaNotasFiscais.JSX';

const AppRouter = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.LOGIN_ALT} element={<Login />} />
      <Route path={ROUTES.ESQUECI_SENHA} element={<RecuperarSenha />} />

      {/* Rotas Protegidas */}
      <Route element={<PrivateRouter />}>
        <Route element={<DashboardLayout />}>
          {/* Home */}
          <Route path={ROUTES.HOME} element={<Home />} />
          
          {/* Consultas */}
          <Route path={ROUTES.CONSULTAS} element={<ConsultasHome />} />
          <Route path={ROUTES.CONSULTA_PF} element={<ConsultaPF />} />
          <Route path={ROUTES.CONSULTA_END} element={<ConsultaEnd />} />
          <Route path={ROUTES.CONSULTA_CNPJ} element={<ConsultaCNPJ />} />
          <Route path={ROUTES.CONSULTA_COMERCIAL} element={<Comercial />} />
          <Route path={ROUTES.COMERCIAL_REGIAO} element={<BuscaRegiao />} />
          <Route path={ROUTES.CONSULTA_SEGURADOS} element={<Segurados />} />
          <Route path={ROUTES.CONSULTA_FATURAS} element={<ConsultaFat />} />
          <Route path={ROUTES.CONSULTA_FATURAMENTO} element={<ConsultaFaturamento />} />
          {/* <Route path={ROUTES.CONSULTA_NOTAS_FISCAIS} element={<ConsultaNotasFiscais />} /> */}
          <Route path={ROUTES.CONSULTA_DETALHES} element={<ConsultaDetalhe />} />
          
          {/* Cotação */}
          <Route path={ROUTES.COTACAO_CONTEUDO} element={<CotacaoConteudo />} />
          
          {/* Usuário */}
          <Route path={ROUTES.GERENCIAR_USUARIOS} element={<GerenciarUsuarios />} />
          <Route path={ROUTES.MINHA_CONTA} element={<MinhaConta />} />
          <Route path={ROUTES.CADASTRO} element={<Cadastro />} />
          <Route path={ROUTES.HISTORICO} element={<HistoricoPage />} />
          
          {/* Administrativo */}
          <Route path={ROUTES.HOME_ADM} element={<HomeAdm />} />
          <Route path={ROUTES.UPLOAD} element={<Upload />} />
          <Route path={ROUTES.IMPORTACAO_VIDA} element={<ImportVida />} />
          
          {/* Ferramentas e Views */}
          <Route path={ROUTES.FERRAMENTAS} element={<Ferramentas />} />
          <Route path={ROUTES.METRICAS} element={<Metricas />} />
          <Route path={ROUTES.ENVIO_EMAIL} element={<EnvEmail />} />
          <Route path={ROUTES.CONFIG_EMAIL} element={<ConfigEmail />} />
          
          {/* Agenda */}
          <Route path={ROUTES.AGENDA} element={<AgendaSala />} />
          <Route path={ROUTES.AGENDA_COMERCIAL} element={<AgendaComercial />} />
          
          {/* Comercial e Financeiro */}
          <Route path={ROUTES.ACOMPANHAMENTO} element={<Acompanhamento />} />
          <Route path={ROUTES.FINANCEIRO} element={<Financeiro />} />
          <Route path={ROUTES.PRODUTOS} element={<Produtos />} />
          
          {/* Faturamento */}
          <Route path={ROUTES.FATURAMENTO} element={<OperacionalHome />} />
          <Route path={ROUTES.PDF_AUTOMATION} element={<PdfAutomation />} />
          <Route path={ROUTES.CANCELAMENTO} element={<OperacionalCancelamento />} />
          <Route path={ROUTES.REIMPRESSAO_BOLETO} element={<ReimpressaoBoleto />} />
          <Route path={ROUTES.PAYBOX} element={<Payxbox />} />
        </Route>
      </Route>

      {/* Rota 404 */}
      <Route path={ROUTES.NAO_ENCONTRADO} element={<NotFound />} />
      <Route path={ROUTES.ALL} element={<Navigate to={ROUTES.NAO_ENCONTRADO} replace />} />
    </Routes>
  );
};

export default AppRouter;