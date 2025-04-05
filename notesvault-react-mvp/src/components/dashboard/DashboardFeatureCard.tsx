import React from 'react';
import type { IconType } from '../../components/ui/PlaceholderIcon.js';
import { useNavigate } from 'react-router-dom';
import PlaceholderIcon from '../../components/ui/PlaceholderIcon.js';
import styles from './DashboardFeatureCard.module.css';

interface DashboardFeatureCardProps {
  iconType: IconType;
  title: string;
  description: string;
  link: string;
  backgroundColor: string;
  iconColor: string;
}

const DashboardFeatureCard: React.FC<DashboardFeatureCardProps> = ({
  iconType,
  title,
  description,
  link,
  backgroundColor,
  iconColor,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(link)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(link);
      }}
    >
      <div
        className={styles.iconContainer}
        style={{ backgroundColor: backgroundColor }}
      >
        <PlaceholderIcon iconType={iconType} className={styles.icon} style={{ color: iconColor }} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default DashboardFeatureCard;