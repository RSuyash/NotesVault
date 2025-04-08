import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profileApi';
import styles from './ProfilePage.module.css'; // Import CSS Module

const ProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [initialEmail, setInitialEmail] = useState(''); // Store initial email for comparison
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const data = await getProfile();
        if (isMounted) {
          setName(data.name);
          setEmail(data.email);
          setInitialEmail(data.email); // Store initial email
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.error || 'Failed to load profile. Please try again.');
        }
        console.error("Profile fetch error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchProfile();
    return () => { isMounted = false }; // Cleanup function
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUpdating(true);

    // Basic validation
    if (!name.trim() || !email.trim()) {
        setError('Name and email cannot be empty.');
        setIsUpdating(false);
        return;
    }
    // Optional: Add more robust email validation if needed

    try {
      await updateProfile({ name, email });
      setSuccess('Profile updated successfully!');
      setInitialEmail(email); // Update initial email on successful save
      // Optionally re-fetch profile to confirm, but usually not needed if API confirms success
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
      console.error("Profile update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Determine if form has changes
  const hasChanges = name !== '' && (email !== initialEmail || name !== ''); // Check against initial state

  if (isLoading) {
      return (
          <div className={styles.pageContainer}>
              <h1 className={styles.pageTitle}>My Profile</h1>
              <div className={styles.loadingMessage}>Loading profile...</div>
          </div>
      );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>My Profile</h1>

      {/* Display general error messages */}
      {error && !isUpdating && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <div className={styles.profileCard}>
        <h2 className={styles.sectionTitle}>Update Information</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="profile-name" className={styles.label}>Name:</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdating}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="profile-email" className={styles.label}>Email:</label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdating}
            />
             {/* Optional: Add note if email change requires verification */}
          </div>

          {/* Display update-specific errors */}
          {error && isUpdating && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isUpdating || !hasChanges} // Disable if updating or no changes
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Add other profile sections here later (e.g., Change Password, Profile Picture) */}

    </div>
  );
};

export default ProfilePage;