import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profileApi'; // Assuming updateProfile handles new fields
import styles from './ProfilePage.module.css';


// TODO: Add API call for password change
// import { changePassword } from '../services/profileApi';

const ProfilePage: React.FC = () => {
  // --- Modal State ---
  // --- State for Profile Info ---
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null); // Store URL

  // Store initial values to detect changes
  const [initialUsername, setInitialUsername] = useState('');
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialProfilePictureUrl, setInitialProfilePictureUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);


  // --- Fetch Initial Profile ---
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setIsLoading(true);
      setInfoError(null);
      setInfoSuccess(null);
      try {
        const data = await getProfile(); // API should return new fields
        if (isMounted) {
          setUsername(data.username || '');
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || '');
          setProfilePictureUrl(data.profile_picture_url || null);

          // Set initial values
          setInitialUsername(data.username || '');
          setInitialFirstName(data.first_name || '');
          setInitialLastName(data.last_name || '');
          setInitialEmail(data.email || '');
          setInitialProfilePictureUrl(data.profile_picture_url || null);
        }
      } catch (err: any) {
        if (isMounted) {
          setInfoError(err.response?.data?.error || 'Failed to load profile. Please try again.');
        }
        console.error("Profile fetch error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchProfile();
    return () => { isMounted = false };
  }, []);

  // --- Handle Profile Info Update ---
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError(null);
    setInfoSuccess(null);

    setIsUpdatingInfo(true);
    try {
      const updatedData = {
          username: username,
          first_name: firstName,
          last_name: lastName,
          email: email,
          profile_picture_url: profilePictureUrl
      };
      const response = await updateProfile(updatedData);
      setInfoSuccess('Profile updated successfully!');
      setInitialFirstName(response.user?.first_name ?? '');
      setInitialLastName(response.user?.last_name ?? '');
      setInitialEmail(response.user?.email ?? '');
      setInitialProfilePictureUrl(response.user?.profile_picture_url ?? null);
    } catch (err: any) {
      setInfoError(err.response?.data?.error || 'Failed to update profile. Please try again.');
      console.error("Profile update error:", err);
    } finally {
      setIsUpdatingInfo(false);
    }
  };


  // --- Change Detection ---
  const infoHasChanges =
    username !== initialUsername ||
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    email !== initialEmail ||
    profilePictureUrl !== initialProfilePictureUrl;

  // --- Render Logic ---
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

      {/* --- Profile Information Section --- */}
      <div className={styles.profileCard}>
        <h2 className={styles.sectionTitle}>Update Information</h2>
        {infoError && <div className={styles.errorMessage}>{infoError}</div>}
        {infoSuccess && <div className={styles.successMessage}>{infoSuccess}</div>}
        <form onSubmit={handleInfoSubmit} className={styles.form}>
          {/* Profile Picture Placeholder */}
          <div className={styles.inputGroup}>
             <label className={styles.label}>Profile Picture</label>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                    src={profilePictureUrl || '/default-avatar.png'} // Use placeholder if no URL
                    alt="Profile"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} // Fallback image
                />
                {/* Basic URL input for now - Replace with file upload later */}
                <input
                    type="text"
                    placeholder="Enter image URL (e.g., https://...)"
                    value={profilePictureUrl || ''}
                    onChange={(e) => setProfilePictureUrl(e.target.value || null)}
                    className={styles.input}
                    disabled={isUpdatingInfo}
                />
             </div>
             <small style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)'}}>Enter URL for profile picture (file upload coming soon).</small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="profile-username" className={styles.label}>Username:</label>
            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingInfo}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="profile-first-name" className={styles.label}>First Name:</label>
            <input
              id="profile-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingInfo}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="profile-last-name" className={styles.label}>Last Name:</label>
            <input
              id="profile-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingInfo}
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
              disabled={isUpdatingInfo}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isUpdatingInfo || !infoHasChanges}
            >
              {isUpdatingInfo ? 'Saving...' : 'Save Info Changes'}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
};

export default ProfilePage;