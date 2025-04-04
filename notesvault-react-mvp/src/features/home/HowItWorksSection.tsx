import React from 'react';
import PlaceholderIcon from '../../components/ui/PlaceholderIcon';
import styles from './HowItWorksSection.module.css';

const HowItWorksSection = () => {
  return (
    <section className={styles.howItWorksSection}>
      <h3 className={styles.title}>How It Works</h3>
      <div className={styles.grid}>
        {/* Item 1 */}
        <div className={styles.gridItem}>
          <div className={styles.iconContainer} style={{ backgroundColor: '#ebf8ff' }}> {/* Light Blue BG */}
            <PlaceholderIcon className={styles.icon} style={{ color: '#3b82f6' }} /> {/* Blue Icon */}
          </div>
          <h4 className={styles.itemTitle}>1. Provide Input</h4>
          <p className={styles.itemText}>Enter a specific topic or upload your course syllabus (PDF upload coming soon!).</p>
        </div>
        {/* Item 2 */}
        <div className={styles.gridItem}>
           <div className={styles.iconContainer} style={{ backgroundColor: '#f5f3ff' }}> {/* Light Purple BG */}
            <PlaceholderIcon className={styles.icon} style={{ color: '#8b5cf6' }} /> {/* Purple Icon */}
          </div>
          <h4 className={styles.itemTitle}>2. AI Generates Notes</h4>
          <p className={styles.itemText}>Our AI analyzes the input and generates detailed, structured notes in Markdown format.</p>
        </div>
        {/* Item 3 */}
        <div className={styles.gridItem}>
           <div className={styles.iconContainer} style={{ backgroundColor: '#ecfdf5' }}> {/* Light Green BG */}
            <PlaceholderIcon className={styles.icon} style={{ color: '#10b981' }} /> {/* Green Icon */}
          </div>
          <h4 className={styles.itemTitle}>3. Study Smarter</h4>
          <p className={styles.itemText}>Access your organized notes, ready for review, export, or integration with tools like Obsidian.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;