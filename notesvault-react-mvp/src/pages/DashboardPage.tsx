import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import {
  BookOpenIcon,
  SparklesIcon,
  UsersIcon,
  TrophyIcon,
  DocumentTextIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const tools = [
  { name: 'Smart Notes', path: '/dashboard/notes', icon: BookOpenIcon },
  { name: 'Flashcards', path: '/dashboard/flashcards', icon: SparklesIcon },
  { name: 'Study Groups', path: '/dashboard/studygroups', icon: UsersIcon },
  { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: TrophyIcon },
  { name: 'MindHack Docs', path: '/dashboard/docs', icon: DocumentTextIcon },
];

const DashboardPage: React.FC = () => {
  const userName = 'User'; // Placeholder, replace with actual user data
  const isProfileComplete = false; // Placeholder, replace with actual profile status

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftColumn}>
        <section className={`${styles.section} ${styles.welcomeCard}`}>
          <h2 className={styles.sectionTitle}>Welcome, {userName}!</h2>
          {!isProfileComplete && (
            <p className={styles.profilePrompt}>
              Please complete your profile to get the best experience.
            </p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityFeed}>
            <p>User A joined 'Physics Study Group'.</p>
            <p>You created 'Chapter 1 Flashcards'.</p>
            <p>New note added: 'Quantum Mechanics Intro'.</p>
          </div>
        </section>
      </div>

      <div className={styles.rightColumn}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tools</h2>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <Link key={tool.path} to={tool.path} className={styles.toolItem}>
                <tool.icon className={styles.toolIcon} aria-hidden="true" />
                <span className={styles.toolName}>{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.publicLinkSection}`}>
          <Link to="/" className={styles.publicLink}>
            <HomeIcon className={styles.publicLinkIcon} aria-hidden="true" />
            <span>Homepage</span>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;