import styles from './AuthPage.module.css'; // Use shared auth page style
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'; // Import GoogleLogin

// Read backend URL from Vite environment variables
// Ensure you have VITE_BACKEND_URL defined in your .env file(s)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'; // Fallback for safety

const SignupPage = () => {

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('Google Sign Up Frontend Success:', credentialResponse);

    if (!credentialResponse.credential) {
      console.error('Google Sign Up Error: No credential received from Google.');
      alert('Google Sign Up Failed: Missing credential.');
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
        console.log('Backend Verification Success (Sign Up):', data);
        // TODO: Handle successful sign up/login
        // - Store session token/user info received from backend (if any)
        // - Redirect user to dashboard or appropriate page
        alert(`Sign Up Successful! Welcome ${data.user_info?.name || 'User'}! (Backend Verified)`);
        // Example redirect (requires react-router-dom's useNavigate hook):
        // navigate('/dashboard');
      } else {
        console.error('Backend Verification Failed (Sign Up):', data);
        alert(`Sign Up Failed: ${data.detail || 'Backend verification error.'}`);
      }
    } catch (error) {
      console.error('Error sending token to backend (Sign Up):', error);
      alert('Sign Up Failed: Could not connect to backend.');
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google Sign Up Frontend Failed');
    alert('Google Sign Up Failed. Please try again.');
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Sign Up</h1>

        {/* Google Login Button */}
        <div className={styles.googleButtonContainer}>
           <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>

        {/* Divider */}
        <div className={styles.divider}>OR</div>

        {/* Name, Email, Password, Confirm Password Form */}
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