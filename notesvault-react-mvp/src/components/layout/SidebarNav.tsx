import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './SidebarNav.module.css';
import SlideConfirm from '../ui/SlideConfirm';

const DashboardIcon = () => (
  <svg className={styles.navLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
  </svg>
);
const GroupsIcon = () => (
  <svg className={styles.navLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 4a4 4 0 110 8 4 4 0 010-8z" />
  </svg>
);
const FlashcardsIcon = () => (
  <svg className={styles.navLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);
const DocsIcon = () => (
  <svg className={styles.navLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h10" />
  </svg>
);
const LeaderboardIcon = () => (
  <svg className={styles.navLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);
const SettingsIcon = () => (
  <svg className={styles.footerButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);
const LogoutIcon = () => (
  <svg className={styles.footerButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SidebarNavProps {
  onClose: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showSlideConfirm, setShowSlideConfirm] = React.useState(false);
  const [slideConfirmMessage, setSlideConfirmMessage] = React.useState('');
  const [onSlideConfirmCallback, setOnSlideConfirmCallback] = React.useState<() => void>(() => () => {});

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/dashboard/studygroups', label: 'Study Groups', icon: GroupsIcon },
    { path: '/dashboard/flashcards', label: 'Flashcards', icon: FlashcardsIcon },
    { path: '/dashboard/docs', label: 'MindHack Docs', icon: DocsIcon },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
  ];

  const handleLogout = () => {
    setSlideConfirmMessage('Are you sure you want to logout?');
    setOnSlideConfirmCallback(() => async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        if (API_BASE_URL) {
          await fetch(`${API_BASE_URL}/logout.php`, {
            method: 'POST',
            credentials: 'include',
          });
        }
      } catch (error) {
        console.error("Logout API call failed:", error);
      } finally {
        localStorage.removeItem('username');
        navigate('/login');
        setShowSlideConfirm(false);
      }
    });
    setShowSlideConfirm(true);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.headerArea}>
        <Link to="/" className={styles.logoText} title="Go to Homepage">
          NotesVault
        </Link>
        <button onClick={onClose} className={styles.closeButton} aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={onClose}
            >
              <IconComponent />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footerArea}>
        <Link
          to="/dashboard/settings"
          className={`${styles.footerButton} ${location.pathname.startsWith('/dashboard/settings') ? styles.active : ''}`}
          onClick={onClose}
          title="Settings"
        >
          <SettingsIcon />
          <span className={styles.footerButtonText}>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`${styles.footerButton} ${styles.logout}`}
          title="Logout"
        >
          <LogoutIcon />
          <span className={styles.footerButtonText}>Logout</span>
        </button>
      </div>

      {showSlideConfirm && (
        <SlideConfirm
          message={slideConfirmMessage}
          onConfirm={onSlideConfirmCallback}
          onCancel={() => setShowSlideConfirm(false)}
        />
      )}
    </div>
  );
};

export default SidebarNav;