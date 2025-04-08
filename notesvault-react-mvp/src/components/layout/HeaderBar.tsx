import React, { useState, useEffect } from 'react';
import { getProfile } from '../../services/profileApi';
import styles from './HeaderBar.module.css'; // Import CSS Module

interface HeaderBarProps {
  onToggleSidebar: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profileData = await getProfile();
        if (profileData && profileData.name) {
          setUserName(profileData.name);
        }
      } catch (error) {
        console.error('HeaderBar: Failed to fetch user profile for name', error);
      }
    };
    fetchUserName();
  }, []);

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

         <div className={styles.userMenuContainer}>
           <button className={styles.userMenuButton} aria-label="User menu">
             <div className={styles.avatar}>
               {userName.charAt(0).toUpperCase()}
             </div>
           </button>
           {/* Dropdown menu would go here */}
         </div>
       </div>
    </header>
  );
};

export default HeaderBar;