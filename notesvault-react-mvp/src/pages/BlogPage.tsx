import React from 'react';
import styles from './BlogPage.module.css'; // Import the new CSS module

const BlogPage: React.FC = () => {
  // Placeholder blog post data
  const posts = [
    {
      id: 1,
      title: '5 Ways AI Note-Taking Frees Up Your Study Time',
      teaser: 'Stop spending hours summarizing lectures. Discover how AI can give you back your evenings by automating note organization and key insight extraction...',
      link: '#', // Placeholder link
    },
    {
      id: 2,
      title: 'Beyond Memorization: Unlock Deeper Understanding with Knowledge Graphs',
      teaser: 'See your subject in a whole new way. Learn how visualizing connections with NotesVault\'s knowledge graphs transforms recall into true comprehension...',
      link: '#', // Placeholder link
    },
    {
      id: 3,
      title: 'From Syllabus Shock to Exam Ready: Your AI-Powered Study Plan',
      teaser: 'Overwhelmed by your course outline? NotesVault doesn\'t just organize notes; it helps build a structured learning path, turning chaos into a clear roadmap for success...',
      link: '#', // Placeholder link
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>NotesVault Insights</h1> {/* Updated Title */}
      <div className={styles.postList}>
        {posts.map((post) => (
          <article key={post.id} className={styles.postItem}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postTeaser}>{post.teaser}</p>
            <a href={post.link} className={styles.readMoreLink}>
              Read More...
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;