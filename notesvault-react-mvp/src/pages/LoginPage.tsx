import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import styles from './AuthPage.module.css';

// Removed BACKEND_URL constant, assuming API is relative path
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const [error, setError] = useState<string | null>(null); // To display errors

  const handleStandardLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors
    console.log('Submitting Login:', { email }); // Don't log password

    try {
      // Assuming login.php is at /notesvault/api/login.php
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      console.error('Error: VITE_API_BASE_URL is not defined!');
      // Optionally set an error state here to inform the user
      return; // Prevent API call
    }
      const apiUrl = `${baseUrl}/login.php`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Login Success:', data);
        // Handle successful login
        // 1. Store the access token
        localStorage.setItem('authToken', data.access_token);
        console.log('Token stored:', data.access_token); // For debugging

        // 2. TODO: Update global application state if needed (e.g., using Context API or Zustand/Redux)

        // 3. Redirect user to dashboard
        // Assuming your dashboard route is '/dashboard'
        // Make sure this route exists in your App router setup
        navigate('/dashboard');
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
      // Check if the error is the JSON parsing error specifically
      if (err instanceof SyntaxError) {
           setError('Login failed. Received an invalid response from the server.');
      } else {
           setError('Login failed. Could not connect to the server.');
      }
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