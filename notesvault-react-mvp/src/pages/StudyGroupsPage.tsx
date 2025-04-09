import React from 'react';
import styles from './StudyGroupsPage.module.css';

const StudyGroupsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Study Groups</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>Create</button>
        <button className={styles.button}>Join</button>
      </div>
    </div>
  );
};

export default StudyGroupsPage;