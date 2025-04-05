import { useRef } from 'react'; // Removed useState, useEffect
import styles from './HeroSection.module.css';
import { useMousePositionEffect } from '../../hooks/useMousePositionEffect.js'; // Import the custom hook

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null); // Ref for the section element
  useMousePositionEffect(heroRef); // Apply the effect using the hook

  // No need for dynamicStyles state management here anymore

  return (
    // Pass the ref to the section
    <section
      ref={heroRef}
      className={styles.heroSection}
      // No inline style needed as the hook sets custom properties directly
    >
      {/* Remove the generic container, flexbox handles centering */}
      <div className={styles.heroContent}> {/* Add specific content wrapper */}
        {/* Existing content... */}
        <h2
          className={`${styles.title} ${styles.animatedItem}`}
          style={{ animationName: styles.fadeInUp, animationDelay: '0.1s' }}
        >
          Stop Drowning in Notes. Start Understanding Faster with AI.
        </h2>
        <p
          className={`${styles.subtitle} ${styles.animatedItem}`}
          style={{ animationName: styles.fadeInUp, animationDelay: '0.3s' }}
        >
          NotesVault transforms your syllabus or topics into clear, concise, AI-generated notes, freeing up hours so you can focus on what truly matters - learning.
        </p>
        <div
          className={`${styles.ctaContainer} ${styles.animatedItem}`}
          style={{ animationName: styles.fadeInUp, animationDelay: '0.5s' }}
      >
        <a href="signup" className={styles.primaryButton}>
          Get Started Free
        </a>
        <a href="login" className={styles.secondaryButton}>
            Login
          </a>
        </div>
        {/* Spotlight pseudo-element will be added via CSS */}
      </div> {/* Close heroContent */}
    </section>
  );
};

export default HeroSection;