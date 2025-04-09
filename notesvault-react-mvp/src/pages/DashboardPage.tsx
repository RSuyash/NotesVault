import React, { useEffect, useState } from 'react';
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

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_path: string | null;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user.php', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const missingFields: string[] = [];
  if (user) {
    if (!user.first_name || !user.last_name) missingFields.push('Complete your name');
    if (!user.profile_picture_path) missingFields.push('Upload a profile picture');
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftColumn}>
        <section className={`${styles.section} ${styles.welcomeCard}`}>
          <h2 className={styles.sectionTitle}>
            {loading
              ? 'Loading...'
              : `Welcome, ${user ? user.first_name + ' ' + user.last_name : 'User'}!`}
          </h2>
          {!loading && missingFields.length > 0 && (
            <div className={styles.profileNotifications}>
              {missingFields.map((msg, idx) => (
                <div key={idx} className={styles.profileNote}>
                  {msg}
                </div>
              ))}
            </div>
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