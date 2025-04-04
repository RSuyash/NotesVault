import { Link } from 'react-router-dom'; // Import Link
import styles from './Footer.module.css'; // Import CSS Module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerContent} container`}> {/* Add container */}
        <p className={styles.copyright}>&copy; {new Date().getFullYear()} NotesVault. All rights reserved.</p>
        <nav className={styles.footerNav}>
          <Link to="/about" className={styles.footerLink}>About</Link>
          <Link to="/contact" className={styles.footerLink}>Contact</Link>
          <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
          <Link to="/copyright" className={styles.footerLink}>Copyright Policy</Link>
          <Link to="/terms" className={styles.footerLink}>Terms of Service</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;