import styles from './DashboardPage.module.css';
import DashboardFeatureCard from '../components/dashboard/DashboardFeatureCard';
import { getProfile } from '../services/profileApi'; // Import session-based profile fetch
import React, { useState, useEffect } from 'react';

const DashboardPage: React.FC = () => {
  const [userName, setUserName] = useState('User');

  // Fetch user profile using session-based API
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profileData = await getProfile(); // Uses session cookie via profileApi
        if (profileData && profileData.name) {
          setUserName(profileData.name);
          // Optionally store username in localStorage if needed elsewhere, but not required for auth
          // localStorage.setItem('username', profileData.name);
        }
      } catch (error) {
        console.error('Dashboard: Failed to fetch user profile for name', error);
        // Keep default 'User' name on error
      }
    };

    fetchUserName();
  }, []); // Empty dependency array means run once on mount

  return (
    <div className={styles.pageContainer}> {/* Keep page container style */}
      {/* Add Dashboard Header */}
      <header className={styles.dashboardHeader}>
        <button className={styles.menuButton} aria-label="Toggle sidebar">
          &#9776;
        </button>
        <h1 className={styles.title}>Welcome, {userName}!</h1>
        <button className={styles.createButton}>
          + New
        </button>
      </header>

      {/* Placeholder for main dashboard content */}
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardGrid}>
          <DashboardFeatureCard
            iconType="brain"
            title="Smart Notes"
            description="Create, organize, and access your intelligent notes."
            link="/notes"
            backgroundColor="var(--color-primary-lighter)"
            iconColor="var(--color-primary)"
          />
          <DashboardFeatureCard
            iconType="cards"
            title="Flashcards"
            description="Revise faster with AI-generated flashcards."
            link="/flashcards"
            backgroundColor="#ecfdf5"
            iconColor="#22c55e"
          />
          <DashboardFeatureCard
            iconType="folder"
            title="Study Groups"
            description="Collaborate and learn with peers."
            link="/studygroups"
            backgroundColor="#eef2ff"
            iconColor="#6366f1"
          />
          <DashboardFeatureCard
            iconType="graph"
            title="Leaderboard"
            description="Track your progress and compete."
            link="/leaderboard"
            backgroundColor="#fef9c3"
            iconColor="#eab308"
          />
          <DashboardFeatureCard
            iconType="time"
            title="MindHack Docs"
            description="Generate powerful documents effortlessly."
            link="/docs"
            backgroundColor="#ffe4e6"
            iconColor="#db2777"
          />
        </div>
      </div>

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

export default DashboardPage;