import React from 'react';
import styles from './FeaturesCTASection.module.css';

const FeaturesCTASection: React.FC = () => {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.headline}>Ready to Experience Smarter Studying?</h2>
      <p className={styles.subHeadline}>Unlock your academic potential with NotesVault's intelligent features.</p>
      <a href="signup" className={styles.primaryButton}> {/* Use appropriate link and styling */}
        Get Started Free
      </a>
    </section>
  );
};

export default FeaturesCTASection;