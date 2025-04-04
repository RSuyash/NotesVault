import styles from './AuthPage.module.css'; // Use a shared auth page style
// Removed GoogleLogin import

// Removed BACKEND_URL constant

const LoginPage = () => {

  // Removed handleGoogleLoginSuccess function
  // Removed handleGoogleLoginError function

  // TODO: Add logic here to handle standard email/password form submission
  // This would typically involve:
  // 1. Getting email/password values from form state.
  // 2. Sending them to a backend endpoint (e.g., POST /api/auth/login).
  // 3. Handling the response (success: store session token, redirect; error: show message).
  const handleStandardLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Standard Login form submitted');
    alert('Standard Login not implemented yet.');
    // Add API call logic here
  };


  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Login</h1>

        {/* Removed Google Login Button and Divider */}

        {/* Email/Password Form */}
        {/* Added onSubmit handler */}
        <form className={styles.form} onSubmit={handleStandardLogin}>
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