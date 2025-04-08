import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './SidebarNav.module.css';
import axios from 'axios'; // Needed for logout potentially

// --- Placeholder Icons ---
// TODO: Replace with actual SVG icons or an icon library (e.g., react-icons)
const PlaceholderIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.navLinkIcon} ${className}`}>▫️</span>;
const SettingsIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.footerButtonIcon} ${className}`}>⚙️</span>;
const LogoutIcon = ({ className = '' }: { className?: string }) => <span className={`${styles.footerButtonIcon} ${className}`}>🚪</span>;
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);
// --- End Placeholder Icons ---

interface SidebarNavProps {
  onClose?: () => void; // Optional callback for closing the sidebar (e.g., via close button)
}


const SidebarNav: React.FC<SidebarNavProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation items
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: PlaceholderIcon },
    { path: '/dashboard/profile', label: 'Profile', icon: PlaceholderIcon },
    { path: '/dashboard/notes', label: 'Smart Notes', icon: PlaceholderIcon },
    { path: '/dashboard/flashcards', label: 'Flashcards', icon: PlaceholderIcon },
    { path: '/dashboard/studygroups', label: 'Study Groups', icon: PlaceholderIcon },
    { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: PlaceholderIcon },
    { path: '/dashboard/docs', label: 'MindHack Docs', icon: PlaceholderIcon },
  ];

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      // Call backend logout endpoint if it exists (to destroy session server-side)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      if (API_BASE_URL) {
         // Assuming you create a logout.php endpoint later
         // await axios.post(`${API_BASE_URL}/logout.php`, {}, { withCredentials: true });
      }
    } catch (error) {
        console.error("Logout API call failed:", error);
        // Proceed with client-side cleanup even if API fails
    } finally {
        // Clear any client-side auth state (e.g., username in localStorage)
        localStorage.removeItem('username');
        // Redirect to login page
        navigate('/login');
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* Header Area */}
      <div className={styles.headerArea}>
        <span className={styles.logoText}>NotesVault</span>
        {/* Close button for mobile */}
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
         <Link to="/dashboard/settings" className={`${styles.footerButton} ${location.pathname.startsWith('/dashboard/settings') ? styles.active : ''}`} onClick={onClose}>
             <SettingsIcon />
             <span className="sr-only">Settings</span> {/* Screen reader text */}
         </Link>
        <button onClick={handleLogout} className={`${styles.footerButton} ${styles.logout}`}>
          <LogoutIcon />
           <span className="sr-only">Logout</span> {/* Screen reader text */}
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;