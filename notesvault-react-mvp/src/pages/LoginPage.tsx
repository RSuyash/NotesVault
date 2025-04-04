import styles from './AuthPage.module.css'; // Use a shared auth page style

const LoginPage = () => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Login</h1>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email" id="email" name="email" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input type="password" id="password" name="password" required className={styles.input} />
          </div>
          <button type="submit" className={styles.submitButton}>Login</button>
        </form>
        <p className={styles.switchLink}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;