import styles from './DashboardPage.module.css';
import DashboardFeatureCard from '../components/dashboard/DashboardFeatureCard';
// Removed feature component imports
import React, { useState, useEffect } from 'react';

const DashboardPage: React.FC = () => {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('https://notesvault.in/api/user.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const username = data.username || data.name || 'User';
          setUserName(username);
          localStorage.setItem('username', username);
        } else {
          console.warn('Failed to fetch user profile:', data.error);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

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