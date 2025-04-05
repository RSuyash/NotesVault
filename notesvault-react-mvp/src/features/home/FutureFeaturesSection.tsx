import PlaceholderIcon from '../../components/ui/PlaceholderIcon.js';
import styles from './FutureFeaturesSection.module.css'; // Import CSS Module

const FutureFeaturesSection = () => {
  return (
    <section className={styles.futureFeaturesSection}> {/* Use imported style */}
      <h3 className={styles.title}>Coming Soon...</h3> {/* Use imported style */}
      <div className={styles.grid}> {/* Use imported style */}
        {/* Item 1 */}
        <div className={styles.gridItem}> {/* Use imported style */}
          <PlaceholderIcon className={styles.icon} style={{ color: '#f59e0b' }} /> {/* Yellow/Amber */}
          <h4 className={styles.itemTitle}>Knowledge Graph</h4> {/* Use imported style */}
          <p className={styles.itemText}>Visualize connections between concepts in your notes, just like Obsidian.</p> {/* Use imported style */}
        </div>
        {/* Item 2 */}
        <div className={styles.gridItem}> {/* Use imported style */}
          <PlaceholderIcon className={styles.icon} style={{ color: '#ec4899' }} /> {/* Pink */}
          <h4 className={styles.itemTitle}>Flash Card Generation</h4> {/* Use imported style */}
          <p className={styles.itemText}>Automatically create flashcards from your notes to supercharge your revision.</p> {/* Use imported style */}
        </div>
      </div>
    </section>
  );
};

export default FutureFeaturesSection;