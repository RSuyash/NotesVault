import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SidebarNav.module.css'; // Import CSS Module

// Placeholder icons
const PlaceholderIcon = () => <span className={styles.navLinkIcon}>▫️</span>;
const LogoutIcon = () => <span className={styles.logoutButtonIcon}>🚪</span>; // Example logout icon

const SidebarNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <PlaceholderIcon /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <PlaceholderIcon /> },
    { path: '/dashboard/notes', label: 'Smart Notes', icon: <PlaceholderIcon /> },
    { path: '/dashboard/flashcards', label: 'Flashcards', icon: <PlaceholderIcon /> },
    { path: '/dashboard/studygroups', label: 'Study Groups', icon: <PlaceholderIcon /> },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: <PlaceholderIcon /> },
    { path: '/dashboard/docs', label: 'MindHack Docs', icon: <PlaceholderIcon /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <PlaceholderIcon /> },
  ];

  // TODO: Implement logout functionality
  const handleLogout = () => {
    console.log('Logout clicked');
    // Add logout logic here (e.g., clear session, redirect)
  };

  return (
    <div className={styles.sidebar}>
      {/* Logo Area */}
      <div className={styles.logoArea}>
        <span className={styles.logoText}>NotesVault</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className={styles.footerArea}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogoutIcon />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;