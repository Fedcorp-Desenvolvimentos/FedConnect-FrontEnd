import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaBriefcase,
  FaTools,
  FaWallet,
  FaChartBar,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaProjectDiagram,
  FaUsers,
  FaFileInvoiceDollar,
  FaUserPlus,
  FaUserMd

} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { ROUTE_ACCESS } from "../../utils/routeAccess";
import * as S from "./SidebarStyles";
import { DollarSign } from "lucide-react";

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
    "leonanthomaz.fedcorp@gmail.com",
    "operacional@grupofedcorp.com.br",
    "danielmello0110@gmail.com",
    "ingrydaylana@gmail.com"
  ];

  const navItems = [
    { path: "/home", label: "Início", icon: <FaHome />, allowed: ROUTE_ACCESS.home },
    { path: "/consultas", label: "Consultas", icon: <FaClipboardList />, allowed: ROUTE_ACCESS.consultas },
    { path: "/consulta-comercial", label: "Comercial", icon: <FaBriefcase />, allowed: ROUTE_ACCESS.comercial },
    { path: "/ferramentas", label: "Ferramentas", icon: <FaTools />, allowed: ROUTE_ACCESS.ferramentas },
    { path: "/faturamento", label: "Faturamento", icon: <FaWallet />, allowed: ROUTE_ACCESS.faturamento },
    { path: "/metricas", label: "Métricas", icon: <FaChartBar />, allowed: ROUTE_ACCESS.metricas },
    { path: "/agenda", label: "Agenda", icon: <FaCalendarAlt />, allowed: ROUTE_ACCESS.agenda },
    { path: "/automacao", label: "Automação", icon: <FaCog />, allowed: emailsPermitidosAutomacao.includes(emailUsuario) ? ROUTE_ACCESS.automacao : ROUTE_ACCESS.admin },
    { path: "/analytics", label: "Estatísticas", icon: <FaChartLine />, allowed: ROUTE_ACCESS.analytics },
    { path: "/questionarios", label: "Questionário", icon: <FaClipboardList />, allowed: ROUTE_ACCESS.questionarios },
    { path: "/financeiro", label: "Financeiro", icon: <FaFileInvoiceDollar />, allowed: ROUTE_ACCESS.financeiro },
    { path: "/cadastro-pessoas", label: "Cadastro", icon: <FaUserPlus />, allowed: ROUTE_ACCESS.cadastroPessoas },
    { path: "/condomed", label: "Condomed", icon: <FaUserMd />, allowed: ROUTE_ACCESS.condomed },
    // { path: "/workflow", label: "Workflow", icon: <FaProjectDiagram />, allowed: ["admin", "usuario", "comercial", "faturamento", "ti"] },
    // { path: "/rh", label: "Recursos Humanos", icon: <FaUsers />, allowed: ["admin"] },
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
                (item.path === "/faturamento" && location.pathname.startsWith("/faturamento")) ||
                (item.path === "/financeiro" && location.pathname.startsWith("/financeiro")) ||
                (item.path === "/condomed" && location.pathname.startsWith("/condomed"));

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
                      <S.IconWrapper>
                        {item.icon}
                      </S.IconWrapper>
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