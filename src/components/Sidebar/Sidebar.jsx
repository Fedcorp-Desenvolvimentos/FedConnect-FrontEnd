// components/Sidebar/Sidebar.js
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as S from "./SidebarStyles";

function Sidebar({ sidebarOpen, setSidebarOpen, toggleSidebar }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();

  const nivelAcesso = user?.nivel_acesso;
  const emailUsuario = user?.email;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  useEffect(() => {
    if (isMobile) setOverlayVisible(sidebarOpen);
  }, [sidebarOpen, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    
    function handleClickOutside(e) {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
        setOverlayVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen, isMobile]);

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      setOverlayVisible(false);
    }
  };

  const emailsPermitidosAutomacao = [
    "leonan.thomaz@gmail.com",
    "operacional@grupofedcorp.com.br",
    "danielmello0110@gmail.com",
    "ingrydaylana@gmail.com"
  ];

  const navItems = [
    { path: "/home", label: "Início", icon: "bi-house-door-fill", allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    { path: "/consultas", label: "Consultas", icon: "bi-clipboard2-minus-fill", allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    { path: "/consulta-comercial", label: "Comercial", icon: "bi-ui-checks-grid", allowed: ["admin", "comercial"] },
    { path: "/ferramentas", label: "Ferramentas", icon: "bi-tools", allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    { path: "/faturamento", label: "Faturamento", icon: "bi-wallet2", allowed: ["admin", "faturamento", "ti"] },
    { path: "/metricas", label: "Métricas", icon: "bi-bar-chart-fill", allowed: ["admin"] },
    { path: "/agenda", label: "Agenda", icon: "bi-calendar-event", allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    // { path: "/automacao", label: "Automação", icon: "bi-gear-fill", allowed: emailsPermitidosAutomacao.includes(emailUsuario) ? ["admin"] : [] },
    { path: "/analytics", label: "Estatísticas", icon: "bi-bar-chart-fill", allowed: ["admin"] },
    // { path: "/workflow", label: "Workflow", icon: "bi-kanban-fill", allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    // { path: "/rh", label: "Recursos Humanos", icon: "bi-people-fill", allowed: ["admin"] },
  ];

  return (
    <>
      {isMobile && overlayVisible && (
        <S.Overlay onClick={() => {
          setSidebarOpen(false);
          setOverlayVisible(false);
        }} />
      )}

      <S.SidebarContainer 
        ref={sidebarRef}
        $isOpen={sidebarOpen}
        aria-label="Menu lateral principal"
      >
        <S.SidebarHeader>
          <S.LogoLink href="/home" onClick={handleLinkClick}>
            <S.Logo 
              src="/imagens/LOGO.png" 
              alt="Fedcorp Logo"
              $isClosed={!sidebarOpen}
              $isMobile={isMobile}
            />
          </S.LogoLink>
          
          {isMobile && (
            <S.CloseButton 
              $isOpen={sidebarOpen}
              onClick={() => {
                setSidebarOpen(false);
                setOverlayVisible(false);
              }}
              aria-label="Fechar menu"
            >
              <i className="bi bi-x-lg"></i>
            </S.CloseButton>
          )}
        </S.SidebarHeader>

        <S.Nav>
          <ul>
            {navItems.map((item) => {
              if (!item.allowed.includes(nivelAcesso)) return null;
              const isActive = location.pathname === item.path || 
                              (item.path === "/consultas" && location.pathname.startsWith("/consultas")) ||
                              (item.path === "/faturamento" && location.pathname.startsWith("/faturamento"));
              
              return (
                <li key={item.path} className={isActive ? "active" : ""}>
                  <S.NavLink
                    as={Link}
                    to={item.path}
                    $isActive={isActive}
                    $isClosed={!sidebarOpen}
                    $isOpen={sidebarOpen}
                    data-tooltip={item.label}
                    onClick={handleLinkClick}
                  >
                    <S.IconTooltip $isClosed={!sidebarOpen} $isOpen={sidebarOpen}>
                      <S.Icon className={`bi ${item.icon}`} />
                      <S.LinkText>{item.label}</S.LinkText>
                    </S.IconTooltip>
                  </S.NavLink>
                </li>
              );
            })}
          </ul>
        </S.Nav>
      </S.SidebarContainer>
    </>
  );
}

export default Sidebar;