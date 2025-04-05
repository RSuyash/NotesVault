import React, { useState } from 'react'; // Import useState
import styles from './AuthPage.module.css';

// Removed BACKEND_URL constant, assuming API is relative path
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // To display errors

  const handleStandardLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    console.log('Submitting Login:', { email }); // Don't log password

    try {
      // Assuming login.php is at /notesvault/api/login.php
      const response = await fetch(`/notesvault/api/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Login Success:', data);
        // TODO: Handle successful login
        // 1. Store the access token (data.access_token) securely (e.g., localStorage, context)
        // 2. Update application state to reflect logged-in status
        // 3. Redirect user to dashboard (e.g., using useNavigate from react-router-dom)
        alert(`Login Successful (Placeholder)! Token: ${data.access_token}`);
        // Example: localStorage.setItem('authToken', data.access_token);
        // Example: navigate('/dashboard');
      } else {
        // Handle backend errors (e.g., incorrect password, user not found)
        // PHP script likely returns 'error' field instead of 'detail'
        const errorMessage = data.error || 'Login failed. Please check your credentials.';
        console.error('Login Failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      // Handle network errors or other fetch issues
      console.error('Login Request Error:', err);
      setError('Login failed. Could not connect to the server.');
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Login</h1>

        <form className={styles.form} onSubmit={handleStandardLogin}>
          {/* Display error message if present */}
          {error && <p className={styles.errorMessage}>{error}</p>}

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
              disabled={isLoading} // Disable input while loading
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
              disabled={isLoading} // Disable input while loading
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;