import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen, toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();

  const nivelAcesso = user?.nivel_acesso;

  // Detecta mudança de tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Se for desktop, força sidebar aberta
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  // Fecha dropdown quando muda de rota
  useEffect(() => setDropdownOpen(false), [location.pathname]);

  // Mostra overlay no mobile quando sidebar abre
  useEffect(() => {
    if (isMobile) {
      setOverlayVisible(sidebarOpen);
    }
  }, [sidebarOpen, isMobile]);

  // Fecha sidebar no mobile quando clica fora
  useEffect(() => {
    if (!isMobile) return;
    
    function handleClickOutside(e) {
      if (
        sidebarOpen && 
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
        setOverlayVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen, isMobile]);

  // Handler para clique no link - só fecha no mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
      setOverlayVisible(false);
    }
  };

  return (
    <>
      {/* Overlay (só mobile quando sidebar aberta) */}
      {isMobile && overlayVisible && (
        <div 
          className="sidebar-overlay"
          onClick={() => {
            setSidebarOpen(false);
            setOverlayVisible(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "open" : "closed"}`}
        aria-label="Menu lateral principal"
        ref={sidebarRef}
      >
        <div className="sidebar-header">
          <Link to="/home" className="logo-link" onClick={handleLinkClick}>
            <img
              src="/imagens/LOGO.png"
              alt="Logo"
              className="logo-desktop"
            />
            <img
              src="/imagens/LOGO.png"
              alt="Ícone Fedcorp"
              className="logo-mobile"
            />
          </Link>
          
          {/* Botão X para fechar (DENTRO do sidebar, só mobile) */}
          {isMobile && (
            <button 
              className="sidebar-close-btn" 
              onClick={() => {
                setSidebarOpen(false);
                setOverlayVisible(false);
              }}
              aria-label="Fechar menu"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === "/home" ? "active" : ""}>
              <Link 
                to="/home"
                data-tooltip="Início"
                onClick={handleLinkClick}
              >
                <div className="sidebar-icon-tooltip">
                  <i className="bi bi-house-door-fill"></i>
                  <span>Início</span>
                </div>
              </Link>
            </li>

            {["admin", "usuario", "comercial", "faturamento", "ti"].includes(nivelAcesso) && (
              <li className={location.pathname.startsWith("/consultas") ? "active" : ""}>
                <Link 
                  to="/consultas"
                  data-tooltip="Consultas"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-clipboard2-minus-fill"></i>
                    <span>Consultas</span>
                  </div>
                </Link>
              </li>
            )}

            {["admin", "comercial"].includes(nivelAcesso) && (
              <li className={location.pathname === "/consulta-comercial" ? "active" : ""}>
                <Link 
                  to="/consulta-comercial"
                  data-tooltip="Comercial"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-ui-checks-grid"></i>
                    <span>Comercial</span>
                  </div>
                </Link>
              </li>
            )}

            {["admin", "usuario", "comercial", "faturamento", "ti"].includes(nivelAcesso) && (
              <li className={location.pathname === "/ferramentas" ? "active" : ""}>
                <Link 
                  to="/ferramentas"
                  data-tooltip="Ferramentas"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-tools"></i>
                    <span>Ferramentas</span>
                  </div>
                </Link>
              </li>
            )}

            {["admin", "faturamento", "ti"].includes(nivelAcesso) && (
              <li className={location.pathname.startsWith("/faturamento") ? "active" : ""}>
                <Link 
                  to="/faturamento"
                  data-tooltip="Faturamento"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-wallet2"></i>
                    <span>Faturamento</span>
                  </div>
                </Link>
              </li>
            )}

            {["admin"].includes(nivelAcesso) && (
              <li className={location.pathname === "/metricas" ? "active" : ""}>
                <Link 
                  to="/metricas"
                  data-tooltip="Métricas"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-bar-chart-fill"></i>
                    <span>Métricas</span>
                  </div>
                </Link>
              </li>
            )}

            {["admin", "usuario", "comercial", "faturamento", "ti"].includes(nivelAcesso) && (
              <li className={location.pathname === "/agenda" ? "active" : ""}>
                <Link 
                  to="/agenda"
                  data-tooltip="Agenda"
                  onClick={handleLinkClick}
                >
                  <div className="sidebar-icon-tooltip">
                    <i className="bi bi-calendar-event"></i>
                    <span>Agenda</span>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;