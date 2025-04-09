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
  ChevronDownIcon, // Add ChevronDownIcon
} from '@heroicons/react/24/outline';
const DashboardIcon = () => <HomeIcon className={styles.navLinkIcon} />;
const GroupsIcon = () => <UsersIcon className={styles.navLinkIcon} />;
const FlashcardsIcon = () => <Squares2X2Icon className={styles.navLinkIcon} />;
const DocsIcon = () => <DocumentTextIcon className={styles.navLinkIcon} />;
const LeaderboardIcon = () => <TrophyIcon className={styles.navLinkIcon} />;
// Removed unused SettingsIcon component
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
  const [spinning, setSpinning] = React.useState(false);
  const [isStudyBoardOpen, setIsStudyBoardOpen] = React.useState(false); // State for dropdown


  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    {
      path: '/dashboard/studyboard', // Update path to match nested route
      label: 'Study Board',
      icon: GroupsIcon,
      children: [
        { path: '/dashboard/studygroups', label: 'Study Groups', icon: GroupsIcon },
        { path: '/dashboard/flashcards', label: 'Flashcards', icon: FlashcardsIcon },
        { path: '/dashboard/docs', label: 'MindHack Docs', icon: DocsIcon }, // Assuming this is different from MindHackDocsPage
        { path: '/dashboard/leaderboard', label: 'Leaderboard', icon: LeaderboardIcon },
      ],
    },
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

  const toggleSpin = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 1000); // spin for 1s
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
          {navItems.map((item, idx) => {
            if (item.children) {
              // Specific handling for Study Board dropdown
              if (item.label === 'Study Board') {
                return (
                  <div key={idx} className={styles.navGroup}>
                    <button
                      type="button"
                      className={`${styles.navGroupLabel} ${styles.navToggle}`} // Add navToggle class for styling
                      onClick={() => setIsStudyBoardOpen(!isStudyBoardOpen)}
                      aria-expanded={isStudyBoardOpen}
                    >
                      {/* Link wraps the content, navigates without closing sidebar */}
                      <Link
                        to={item.path ?? '#'} // Ensure this uses the updated path from navItems
                        className={styles.navToggleContent}
                        onClick={() => { // Remove unused 'e' parameter
                          // Optional: Prevent button toggle if clicking the link itself
                          // e.stopPropagation(); // Keep commented for now
                          // Decide if we want clicking the link to also toggle the dropdown.
                          // Let's allow it for now. If it feels weird, add stopPropagation.
                          setIsStudyBoardOpen(!isStudyBoardOpen); // Toggle on link click too
                        }}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </Link>
                      {/* Chevron remains part of the button for separate toggle */}
                      <ChevronDownIcon
                        className={`${styles.chevronIcon} ${isStudyBoardOpen ? styles.chevronOpen : ''}`}
                      />
                    </button>
                    {/* Apply collapsed class based on state */}
                    <div className={`${styles.navGroupChildren} ${!isStudyBoardOpen ? styles.collapsed : ''}`}>
                      {item.children.map((child) => {
                        const isActive = location.pathname === child.path || (child.path !== '/dashboard' && location.pathname.startsWith(child.path));
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.path}
                            to={child.path ?? '#'}
                            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            onClick={onClose} // Close sidebar when child is clicked
                          >
                            <ChildIcon />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                // Fallback for other potential groups (though none exist now)
                return (
                  <div key={idx} className={styles.navGroup}>
                    <Link
                      to={item.path ?? '#'}
                      className={styles.navGroupLabel}
                      onClick={onClose}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </Link>
                    <div className={styles.navGroupChildren}>
                      {item.children.map((child) => {
                        const isActive = location.pathname === child.path || (child.path !== '/dashboard' && location.pathname.startsWith(child.path));
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.path}
                            to={child.path ?? '#'}
                            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            onClick={onClose}
                          >
                            <ChildIcon />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            } else {
              const isActive = item.path ? (location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))) : false;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path ?? idx}
                  to={item.path ?? '#'}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={onClose}
                >
                  <IconComponent />
                  <span>{item.label}</span>
                </Link>
              );
            }
          })}
        </nav>

        <div className={styles.footer} style={{ flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
          <Link
            to="/dashboard/settings"
            className={styles.footerButton}
            onClick={() => { onClose(); toggleSpin(); }}
          >
            <Cog6ToothIcon className={`${styles.footerButtonIcon} ${spinning ? 'spin-on-click' : ''}`} />
          </Link>
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