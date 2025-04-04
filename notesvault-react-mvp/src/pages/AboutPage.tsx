import React from 'react';
import styles from './SimplePage.module.css'; // Use generic simple page style

const AboutPage = () => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <h1 className={styles.title}>About NotesVault</h1>
      <div className={styles.content}>
        <h2>Welcome to NotesVault</h2>
        <p>
          At NotesVault, we are dedicated to providing students and learners with high-quality study materials and educational resources. Our mission is to empower individuals with the knowledge they need to succeed academically and professionally. We achieve this by partnering with esteemed university professors, scientists, and highly qualified experts to create accurate, reliable, and tailored content to meet our users’ diverse needs.
        </p>

        <h2>Our Mission</h2>
        <ul>
            <li>To deliver top-tier educational content that enhances learning experiences.</li>
            <li>To make quality education accessible to everyone, everywhere.</li>
            <li>To foster a community of knowledge sharing and academic excellence.</li>
        </ul>


        <h2>Our Team</h2>
        <p>
          Our content is meticulously curated by a team of distinguished university professors and highly qualified individuals who bring their expertise and passion for education to NotesVault. We believe in the power of collaborative learning and strive to create a platform where knowledge is shared, questions are answered, and learners are inspired.
        </p>

        <h2>Why Choose NotesVault?</h2>
         <ul>
            <li><strong>Quality:</strong> Experts create and review our materials to ensure accuracy and relevance.</li>
            <li><strong>Accessibility:</strong> Access our resources anytime, anywhere, on any device.</li>
            <li><strong>Community:</strong> Join a growing community of learners and educators.</li>
        </ul>

      </div>
    </div>
  );
};

export default AboutPage;