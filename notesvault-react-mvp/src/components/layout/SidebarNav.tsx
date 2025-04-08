import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './SidebarNav.module.css';
import SlideConfirm from '../ui/SlideConfirm';
import { FiHome, FiUsers, FiBookOpen, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';

// --- Icons --- (Using simple text/emoji for now)
// TODO: Replace with SVG icons
const DashboardIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.navLinkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m-4 0h4" />
  </svg>
);
const FlashcardsIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.navLinkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);
const GroupsIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.navLinkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 110 7.75 4 4 0 010-7.75zM8 3.13a4 4 0 110 7.75 4 4 0 010-7.75z" />
  </svg>
);
const LeaderboardIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.navLinkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3z" />
  </svg>
);
const DocsIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.navLinkIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10M7 11h10M7 15h10" />
  </svg>
);
const SettingsIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.footerButtonIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const LogoutIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`${styles.footerButtonIcon} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);
// --- End Icons ---

interface SidebarNavProps {
  onClose?: () => void; // Optional callback for closing the sidebar
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();


  const [showSlideConfirm, setShowSlideConfirm] = React.useState(false);
  const [slideConfirmMessage, setSlideConfirmMessage] = React.useState('');
  const [onSlideConfirmCallback, setOnSlideConfirmCallback] = React.useState<() => void>(() => () => {});

  // Define navigation items with better icons
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
      {/* Header Area */}
      <div className={styles.headerArea}>
        {/* Wrap logo in a link to homepage */}
        <Link to="/" className={styles.logoText} title="Go to Homepage">
            NotesVault
        </Link>
        {onClose && (
           <button onClick={onClose} className={styles.closeButton} aria-label="Close sidebar">
             <CloseIcon />
           </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={onClose} // Close sidebar on link click (mobile)
            >
              <IconComponent />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className={styles.footerArea}>
         <Link
            to="/dashboard/settings"
            className={`${styles.footerButton} ${location.pathname.startsWith('/dashboard/settings') ? styles.active : ''}`}
            onClick={onClose}
            title="Settings" // Add title for clarity
          >
             <SettingsIcon />
             <span className={styles.footerButtonText}>Settings</span> {/* Make text visible */}
         </Link>
        <button
            onClick={handleLogout}
            className={`${styles.footerButton} ${styles.logout}`}
            title="Logout" // Add title for clarity
        >
          <LogoutIcon />
           <span className={styles.footerButtonText}>Logout</span> {/* Make text visible */}
        </button>
      </div>
      {showSlideConfirm && (
        <SlideConfirm
          message={slideConfirmMessage}
          onConfirm={onSlideConfirmCallback}
          onCancel={() => setShowSlideConfirm(false)}
        />
      )}
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