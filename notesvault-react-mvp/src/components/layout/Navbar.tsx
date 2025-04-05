

import { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Navbar.module.css';
import { useTheme } from '../../context/ThemeContext.js';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for auth status
  const navigate = useNavigate(); // Hook for navigation

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Check auth status on component mount and potentially on storage change
  // For simplicity, we check on mount. A more robust solution might listen to storage events.
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false); // Update state
    setIsMobileMenuOpen(false); // Close mobile menu if open
    navigate('/login'); // Redirect to login
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Left side: Brand */}
        <div className={styles.navLeft}>
          <Link to="/" className={styles.brandLink} onClick={handleLinkClick}>
            {/* Prepend BASE_URL for correct path in subdirectories */}
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="NotesVault Logo" className={styles.logo} />
            <span className={styles.brandText}>NotesVault</span>
          </Link>
        </div>

        {/* Center: Main navigation links (conditionally displayed/styled) */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link to="/features" className={styles.navLink} onClick={handleLinkClick}>Features</Link>
          <Link to="/pricing" className={styles.navLink} onClick={handleLinkClick}>Pricing</Link>
          <Link to="/blog" className={styles.navLink} onClick={handleLinkClick}>Blog</Link>
          {/* Add other main links here if needed */}
          {/* Mobile only: Show auth links inside the menu */}
          <div className={styles.mobileAuthLinks}>
             {isAuthenticated ? (
               <>
                 <Link to="/dashboard" className={styles.navLink} onClick={handleLinkClick}>Dashboard</Link>
                 <button onClick={handleLogout} className={`${styles.navLink} ${styles.mobileSignupButton}`}>Logout</button>
               </>
             ) : (
               <>
                 <Link to="/login" className={styles.navLink} onClick={handleLinkClick}>Login</Link>
                 <Link to="/signup" className={`${styles.navLink} ${styles.mobileSignupButton}`} onClick={handleLinkClick}>Sign Up</Link>
               </>
             )}
          </div>
        </div>

        {/* Right side: Theme toggle, Desktop Auth links, and Hamburger */}
        <div className={styles.navRight}>
           {/* Auth links visible only on desktop */}
           <div className={styles.desktopAuthLinks}>
             {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
                  <button onClick={handleLogout} className={styles.signupButton}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className={styles.navLink}>Login</Link>
                  <Link to="/signup" className={styles.signupButton}>Sign Up</Link>
                </>
              )}
           </div>
           {/* Theme toggle */}
           <button
             onClick={toggleTheme}
             className={styles.themeToggle}
             aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
           >
             {theme === 'light' ? '🌙' : '☀️'}
           </button>
           {/* Hamburger Button */}
           <button
             className={styles.hamburgerButton}
             onClick={toggleMobileMenu}
             aria-label="Toggle navigation menu"
             aria-expanded={isMobileMenuOpen}
           >
             {/* Simple SVG for hamburger icon */}
             <svg viewBox="0 0 100 80" width="20" height="20" fill="var(--color-text-primary)">
               <rect width="100" height="15" rx="8"></rect>
               <rect y="30" width="100" height="15" rx="8"></rect>
               <rect y="60" width="100" height="15" rx="8"></rect>
             </svg>
             {/* Or use text: &#9776; */}
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;