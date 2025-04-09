import React, { useState, useEffect, useRef } from 'react';
// Removed unused Link import
import { getProfile } from '../../services/profileApi';
import styles from './HeaderBar.module.css'; // Import CSS Module
import UserMenuDropdown from './UserMenuDropdown'; // Import the new dropdown

interface HeaderBarProps {
  onToggleSidebar: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState('User');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null); // Ref for click outside detection

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profileData = await getProfile();
        if (profileData) {
          const fullName = `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim();
          setUserName(fullName || 'User');
        }
      } catch (error) {
        console.error('HeaderBar: Failed to fetch user profile for name', error);
      }
    };
    fetchUserName();
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);
  return (
    <header className={styles.header}>
      {/* Left side */}
      <div className={styles.leftSection}>
        <button
          onClick={onToggleSidebar}
          className={styles.toggleButton}
          aria-label="Toggle sidebar"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Right side */}
      <div className={styles.rightSection}>
         <span className={styles.welcomeMessage}>
           Welcome, <span>{userName}</span>!
         </span>

         <button className={styles.iconButton} aria-label="Notifications">
           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
         </button>

         <div className={styles.userMenuContainer} ref={userMenuRef}>
           <button onClick={toggleUserMenu} className={styles.userMenuButton} aria-label="User menu">
             <div className={styles.avatar}>
               {userName.charAt(0).toUpperCase()}
             </div>
           </button>
           <UserMenuDropdown isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
         </div>
       </div>
    </header>
  );
};

export default HeaderBar;