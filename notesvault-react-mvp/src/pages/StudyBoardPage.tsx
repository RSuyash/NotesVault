import React from 'react';
import styles from './StudyBoardPage.module.css';

const StudyBoardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Study Board</h1>
      <p className={styles.subtitle}>Your personalized educational hub</p>
      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>Upcoming Lessons</h2>
          <p>Track your scheduled classes and assignments here.</p>
        </div>
        <div className={styles.section}>
          <h2>Notes & Resources</h2>
          <p>Access your saved notes, documents, and study materials.</p>
        </div>
        <div className={styles.section}>
          <h2>Progress & Goals</h2>
          <p>Visualize your learning progress and set new goals.</p>
        </div>
        <div className={styles.section}>
          <h2>Community</h2>
          <p>Connect with peers, join study groups, and collaborate.</p>
        </div>
      </div>
    </div>
  );
};

export default StudyBoardPage;