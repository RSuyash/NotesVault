import React from 'react';
import styles from './PricingPage.module.css'; // Import the CSS module
import { Link } from 'react-router-dom'; // Assuming React Router for navigation

interface PricingTier {
  id: string;
  title: string;
  price: string;
  priceValue?: string; // For actual price display if needed later
  isFreeTier?: boolean;
  isPlaceholder?: boolean;
  features: string[];
  ctaText: string;
  ctaLink: string;
  highlight?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    title: 'Basic',
    price: 'Free',
    isFreeTier: true,
    features: [
      'AI Note Generation (up to 5 topics/day)',
      'Basic Note Organization',
      'Standard Search',
      'Markdown Support',
    ],
    ctaText: 'Get Started Free',
    ctaLink: '/signup',
    highlight: true,
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '₹XXX/mo', // Placeholder price
    isPlaceholder: true,
    features: [
      'Unlimited AI Note Generation',
      'Advanced Note Organization (Tags, Folders)',
      'Knowledge Graph Access (Beta)',
      'Priority Support',
    ],
    ctaText: 'Get Started Free', // Changed from Notify Me
    ctaLink: '/signup', // Link to signup as it's free now
  },
  {
    id: 'premium',
    title: 'Premium',
    price: '₹YYY/mo', // Placeholder price
    isPlaceholder: true,
    features: [
      'All Pro Features',
      'AI-Powered Flashcards',
      'Collaboration Features (Team Spaces)',
      'Advanced Export Options (PDF, DOCX)',
      'Early Access to New Features',
    ],
    ctaText: 'Get Started Free', // Changed from Notify Me
    ctaLink: '/signup', // Link to signup as it's free now
  },
];

const PricingPage: React.FC = () => {

  return (
    <div className={styles.pricingPageContainer}>
      <h1 className={styles.title}>Pricing Plans</h1>
      <p className={styles.subtitle}>
        Explore our features during the beta phase. All tiers are currently free!
      </p>

      <div className={styles.pricingGrid}>
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={`${styles.pricingCard} ${tier.highlight ? styles.highlight : ''}`}
          >
            <div> {/* Wrap content to allow button positioning */}
              <h2 className={styles.tierTitle}>{tier.title}</h2>
              <div className={styles.priceContainer}>
                {tier.isPlaceholder ? (
                  <>
                    <span className={`${styles.priceValue} ${styles.strikethrough}`}>
                      {tier.price}
                    </span>
                    <span className={styles.freeTag}>Currently Free!</span>
                  </>
                ) : (
                  <p className={`${styles.priceValue} ${styles.price}`}>
                    {tier.price}
                  </p>
                )}
              </div>
              <ul className={styles.featuresList}>
                {tier.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Controls at the bottom */}
            <div className={styles.cardControls}>
               <Link to={tier.ctaLink} className={styles.ctaButton}>
                 {tier.ctaText}
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;