import styles from './SimplePage.module.css'; // Use generic simple page style

const ContactPage = () => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <h1 className={styles.title}>Contact Us</h1>
      <div className={styles.content}>
        <p>
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        <p>
          Please reach out to us via email at: <a href="mailto:support@notesvault.example.com">support@notesvault.example.com</a> (Replace with actual email).
        </p>
        <p>
          We typically respond within 24-48 business hours.
        </p>
        {/* Optionally add a contact form later */}
      </div>
    </div>
  );
};

export default ContactPage;