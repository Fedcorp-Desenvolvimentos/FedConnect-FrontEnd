import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';
import { Outlet } from 'react-router-dom';
import '../components/styles/DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    function handleResize() {
      setSidebarOpen(window.innerWidth > 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="dashboard-main">
        <div className={`dashboard-content${sidebarOpen ? ' with-sidebar' : ''}`}>
          <Breadcrumb sidebarOpen={sidebarOpen} />
          <div className="content-wrapper">
            <div className="page-content">
              <Outlet context={{ withSidebar: sidebarOpen }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;