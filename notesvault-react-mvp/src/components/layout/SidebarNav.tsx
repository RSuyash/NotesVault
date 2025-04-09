import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './SidebarNav.module.css';
import SlideConfirm from '../ui/SlideConfirm';

import {
  HomeIcon,
  UsersIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  TrophyIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
const DashboardIcon = () => <HomeIcon className={styles.navLinkIcon} />;
const GroupsIcon = () => <UsersIcon className={styles.navLinkIcon} />;
const FlashcardsIcon = () => <Squares2X2Icon className={styles.navLinkIcon} />;
const DocsIcon = () => <DocumentTextIcon className={styles.navLinkIcon} />;
const LeaderboardIcon = () => <TrophyIcon className={styles.navLinkIcon} />;
const SettingsIcon = () => <Cog6ToothIcon className={styles.footerButtonIcon} />;
const LogoutIcon = () => <ArrowRightOnRectangleIcon className={styles.footerButtonIcon} />;
const CloseIcon = () => <XMarkIcon className="w-6 h-6" />;
interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen, onClose }) => {
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

  console.log("SidebarNav: navItems array", navItems);

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
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true"></div>
      )}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="NotesVault Logo" style={{ height: '24px', width: 'auto' }} />
            <span>NotesVault</span>
          </Link>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close sidebar">
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const IconComponent = item.icon;
            console.log("Rendering icon for:", item.label, IconComponent);
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

        <div className={styles.footer} style={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
          {/* Settings link moved to UserMenuDropdown */}
          <button
            onClick={handleLogout}
            className={`${styles.footerButton} ${styles.logout}`}
          >
            <LogoutIcon />
          </button>
        </div>

      </div>

      {showSlideConfirm && (
        <SlideConfirm
          message={slideConfirmMessage}
          onConfirm={onSlideConfirmCallback}
          onCancel={() => setShowSlideConfirm(false)}
        />
      )}
    </>
  );
};

export default SidebarNav;