import styles from './DashboardPage.module.css';
import React from 'react'; // Add React import
import { useNavigate } from 'react-router-dom'; // Add useNavigate import
// Removed feature component imports

const DashboardPage: React.FC = () => { // Add type annotation
  // Add dashboard logic
  const navigate = useNavigate();
  const userName = "User"; // Placeholder

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className={styles.pageContainer}> {/* Keep page container style */}
      {/* Add Dashboard Header */}
      <header className={styles.dashboardHeader}> {/* Add a class for header styling */}
        <h1 className={styles.title}>Welcome, {userName}!</h1> {/* Use existing title style */}
        <div className={styles.buttonGroup}> {/* Add a class for button group styling */}
          <button onClick={handleSettingsClick} className={styles.buttonPrimary}> {/* Add button styles */}
            Settings
          </button>
          <button onClick={handleLogout} className={styles.buttonSecondary}> {/* Add button styles */}
            Logout
          </button>
        </div>
      </header>

      {/* Placeholder for main dashboard content */}
      <div className={styles.dashboardContent}> {/* Add a class for content area */}
        <p>Dashboard content goes here...</p>
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