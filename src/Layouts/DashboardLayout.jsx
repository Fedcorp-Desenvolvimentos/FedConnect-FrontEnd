import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { Outlet } from 'react-router-dom';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    function handleResize() {
      const newState = window.innerWidth > 768;
      setSidebarOpen(newState);
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const breadcrumbClass = `breadcrumb-nav ${
    window.innerWidth > 768 
      ? sidebarOpen ? 'with-sidebar-open' : 'with-sidebar-closed'
      : ''
  }`;

  return (
    <div className="dashboard-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="dashboard-main">
        <Breadcrumb 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          className={breadcrumbClass}
        />
        <div className={`dashboard-content ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
          <div className="content-wrapper">
            <div className="page-container">
              <div className="page-content">
                <Outlet context={{ withSidebar: sidebarOpen }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;