// notesvault-react-mvp/src/features/home/FinalCTASection.tsx
import React from 'react';
import styles from './FinalCTASection.module.css';
// Remove the incorrect Button import

const FinalCTASection: React.FC = () => {
  return (
    <section className={styles.finalCtaSection}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.headline}>Ready to Transform Your Studying?</h2>
        <p className={styles.subheadline}>
          Sign up now and experience the future of note-taking. Get smarter summaries, instant flashcards, and organized knowledge.
        </p>
        {/* Replace Button component with a styled <a> tag */}
        <a
          href="signup" // Link to the signup section or page
          className={styles.ctaButton} // Use the style defined in the CSS module
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor behavior if handling click via JS
            /* Handle Sign Up / Get Started click */
            console.log('Get Started Clicked!');
          }}
        >
          Get Started Free
        </a>
      </div>
    </section>
  );
};

export default FinalCTASection;