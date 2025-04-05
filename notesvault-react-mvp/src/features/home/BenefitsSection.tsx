import { useRef } from 'react'; // Import useRef
import PlaceholderIcon from '../../components/ui/PlaceholderIcon.js';
import styles from './BenefitsSection.module.css';
import { useMousePositionEffect } from '../../hooks/useMousePositionEffect.js'; // Import hook

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLElement>(null); // Create ref
  useMousePositionEffect(sectionRef); // Apply hook
  return (
    <section ref={sectionRef} className={styles.benefitsSection}> {/* Add ref */}
      <div className="container"> {/* Add inner container */}
        <h3 className={styles.title}>Why Choose NotesVault?</h3>
        <div className={styles.grid}>
          {/* Item 1: Save Time */}
          <div className={styles.gridItem}>
            <div className={styles.iconContainer} style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
              <PlaceholderIcon iconType="time" className={styles.icon} style={{ color: 'var(--color-primary)' }} /> {/* Time icon */}
            </div>
            <h4 className={styles.itemTitle}>Save Precious Time</h4>
            <p className={styles.itemText}>Stop tedious note-taking. Let our AI handle the heavy lifting, generating comprehensive notes in minutes.</p>
          </div>
          {/* Item 2: Understand Better */}
          <div className={styles.gridItem}>
             <div className={styles.iconContainer} style={{ backgroundColor: '#fffbeb' }}> {/* Consistent Light Yellow BG */}
              <PlaceholderIcon iconType="brain" className={styles.icon} style={{ color: '#f59e0b' }} /> {/* Brain icon */}
            </div>
            <h4 className={styles.itemTitle}>Deepen Understanding</h4>
            <p className={styles.itemText}>Focus on core concepts. Our structured notes help you grasp complex topics more effectively.</p>
          </div>
          {/* Item 3: Organize Effortlessly */}
          <div className={styles.gridItem}>
             <div className={styles.iconContainer} style={{ backgroundColor: '#ecfdf5' }}> {/* Light Green BG */}
              <PlaceholderIcon iconType="folder" className={styles.icon} style={{ color: '#10b981' }} /> {/* Folder icon */}
            </div>
            <h4 className={styles.itemTitle}>Stay Organized</h4>
            <p className={styles.itemText}>Keep all your subject notes neatly structured and easily accessible in one place.</p>
          </div>
        </div>
      </div> {/* Close inner container */}
    </section>
  );
};

export default BenefitsSection;