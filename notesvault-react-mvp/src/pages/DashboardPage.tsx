import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import {
  BookOpenIcon, // For Smart Notes
  SparklesIcon, // For Flashcards (AI)
  UsersIcon, // For Study Groups
  TrophyIcon, // For Leaderboard
  DocumentTextIcon, // For MindHack Docs
  HomeIcon, // For Public Site link
  // Add other icons as needed for Summary/Activity
} from '@heroicons/react/24/outline'; // Using outline icons for consistency

// Define the tools data
const tools = [
  { name: 'Smart Notes', path: '/dashboard/notes', icon: BookOpenIcon, description: 'Intelligent note-taking.' },
  { name: 'Flashcards', path: '/dashboard/flashcards', icon: SparklesIcon, description: 'AI-powered revision.' },
  { name: 'Study Groups', path: '/dashboard/studygroups', icon: UsersIcon, description: 'Collaborate with peers.' },
  { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: TrophyIcon, description: 'Track your progress.' },
  { name: 'MindHack Docs', path: '/dashboard/docs', icon: DocumentTextIcon, description: 'Generate documents.' },
  // Add Study Board if it should be listed as a tool here too?
  // { name: 'Study Board', path: '/dashboard/studyboard', icon: SomeIcon, description: 'Access study materials.' },
];


const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Left Column */}
      <div className={styles.leftColumn}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <div className={styles.summaryCards}>
            {/* Placeholder for Summary Cards */}
            <div className={styles.card}>Recent Notes: 5</div>
            <div className={styles.card}>Flashcards Due: 10</div>
            <div className={styles.card}>Upcoming Sessions: 1</div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityFeed}>
            {/* Placeholder for Activity Feed Items */}
            <p>User A joined 'Physics Study Group'.</p>
            <p>You created 'Chapter 1 Flashcards'.</p>
            <p>New note added: 'Quantum Mechanics Intro'.</p>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div className={styles.rightColumn}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tools</h2>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <Link key={tool.path} to={tool.path} className={styles.toolItem}>
                <tool.icon className={styles.toolIcon} aria-hidden="true" />
                <span className={styles.toolName}>{tool.name}</span>
                {/* Optional: Add description on hover/focus? */}
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.publicLinkSection}`}>
           <Link to="/" className={styles.publicLink}>
             <HomeIcon className={styles.publicLinkIcon} aria-hidden="true" />
             <span>View Public Site</span>
           </Link>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;