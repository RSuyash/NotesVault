import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav.tsx';
import HeaderBar from './HeaderBar.tsx';
import styles from './DashboardLayout.module.css';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layoutContainer}>
      <div className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
        <SidebarNav isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </div>

      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <div className={styles.mainContentWrapper}>
        <HeaderBar onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
