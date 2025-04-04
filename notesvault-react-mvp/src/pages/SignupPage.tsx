import styles from './AuthPage.module.css'; // Use shared auth page style
// Removed GoogleLogin import

// Removed BACKEND_URL constant

const SignupPage = () => {

  // Removed handleGoogleLoginSuccess function
  // Removed handleGoogleLoginError function

  // TODO: Add logic here to handle standard sign up form submission
  // This would typically involve:
  // 1. Getting name, email, password values from form state.
  // 2. Sending them to a backend endpoint (e.g., POST /api/auth/signup).
  // 3. Handling the response (success: maybe auto-login/redirect; error: show message).
  const handleStandardSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Standard Signup form submitted');
    alert('Standard Signup not implemented yet.');
    // Add API call logic here
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Sign Up</h1>

        {/* Removed Google Login Button and Divider */}

        {/* Name, Email, Password, Confirm Password Form */}
        {/* Added onSubmit handler */}
        <form className={styles.form} onSubmit={handleStandardSignup}>
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