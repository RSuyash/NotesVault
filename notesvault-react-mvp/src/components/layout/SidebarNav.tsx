import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './SidebarNav.module.css';

// --- Icons --- (Using simple text/emoji for now)
// TODO: Replace with SVG icons
const DashboardIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>🏠</span>;
const ProfileIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>👤</span>;
const NotesIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>📝</span>;
const FlashcardsIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>🗂️</span>;
const GroupsIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>👥</span>;
const LeaderboardIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>🏆</span>;
const DocsIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>📄</span>;
const SettingsIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.footerButtonIcon} ${className}`}>⚙️</span>;
const LogoutIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.footerButtonIcon} ${className}`}>🚪</span>;
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

  // Define navigation items with better icons
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { path: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
    { path: '/dashboard/notes', label: 'Smart Notes', icon: NotesIcon },
    { path: '/dashboard/flashcards', label: 'Flashcards', icon: FlashcardsIcon },
    { path: '/dashboard/studygroups', label: 'Study Groups', icon: GroupsIcon },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
    { path: '/dashboard/docs', label: 'MindHack Docs', icon: DocsIcon },
  ];

  const handleLogout = async () => {
    console.log('Logout clicked');
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
    }
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
    </div>
  );
};

export default SidebarNav;