import React from 'react';
import styles from './WhyNotesVaultSection.module.css';
import PlaceholderIcon from '../../components/ui/PlaceholderIcon';

const WhyNotesVaultSection: React.FC = () => {
  return (
    <section className={styles.whyNotesVaultSection}>
      <h2 className={styles.title}>More Than Just Notes</h2>
      <div className={styles.pointsContainer}>
        <div className={styles.point}>
          {/* Reverted structure: Icon first, then text */}
          <div className={styles.iconContainer} style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
            <PlaceholderIcon iconType="brain" className={styles.icon} style={{ color: 'var(--color-primary)' }} />
          </div>
          {/* Removed textContent wrapper */}
          <h3>Syllabus-Specific Intelligence</h3>
          <p>Unlike generic AI, NotesVault understands your course structure, providing relevant insights and study materials.</p>
        </div>
        <div className={styles.point}>
          {/* Reverted structure: Icon first, then text */}
          <div className={styles.iconContainer} style={{ backgroundColor: '#eef2ff' }}> {/* Indigo lighter */}
            <PlaceholderIcon iconType="folder" className={styles.icon} style={{ color: '#6366f1' }} /> {/* Indigo */}
          </div>
          {/* Removed textContent wrapper */}
          <h3>Integrated Study Tools</h3>
          <p>Stop juggling apps. Flashcards, summaries, and quizzes are built-in, generated directly from your notes.</p>
        </div>
        <div className={styles.point}>
          {/* Reverted structure: Icon first, then text */}
          <div className={styles.iconContainer} style={{ backgroundColor: '#ecfdf5' }}> {/* Green lighter */}
            <PlaceholderIcon iconType="time" className={styles.icon} style={{ color: '#22c55e' }} /> {/* Green */}
          </div>
          {/* Removed textContent wrapper */}
          <h3>Built for Academic Success</h3>
          <p>NotesVault is designed with students in mind, focusing on features that directly improve learning and retention.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyNotesVaultSection;