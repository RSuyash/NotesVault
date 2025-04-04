import React, { useRef } from 'react'; // Import useRef
import PlaceholderIcon from '../../components/ui/PlaceholderIcon';
import styles from './ExploreFeaturesSection.module.css';
import { useMousePositionEffect } from '../../hooks/useMousePositionEffect'; // Import hook

const ExploreFeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null); // Create ref
  useMousePositionEffect(sectionRef); // Apply hook
  return (
    <section ref={sectionRef} className={styles.exploreFeaturesSection}> {/* Add ref */}
       <div className="container"> {/* Add inner container */}
        <h3 className={styles.title}>Go Beyond Simple Notes</h3>
        <div className={styles.grid}>
          {/* Item 1: Knowledge Graph */}
          <div className={styles.gridItem}>
            <div className={styles.iconContainer} style={{ backgroundColor: '#fffbeb' }}> {/* Lighter Yellow BG */}
              <PlaceholderIcon iconType="graph" className={styles.icon} style={{ color: '#f59e0b' }} /> {/* Graph icon */}
            </div>
            <h4 className={styles.itemTitle}>Visualize Connections</h4>
            <p className={styles.itemText}>Discover hidden relationships between topics with our upcoming Knowledge Graph feature.</p>
          </div>
          {/* Item 2: Flash Cards */}
          <div className={styles.gridItem}>
             <div className={styles.iconContainer} style={{ backgroundColor: '#fdf2f8' }}> {/* Lighter Pink BG */}
              <PlaceholderIcon iconType="cards" className={styles.icon} style={{ color: '#ec4899' }} /> {/* Cards icon */}
            </div>
            <h4 className={styles.itemTitle}>Ace Your Exams</h4>
            <p className={styles.itemText}>Reinforce learning effortlessly with automatically generated Flash Cards (coming soon!).</p>
          </div>
        </div>
      </div> {/* Close inner container */}
    </section>
  );
};

export default ExploreFeaturesSection;