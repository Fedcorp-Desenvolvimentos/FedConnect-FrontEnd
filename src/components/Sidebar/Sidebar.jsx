import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { user } = useAuth();

  const nivelAcesso = user?.nivel_acesso;

  // Fecha dropdown quando muda de rota
  useEffect(() => setDropdownOpen(false), [location.pathname]);

  // Mostra overlay no mobile quando sidebar abre
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setOverlayVisible(sidebarOpen);
    }
  }, [sidebarOpen]);

  // Fecha sidebar no mobile quando clica fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sidebarOpen && 
        window.innerWidth <= 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
        setOverlayVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Overlay (só mobile quando sidebar aberta) */}
      {overlayVisible && window.innerWidth <= 768 && (
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
          <Link to="/home" className="logo-link">
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
          {window.innerWidth <= 768 && (
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