import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import styles from './Navbar.module.css';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Get theme state and toggle function

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Wrapper for left-aligned items */}
        <div className={styles.navLeft}>
          <Link to="/" className={styles.brandLink}>
            {/* Add logo image */}
            <img src="/logo.png" alt="NotesVault Logo" className={styles.logo} />
            <span className={styles.brandText}>NotesVault</span> {/* Wrap text for styling */}
          </Link>
          <div className={styles.navLinks}>
            <Link to="/features" className={styles.navLink}>Features</Link>
            {/* Add About/Contact later if desired */}
          </div>
          {/* Separate div for Auth links */}
          <div className={styles.authLinks}>
             <Link to="/login" className={styles.navLink}>Login</Link>
             <Link to="/signup" className={styles.signupButton}>Sign Up</Link> {/* Style differently */}
          </div>
        </div>

        {/* Theme Toggle Button (keep to the right) */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle} // Add a specific class for styling
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {/* Simple text/emoji toggle for now, can use icons later */}
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;