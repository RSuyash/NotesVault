// notesvault-react-mvp/src/features/home/TestimonialSection.tsx
import React from 'react';
import PlaceholderIcon from '../../components/ui/PlaceholderIcon.js';
import styles from './TestimonialSection.module.css';

const TestimonialSection: React.FC = () => {
  return (
    <section className={styles.testimonialSection}>
      <h2 className={styles.title}>What Students Are Saying</h2>
      <div className={styles.testimonialsContainer}>
        <div className={styles.testimonialCard}>
          {/* Reverted structure: Icon first, then text */}
          <div className={styles.iconContainer} style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
            <PlaceholderIcon iconType="default" className={styles.icon} style={{ color: 'var(--color-primary)' }} />
          </div>
          {/* Removed textContent wrapper */}
          <blockquote className={styles.quote}>
            "NotesVault saved me hours on my history notes! The AI summaries are incredibly helpful."
          </blockquote>
          <p className={styles.attribution}>- Sarah K., University Student</p>
        </div>
        <div className={styles.testimonialCard}>
          {/* Reverted structure: Icon first, then text */}
          <div className={styles.iconContainer} style={{ backgroundColor: '#fffbeb' }}>
             <PlaceholderIcon iconType="default" className={styles.icon} style={{ color: '#f59e0b' }} />
          </div>
          {/* Removed textContent wrapper */}
          <blockquote className={styles.quote}>
            "Being able to generate flashcards automatically is a game-changer for exam prep."
          </blockquote>
          <p className={styles.attribution}>- David L., High School Student</p>
        </div>
        {/* Add more testimonials as needed */}
      </div>
    </section>
  );
};

export default TestimonialSection;