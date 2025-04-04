import React, { useState } from 'react'; // Import useState
import styles from './AuthPage.module.css';

// Removed BACKEND_URL constant, assuming API is relative path
const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success feedback

  const handleStandardSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) { // Example: Minimum password length
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    console.log('Submitting Signup:', { name, email }); // Don't log passwords

    try {
      // Assuming signup.php is at /api/signup.php relative to the domain root
      const response = await fetch(`/api/signup.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Send name, email, password
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Signup Success:', data);
        setSuccessMessage('Signup successful! You can now log in.');
        // Clear form (optional)
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // TODO: Optionally redirect to login page after a short delay
        // setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle backend errors (e.g., email already exists)
        // PHP script likely returns 'error' field instead of 'detail'
        const errorMessage = data.error || 'Signup failed. Please try again.';
        console.error('Signup Failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      // Handle network errors or other fetch issues
      console.error('Signup Request Error:', err);
      setError('Signup failed. Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Sign Up</h1>

        <form className={styles.form} onSubmit={handleStandardSignup}>
          {/* Display error or success messages */}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>} {/* Add success message style */}

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
           <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;