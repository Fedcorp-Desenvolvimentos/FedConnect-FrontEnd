import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Breadcrumb.css';
import { useAuth } from "../../context/AuthContext";
import { Settings, ChevronRight, MoreVertical, Home, User, History, Users, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from 'react';

const Breadcrumb = ({ sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Mapeamento de rotas para nomes amigáveis
  const pathMap = {
    '/home': 'Dashboard',
    
    // Consultas
    '/consultas': 'Consultas',
    '/consulta-pf': 'Consulta PF',
    '/consulta-end': 'Consulta Endereço',
    '/consulta-cnpj': 'Consulta CNPJ',
    '/consulta-comercial': 'Comercial',
    '/comercial-regiao': 'Busca por Região',
    '/consulta-segurados': 'Segurados',
    '/consulta-faturas': 'Faturas',
    '/consulta-faturamento': 'Consulta Faturamento',
    '/consulta-detalhes/:id': 'Detalhes da Consulta',
    
    // Comercial
    '/acompanhamento': 'Acompanhamento Comercial',
    '/agenda-comercial': 'Agenda Comercial',
    '/financeiro': 'Financeiro',
    
    // Ferramentas
    '/ferramentas': 'Ferramentas',
    '/cotacao-conteudo': 'Cotação de Conteúdo',
    
    // Faturamento
    '/faturamento': 'Faturamento',
    '/faturamento/pdf-automation': 'Automação PDF',
    '/faturamento/cancelamento': 'Cancelamento',
    '/faturamento/reimpressao-boleto': 'Reimpressão de Boleto',
    
    // Métricas
    '/metricas': 'Métricas',
    
    // E-mail
    '/envio-email': 'Envio de E-mail',
    '/config-email': 'Configuração de E-mail',
    
    // Agenda
    '/agenda': 'Agenda de Salas',
    
    // Produtos
    '/produtos': 'Produtos',
    
    // Administração
    '/home-adm': 'Administração',
    '/upload': 'Upload',
    '/importacao-vida': 'Importação Vida',
    
    // Conta do usuário
    '/conta': 'Minha Conta',
    '/config': 'Configurações',
    '/cadastro': 'Cadastro',
    '/historico': 'Histórico'
  };

  // Mapeamento de níveis de acesso para nomes amigáveis
  const accessLevelMap = {
    'admin': 'Administrador',
    'usuario': 'Colaborador',
    'comercial': 'Comercial',
    'faturamento': 'Faturamento',
    'ti': 'TI',
    'financeiro': 'Financeiro',
    'moderador': 'Moderador'
  };

  // Mapeamento com ícones
  const pathMapWithIcons = {
    '/home': { label: 'Dashboard', icon: 'bi-house' },
    
    // Consultas
    '/consultas': { label: 'Consultas', icon: 'bi-search' },
    '/consulta-pf': { label: 'Consulta PF', icon: 'bi-person' },
    '/consulta-end': { label: 'Consulta Endereço', icon: 'bi-geo-alt' },
    '/consulta-cnpj': { label: 'Consulta CNPJ', icon: 'bi-building' },
    '/consulta-comercial': { label: 'Comercial', icon: 'bi-graph-up' },
    '/comercial-regiao': { label: 'Busca por Região', icon: 'bi-map' },
    '/consulta-segurados': { label: 'Segurados', icon: 'bi-people' },
    '/consulta-faturas': { label: 'Faturas', icon: 'bi-receipt' },
    '/consulta-faturamento': { label: 'Consulta Faturamento', icon: 'bi-cash-stack' },
    '/consulta-detalhes/:id': { label: 'Detalhes', icon: 'bi-eye' },
    
    // Comercial
    '/acompanhamento': { label: 'Acompanhamento', icon: 'bi-bar-chart' },
    '/agenda-comercial': { label: 'Agenda Comercial', icon: 'bi-calendar-check' },
    '/financeiro': { label: 'Financeiro', icon: 'bi-currency-dollar' },
    
    // Ferramentas
    '/ferramentas': { label: 'Ferramentas', icon: 'bi-tools' },
    '/cotacao-conteudo': { label: 'Cotação', icon: 'bi-file-earmark-text' },
    
    // Faturamento
    '/faturamento': { label: 'Faturamento', icon: 'bi-wallet2' },
    '/faturamento/pdf-automation': { label: 'Automação PDF', icon: 'bi-file-pdf' },
    '/faturamento/cancelamento': { label: 'Cancelamento', icon: 'bi-x-circle' },
    '/faturamento/reimpressao-boleto': { label: 'Reimpressão', icon: 'bi-printer' },
    
    // Métricas
    '/metricas': { label: 'Métricas', icon: 'bi-graph-up-arrow' },
    
    // E-mail
    '/envio-email': { label: 'Envio de E-mail', icon: 'bi-envelope' },
    '/config-email': { label: 'Config. E-mail', icon: 'bi-gear' },
    
    // Agenda
    '/agenda': { label: 'Agenda', icon: 'bi-calendar-event' },
    
    // Produtos
    '/produtos': { label: 'Produtos', icon: 'bi-box-seam' },
    
    // Administração
    '/home-adm': { label: 'Administração', icon: 'bi-shield-check' },
    '/upload': { label: 'Upload', icon: 'bi-cloud-upload' },
    '/importacao-vida': { label: 'Importação Vida', icon: 'bi-database' },
    
    // Conta do usuário
    '/conta': { label: 'Minha Conta', icon: 'bi-person-circle' },
    '/config': { label: 'Configurações', icon: 'bi-sliders' },
    '/cadastro': { label: 'Cadastro', icon: 'bi-person-plus' },
    '/historico': { label: 'Histórico', icon: 'bi-clock-history' }
  };

  // Formatar data atual
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para construir breadcrumb dinâmico
  const buildBreadcrumbItems = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    
    // Se estiver na página inicial, retorna apenas o item "Dashboard"
    if (location.pathname === '/home' || location.pathname === '/') {
      return [{ label: 'Início', path: '/home', isActive: true }];
    }

    const items = [{ label: 'Início', path: '/home' }];

    let accumulatedPath = '';

    segments.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;

      // remove ids numéricos
      const cleanPath = accumulatedPath.replace(/\/\d+$/g, '');

      let label =
        pathMap[accumulatedPath] ||
        pathMap[cleanPath];

      // fallback elegante
      if (!label) {
        label = segment
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      items.push({
        label,
        path: accumulatedPath,
        isActive: index === segments.length - 1
      });
    });

    return items;
  };

  const breadcrumbItems = buildBreadcrumbItems();

  // Filtrar breadcrumbs para mobile (mostrar apenas últimos 2 itens)
  const getMobileBreadcrumbItems = () => {
    if (breadcrumbItems.length <= 2) return breadcrumbItems;
    return [
      breadcrumbItems[0],
      { label: '...', path: '#', isEllipsis: true },
      ...breadcrumbItems.slice(-2)
    ];
  };

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nivelAcesso = user?.nivel_acesso;

  const handleLogout = () => {
    setShowMobileMenu(false);
    setShowDropdown(false);
    logout();
  };

  return (
    <nav className={`breadcrumb-container ${sidebarOpen ? 'with-sidebar' : ''}`} aria-label="Navegação estrutural">
      {/* Lado esquerdo: Breadcrumb tradicional */}
      <div className="breadcrumb-left">
        {/* Mobile: Breadcrumb compacto */}
        <div className="breadcrumb-mobile">
          <div className="mobile-breadcrumb">
            <button 
              className="mobile-home-btn"
              onClick={() => navigate('/home')}
              title="Home"
            >
              <Home size={18} />
            </button>
            
            <ol className="mobile-breadcrumb-list">
              {getMobileBreadcrumbItems().map((item, index, array) => {
                if (item.isEllipsis) {
                  return (
                    <li key="ellipsis" className="breadcrumb-ellipsis">
                      <span>...</span>
                    </li>
                  );
                }
                
                let routeInfo = pathMapWithIcons[item.path];
                if (!routeInfo) {
                  const cleanPath = item.path.replace(/\/\d+$/g, '');
                  routeInfo = pathMapWithIcons[cleanPath];
                }
                
                return (
                  <li key={index} className="mobile-breadcrumb-item">
                    {index === array.length - 1 ? (
                      <span className="mobile-breadcrumb-current">
                        {item.label}
                      </span>
                    ) : (
                      <Link to={item.path} className="mobile-breadcrumb-link">
                        {item.label}
                      </Link>
                    )}
                    {index < array.length - 1 && !item.isEllipsis && (
                      <ChevronRight size={12} className="mobile-separator" />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
          
          {/* Botão de dropdown mobile */}
          <div className="mobile-menu-container" ref={mobileMenuRef}>
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Menu"
            >
              <MoreVertical size={20} />
            </button>
            
            {/* Menu dropdown mobile */}
            {showMobileMenu && (
              <div className="mobile-dropdown-menu">
                <div className="mobile-user-info">
                  <div className="mobile-user-name">
                    {user?.nome_completo || user?.email || 'Usuário'}
                  </div>
                  <div className="mobile-user-role">
                    {accessLevelMap[user?.nivel_acesso] || user?.nivel_acesso || 'N/A'}
                  </div>
                  <div className="mobile-user-date">
                    <i className="bi bi-calendar3"></i>
                    {getCurrentDateTime()}
                  </div>
                </div>
                
                <div className="mobile-dropdown-divider"></div>
                
                <div className="mobile-menu-items">
                  {/* Opções baseadas no nível de acesso */}
                  {["admin", "usuario", "moderador", "comercial", "administradora", "faturamento", "ti"].includes(nivelAcesso) && (
                    <>
                      <button 
                        className="mobile-menu-item"
                        onClick={() => {
                          navigate('/config');
                          setShowMobileMenu(false);
                        }}
                      >
                        <i className="bi bi-person-circle"></i>
                        <span>Conta</span>
                      </button>
                      
                      <button 
                        className="mobile-menu-item"
                        onClick={() => {
                          navigate('/historico');
                          setShowMobileMenu(false);
                        }}
                      >
                        <i className="bi bi-clock-history"></i>
                        <span>Histórico</span>
                      </button>
                    </>
                  )}
                  
                  {nivelAcesso === 'admin' && (
                    <>
                      <button 
                        className="mobile-menu-item"
                        onClick={() => {
                          navigate('/conta');
                          setShowMobileMenu(false);
                        }}
                      >
                        <i className="bi bi-gear"></i>
                        <span>Configurações</span>
                      </button>
                      
                      <button 
                        className="mobile-menu-item"
                        onClick={() => {
                          navigate('/cadastro');
                          setShowMobileMenu(false);
                        }}
                      >
                        <i className="bi bi-people-fill"></i>
                        <span>Cadastrar Usuários</span>
                      </button>
                    </>
                  )}
                  
                  <div className="mobile-dropdown-divider"></div>
                  
                  <button 
                    className="mobile-menu-item"
                    onClick={() => {
                      navigate('/settings');
                      setShowMobileMenu(false);
                    }}
                  >
                    <Settings size={16} />
                    <span>Configurações Gerais</span>
                  </button>
                  
                  <button 
                    className="mobile-menu-item logout"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop: Breadcrumb completo */}
        <ol className="breadcrumb-list desktop-breadcrumb">
          {breadcrumbItems.map((item, index) => {
            let routeInfo = pathMapWithIcons[item.path];
            
            if (!routeInfo) {
              const cleanPath = item.path.replace(/\/\d+$/g, '');
              routeInfo = pathMapWithIcons[cleanPath];
            }
            
            return (
              <li key={index} className="breadcrumb-item">
                {index === breadcrumbItems.length - 1 ? (
                  <span className="breadcrumb-current" aria-current="page">
                    {routeInfo && <i className={`bi ${routeInfo.icon}`}></i>}
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className="breadcrumb-link">
                    {routeInfo && <i className={`bi ${routeInfo.icon}`}></i>}
                    {item.label}
                  </Link>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <ChevronRight size={14} className="breadcrumb-separator" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Lado direito: Informações do usuário, ações e dropdown desktop */}
      <div className="breadcrumb-right desktop-user-info">
        {/* Informações do usuário */}
        <div className="user-info-container">
          <div className="user-details">
            <div className="user-name">
              {user?.nome_completo || user?.email || 'Usuário'}
            </div>
            <div className="user-meta">
              <span className="user-role">
                <i className="bi bi-shield-check"></i>
                {accessLevelMap[user?.nivel_acesso] || user?.nivel_acesso || 'N/A'}
              </span>
              <span className="user-status">
                <i className={`bi bi-circle-fill ${user?.is_active ? 'active' : 'inactive'}`}></i>
                {user?.is_active ? 'Ativo' : 'Inativo'}
              </span>
              <span className="user-fed">
                <i className="bi bi-calendar3"></i>
                {getCurrentDateTime()}
              </span>
            </div>
          </div>

          {/* Ações do usuário */}
          <div className="user-actions">
            {/* Dropdown desktop */}
            <div className="dropdown-container" ref={dropdownRef}>
              <button 
                className="action-btn dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Mais opções"
                aria-label="Mais opções"
              >
                <MoreVertical size={20} />
              </button>
              
              {/* Dropdown menu desktop */}
              {showDropdown && (
                <div className="dropdown-menu desktop-dropdown">
                  <div className="dropdown-items">
                    {/* Opções baseadas no nível de acesso */}
                    {["admin", "usuario", "moderador", "comercial", "administradora", "faturamento", "ti"].includes(nivelAcesso) && (
                      <>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/config');
                            setShowDropdown(false);
                          }}
                        >
                          <User size={16} />
                          <span>Minha Conta</span>
                        </button>
                        
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/historico');
                            setShowDropdown(false);
                          }}
                        >
                          <History size={16} />
                          <span>Histórico</span>
                        </button>
                      </>
                    )}
                    
                    {nivelAcesso === 'admin' && (
                      <>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/conta');
                            setShowDropdown(false);
                          }}
                        >
                          <Settings size={16} />
                          <span>Configurações Gerais</span>
                        </button>
                        
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            navigate('/cadastro');
                            setShowDropdown(false);
                          }}
                        >
                          <Users size={16} />
                          <span>Cadastrar Usuários</span>
                        </button>
                      </>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className="action-btn profile-btn"
              title="Configurações"
              aria-label="Configurações"
              onClick={() => navigate('/config')}
            >
              <Settings size={20} />
            </button>
            
            <button 
              className="action-btn logout-btn"
              title="Sair"
              aria-label="Sair"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;