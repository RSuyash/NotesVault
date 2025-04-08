import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav.tsx';
import HeaderBar from './HeaderBar.tsx';
import styles from './DashboardLayout.module.css'; // Import CSS Module

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layoutContainer}>

      {/* Sidebar */}
      {/* Apply conditional class for open state */}
      <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
        <SidebarNav />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content Area */}
      <div className={styles.mainContentWrapper}>

        {/* Header Bar */}
        <HeaderBar onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className={styles.pageContent}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
