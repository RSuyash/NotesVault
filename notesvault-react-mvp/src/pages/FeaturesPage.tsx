import styles from './FeaturesPage.module.css';
import FeaturesOverviewSection from '../features/home/FeaturesOverviewSection'; // Import the section component
import WhyNotesVaultSection from '../features/features-page/WhyNotesVaultSection';
import FeaturesCTASection from '../features/features-page/FeaturesCTASection';

const FeaturesPage = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>NotesVault Features</h1>

      {/* Add wrapper to control spacing */}
      <div className={styles.featuresSectionWrapper}>
        <FeaturesOverviewSection applySpotlightEffect={false} hideTitle={true} noTopBorder={true} />
      </div>

      <hr className={styles.separator} />
      <WhyNotesVaultSection />
      <hr className={styles.separator} />
      <FeaturesCTASection />

      {/*
        // Old list implementation removed:
        <div className="container">
          <ul className={styles.featureList}>
            {featuresData.map((feature) => (
                <li
                  key={feature.id}
                  className={styles.featureItem}
                >
                  {feature.isComingSoon && (
                    <span className={styles.statusTag}>Coming Soon</span>
                  )}
                  <div className={styles.featureTitleWrapper}>
                     <h2 className={styles.featureTitle}>{feature.title}</h2>
                  </div>
                  <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                </li>
            ))}
          </ul>
        </div>
      */}
    </div>
  );
};

export default FeaturesPage;