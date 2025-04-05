import React, { useRef } from 'react';

import styles from './FeaturesOverviewSection.module.css';
import { useMousePositionEffect } from '../../hooks/useMousePositionEffect.js'; // Added .js extension
import FeatureItem, { type Feature } from './FeatureItem.js'; // Import FeatureItem and Feature type

// Define props for the component
interface FeaturesOverviewProps {
  applySpotlightEffect?: boolean;
  hideTitle?: boolean;
  noTopBorder?: boolean; // New prop to control top border
}
// Define the feature data structure
const featuresData: Feature[] = [
  {
    id: 'notes',
    title: 'AI Note Generation',
    description: 'Get clear, concise notes generated instantly from complex topics or lengthy syllabi. Save time, gain clarity.',
    iconType: 'brain',
    iconBgColorClass: 'iconContainerNotes',
    iconColorClass: 'iconNotes',
    status: null,
  },
  {
    id: 'graph',
    title: 'Knowledge Graph',
    description: 'See the connections between ideas. Navigate complex subjects visually and grasp relationships effortlessly.',
    iconType: 'graph',
    iconBgColorClass: 'iconContainerGraph',
    iconColorClass: 'iconGraph',
    status: 'Coming Soon',
  },
  {
    id: 'cards',
    title: 'Automatic Flash Cards',
    description: 'Master key concepts with ease. Turn your notes into interactive flashcards for effortless revision anytime, anywhere.',
    iconType: 'cards',
    iconBgColorClass: 'iconContainerCards',
    iconColorClass: 'iconCards',
    status: 'Coming Soon',
  },
];


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

          {/* Map over featuresData to render FeatureItem components */}
          {featuresData.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} styles={styles} />
          ))}

        </div>
      </div>
    </section>
  );
};

export default FeaturesOverviewSection;