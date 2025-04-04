import styles from './AuthPage.module.css'; // Use a shared auth page style
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'; // Import GoogleLogin

// Read backend URL from Vite environment variables
// Ensure you have VITE_BACKEND_URL defined in your .env file(s)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'; // Fallback for safety

const LoginPage = () => {

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google Login Frontend Success:', credentialResponse);

    if (!credentialResponse.credential) {
      console.error('Google Login Error: No credential received from Google.');
      alert('Google Login Failed: Missing credential.');
      return;
    }

    try {
      // Use the BACKEND_URL variable
      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Backend Verification Success:', data);
        // TODO: Handle successful login
        // - Store session token/user info received from backend (if any)
        // - Redirect user to dashboard or appropriate page
        alert(`Login Successful! Welcome ${data.user_info?.name || 'User'}! (Backend Verified)`);
        // Example redirect (requires react-router-dom's useNavigate hook):
        // navigate('/dashboard');
      } else {
        console.error('Backend Verification Failed:', data);
        alert(`Login Failed: ${data.detail || 'Backend verification error.'}`);
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
      alert('Login Failed: Could not connect to backend.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Frontend Failed');
    alert('Google Login Failed. Please try again.');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Login</h1>

        {/* Google Login Button */}
        <div className={styles.googleButtonContainer}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>

        {/* Divider */}
        <div className={styles.divider}>OR</div>

        {/* Email/Password Form */}
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