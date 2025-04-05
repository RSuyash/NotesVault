import React from 'react';
import PlaceholderIcon, { type IconType } from '../../components/ui/PlaceholderIcon.js';

// Define the structure for a single feature
interface Feature {
  id: string;
  title: string;
  description: string;
  iconType: IconType; // Use IconType from PlaceholderIcon
  iconBgColorClass: string;
  iconColorClass: string;
  status?: string | null; // Optional status
}

// Define props for the FeatureItem component
interface FeatureItemProps {
  feature: Feature;
  styles: { [key: string]: string }; // CSS Module styles object
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, styles }) => {
  return (
    <div className={styles.gridItem}>
      {feature.status && <span className={styles.statusTag}>{feature.status}</span>}
      <div className={`${styles.iconContainer} ${styles[feature.iconBgColorClass]}`}>
        <PlaceholderIcon iconType={feature.iconType} className={`${styles.icon} ${styles[feature.iconColorClass]}`} />
      </div>
      <div className={styles.itemTitleWrapper}>
        <h4 className={styles.itemTitle}>{feature.title}</h4>
      </div>
      <p className={styles.itemText}>{feature.description}</p>
    </div>
  );
};

export default FeatureItem;
export type { Feature }; // Export the Feature type if needed elsewhere