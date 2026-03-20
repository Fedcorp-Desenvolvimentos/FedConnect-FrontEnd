import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiMenu,
  FiChevronDown, 
  FiLogOut, 
  FiHome,
  FiChevronRight,
  FiUser,
  FiUsers,
  FiUserPlus,
  FiShield,
  FiKey,
  FiAward
} from 'react-icons/fi';
import { FaHistory, FaRegUser } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import '../../styles/Breadcrumb.css';
import { getAccessLevelLabel, getAccessLevelColor, ACCESS_LEVELS } from '../../utils/accessLevels';
import { formatarData, formatTempo } from '../../utils/formatar_data';

function Breadcrumb({ onToggleSidebar, sidebarOpen, className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const dropdownRef = useRef(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Atualiza isMobile no resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mapeamento de rotas para nomes amigáveis
  const routeNames = {
    '/home': 'Dashboard',
    
    // Consultas
    '/consultas': 'Consultas',
    '/consultas/consulta-pf': 'Consulta PF',
    '/consultas/consulta-end': 'Consulta Endereço',
    '/consultas/consulta-cnpj': 'Consulta CNPJ',
    '/consulta-comercial': 'Comercial',
    '/consultas/comercial-regiao': 'Busca por Região',
    '/consultas/consulta-segurados': 'Segurados',
    '/consultas/consulta-faturas': 'Faturas',
    '/consultas/consulta-faturamento': 'Consulta Faturamento',
    '/consultas/consulta-detalhes/:id': 'Detalhes da Consulta',
    
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
    '/faturamento/paybox': 'Paybox',
    
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
    '/gerenciar-usuarios': 'Gerenciar Usuários',
    '/minha-conta': 'Minha Conta',
    '/cadastro': 'Cadastro',
    '/historico': 'Histórico'
  };

  // Função para gerar o breadcrumb
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    let breadcrumbItems = [];
    let currentPath = '';
    
    // Adiciona "Home" como primeiro item se não estiver na raiz
    if (location.pathname !== '/home') {
      breadcrumbItems.push({
        label: 'Home',
        icon: <FiHome size={14} />,
        path: '/home'
      });
    }
    
    // Para cada segmento da rota
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Pula se for 'home' e já adicionamos
      if (segment === 'home' && index === 0) return;
      
      // Tenta encontrar no mapeamento exato, depois tenta com wildcard
      let label = routeNames[currentPath];
      
      // Se não achou exato, tenta encontrar rota com parâmetro
      if (!label) {
        // Procura rotas que tenham :id no lugar do segmento atual
        const possibleRoute = Object.keys(routeNames).find(route => {
          const routeParts = route.split('/');
          const currentParts = currentPath.split('/');
          
          if (routeParts.length !== currentParts.length) return false;
          
          return routeParts.every((part, i) => 
            part.startsWith(':') || part === currentParts[i]
          );
        });
        
        label = possibleRoute ? routeNames[possibleRoute] : formatSegment(segment);
      }
      
      breadcrumbItems.push({
        label: label,
        path: currentPath
      });
    });
    
    return breadcrumbItems;
  };

  // Formata segmentos de rota para nomes legíveis
  const formatSegment = (segment) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
  };

  // Funções de verificação de permissão
  const canManageUsers = () => {
    return user?.nivel_acesso === ACCESS_LEVELS.ADMIN || 
           user?.nivel_acesso === ACCESS_LEVELS.MASTER;
  };

  const canRegisterUsers = () => {
    return user?.nivel_acesso === ACCESS_LEVELS.ADMIN || 
           user?.nivel_acesso === ACCESS_LEVELS.MASTER;
  };

  const canViewHistory = () => {
    // Ajuste conforme sua lógica de negócio
    return user?.nivel_acesso === ACCESS_LEVELS.ADMIN || 
           user?.nivel_acesso === ACCESS_LEVELS.MASTER ||
           user?.nivel_acesso === ACCESS_LEVELS.USER;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const breadcrumbItems = getBreadcrumb();

  // Extrai informações do usuário com fallbacks
  const getUserInitials = () => {
    if (user?.nome_completo) {
      const names = user.nome_completo.split(' ');
      if (names.length > 1) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return user.nome_completo.charAt(0).toUpperCase();
    }
    if (user?.nome) return user.nome.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (user?.nome_completo) {
      return user.nome_completo.split(' ')[0];
    }
    if (user?.nome) {
      return user.nome.split(' ')[0];
    }
    if (user?.username) {
      return user.username.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0].split(' ')[0];
    }
    return 'Usuário';
  };

  const getUserEmail = () => {
    return user?.email || 'usuario@email.com';
  };

  // Ícone baseado no nível de acesso
  const getAccessLevelIcon = () => {
    switch(user?.nivel_acesso) {
      case ACCESS_LEVELS.MASTER:
        return <FiAward className="access-icon master" />;
      case ACCESS_LEVELS.ADMIN:
        return <FiShield className="access-icon admin" />;
      case ACCESS_LEVELS.USER:
        return <FiUser className="access-icon user" />;
      default:
        return <FiKey className="access-icon default" />;
    }
  };

  const accessLevelLabel = getAccessLevelLabel(user?.nivel_acesso);
  const accessLevelColor = getAccessLevelColor(user?.nivel_acesso);

  return (
    <nav className={className || "breadcrumb-nav"}>
      <div className="breadcrumb-left">
        {/* Botão de menu hambúrguer */}
        <button 
          className={`menu-button ${!sidebarOpen && isMobile ? 'menu-closed' : ''}`}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          <FiMenu size={20} />
        </button>

        {/* Breadcrumb */}
        <div className="breadcrumb-container">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="breadcrumb-item">
              {index > 0 && <FiChevronRight className="breadcrumb-separator" />}
              <button
                className={`breadcrumb-link ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}
                onClick={() => {
                  if (index < breadcrumbItems.length - 1) {
                    navigate(item.path);
                  }
                }}
                disabled={index === breadcrumbItems.length - 1}
              >
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                <span className="breadcrumb-label">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="breadcrumb-right">
        {!isMobile && (
          <div className="datetime-container">
            <span className="date">{formatarData(currentTime)}</span>
            <span className="time">{formatTempo(currentTime)}</span>
          </div>
        )}

        {/* Usuário */}
        <div className="user-container" ref={dropdownRef}>
          <button 
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {getUserInitials()}
            </div>
            {!isMobile && (
              <div className="user-info">
                <span className="user-name">
                  {getUserName()}
                </span>
                <span className="user-role" style={{ color: accessLevelColor }}>
                  {accessLevelLabel}
                </span>
              </div>
            )}
            <FiChevronDown className={`dropdown-arrow ${showUserMenu ? 'rotated' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar-wrapper">
                    <div className="dropdown-avatar">
                      {getUserInitials()}
                    </div>
                  </div>
                  <div>
                    <p className="dropdown-name">{getUserName()}</p>
                    <p className="dropdown-email">{getUserEmail()}</p>
                    {user?.nivel_acesso && (
                      <p className="dropdown-nivel">
                        <span 
                          className="access-badge"
                          style={{ 
                            color: accessLevelColor,
                            borderColor: accessLevelColor
                          }}
                        >
                          {accessLevelLabel}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              {/* Menu - Minha Conta (sempre visível) */}
              <button 
                className="dropdown-item"
                onClick={() => {
                  navigate('/minha-conta');
                  setShowUserMenu(false);
                }}
              >
                <FaRegUser className="dropdown-icon" /> Minha Conta
              </button>

              {/* Menu - Gerenciar Usuários (apenas admin/master) */}
              {canManageUsers() && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/gerenciar-usuarios');
                    setShowUserMenu(false);
                  }}
                >
                  <FiUsers className="dropdown-icon" /> Gerenciar Usuários
                </button>
              )}

              {/* Menu - Cadastrar Usuários (apenas admin/master) */}
              {canRegisterUsers() && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/cadastro');
                    setShowUserMenu(false);
                  }}
                >
                  <FiUserPlus className="dropdown-icon" /> Cadastrar Usuários
                </button>
              )}

              {/* Menu - Histórico (se tiver permissão) */}
              {canViewHistory() && (
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/historico');
                    setShowUserMenu(false);
                  }}
                >
                  <FaHistory className="dropdown-icon" /> Histórico
                </button>
              )}
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut className="dropdown-icon" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay para fechar menus ao clicar fora */}
      {showUserMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}

export default Breadcrumb;