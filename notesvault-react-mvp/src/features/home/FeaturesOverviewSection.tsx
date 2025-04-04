import React, { useRef } from 'react';
import PlaceholderIcon from '../../components/ui/PlaceholderIcon';
import styles from './FeaturesOverviewSection.module.css';
import { useMousePositionEffect } from '../../hooks/useMousePositionEffect';

// Define props for the component
interface FeaturesOverviewProps {
  applySpotlightEffect?: boolean;
  hideTitle?: boolean;
  noTopBorder?: boolean; // New prop to control top border
}

const FeaturesOverviewSection: React.FC<FeaturesOverviewProps> = ({
  applySpotlightEffect = false,
  hideTitle = false,
  noTopBorder = false // Default to having the border
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  if (applySpotlightEffect) {
     // eslint-disable-next-line react-hooks/rules-of-hooks
     useMousePositionEffect(sectionRef);
  }

  // Determine section classes based on props
  const sectionClasses = [
    styles.featuresOverviewSection,
    noTopBorder ? styles.noTopBorder : '', // Conditionally add class
  ].filter(Boolean).join(' ');

  return (
    <section ref={applySpotlightEffect ? sectionRef : undefined} className={sectionClasses}>
      <div className="container">
        {/* Conditionally render the title */}
        {!hideTitle && (
            <h3 className={styles.title}>Your AI-Powered Study Toolkit</h3>
        )}
        <div className={styles.grid}>

          {/* Item 1: AI Document Generation */}
          <div className={styles.gridItem}>
            {/* Reverted structure: Icon first, then text */}
            <div className={styles.iconContainer} style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
              <PlaceholderIcon iconType="brain" className={styles.icon} style={{ color: 'var(--color-primary)' }} />
            </div>
            {/* Removed textContent wrapper */}
            <div className={styles.itemTitleWrapper}>
                <h4 className={styles.itemTitle}>AI Note Generation</h4>
            </div>
            <p className={styles.itemText}>Get clear, concise notes generated instantly from complex topics or lengthy syllabi. Save time, gain clarity.</p>
          </div>

          {/* Item 2: Knowledge Graph */}
          <div className={styles.gridItem}>
            {/* Reverted structure: Icon first, then text */}
             <span className={styles.statusTag}>Coming Soon</span>
            <div className={styles.iconContainer} style={{ backgroundColor: '#fffbeb' }}>
              <PlaceholderIcon iconType="graph" className={styles.icon} style={{ color: '#f59e0b' }} />
            </div>
            {/* Removed textContent wrapper */}
            <div className={styles.itemTitleWrapper}>
                <h4 className={styles.itemTitle}>Knowledge Graph</h4>
            </div>
            <p className={styles.itemText}>See the connections between ideas. Navigate complex subjects visually and grasp relationships effortlessly.</p>
          </div>

          {/* Item 3: Flash Cards */}
          <div className={styles.gridItem}>
            {/* Reverted structure: Icon first, then text */}
            <span className={styles.statusTag}>Coming Soon</span>
             <div className={styles.iconContainer} style={{ backgroundColor: '#fdf2f8' }}>
              <PlaceholderIcon iconType="cards" className={styles.icon} style={{ color: '#ec4899' }} />
            </div>
            {/* Removed textContent wrapper */}
            <div className={styles.itemTitleWrapper}>
                <h4 className={styles.itemTitle}>Automatic Flash Cards</h4>
            </div>
            <p className={styles.itemText}>Master key concepts with ease. Turn your notes into interactive flashcards for effortless revision anytime, anywhere.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesOverviewSection;