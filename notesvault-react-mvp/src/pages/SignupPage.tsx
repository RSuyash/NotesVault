import styles from './AuthPage.module.css'; // Use shared auth page style

const SignupPage = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Sign Up</h1>
        <form className={styles.form}>
           <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input type="text" id="name" name="name" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="password" id="password" name="password" required className={styles.input} />
          </div>
           <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required className={styles.input} />
          </div>
          <button type="submit" className={styles.submitButton}>Sign Up</button>
        </form>
        <p className={styles.switchLink}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;