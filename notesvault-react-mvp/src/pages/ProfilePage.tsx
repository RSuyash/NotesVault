import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profileApi'; // Assuming updateProfile handles new fields
import styles from './ProfilePage.module.css';
import ConfirmModal from '../components/ui/ConfirmModal';


// TODO: Add API call for password change
// import { changePassword } from '../services/profileApi';

const ProfilePage: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => () => {});
  // --- Modal State ---
  // --- State for Profile Info ---
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null); // Store URL/path from DB
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store selected file object
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Store local preview URL

  // Store initial values to detect changes
  const [initialUsername, setInitialUsername] = useState('');
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  // const [initialProfilePictureUrl, setInitialProfilePictureUrl] = useState<string | null>(null); // No longer needed for change detection

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
          // Construct full URL if path is relative and base URL is known
          const baseUrl = import.meta.env.VITE_API_BASE_URL || ''; // Assuming API base URL is where uploads are served
          const picturePath = data.profile_picture_path || null; // Use the new path field
          setProfilePictureUrl(picturePath ? `${baseUrl}/${picturePath}` : null);

          // Set initial values
          setInitialUsername(data.username || '');
          setInitialFirstName(data.first_name || '');
          setInitialLastName(data.last_name || '');
          setInitialEmail(data.email || '');
          // setInitialProfilePictureUrl(picturePath ? `${baseUrl}/${picturePath}` : null); // No longer needed
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

  // --- Handle File Selection ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create and set preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up previous preview URL
      }
      setPreviewUrl(newPreviewUrl);
      setInfoError(null); // Clear previous errors
      setInfoSuccess(null);
    } else {
      // Clear selection if no file is chosen
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  // --- Handle Profile Info Update ---
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoError(null);
    setInfoSuccess(null);

    setConfirmMessage('Are you sure you want to update your profile info?');
    setOnConfirmCallback(() => async () => {
      setIsUpdatingInfo(true);
      try {
        const updatedData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email
            // profile_picture_url is handled separately via file upload
        };
        const response = await updateProfile(updatedData);
        setInfoSuccess('Profile updated successfully!');
        setInitialFirstName(response.user?.first_name ?? '');
        setInitialLastName(response.user?.last_name ?? '');
        setInitialEmail(response.user?.email ?? '');
        // Profile picture path is updated via separate upload API call
        // We might need to refetch profile or update context after upload success
      } catch (err: any) {
        setInfoError(err.response?.data?.error || 'Failed to update profile. Please try again.');
        console.error("Profile update error:", err);
      } finally {
        setIsUpdatingInfo(false);
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };


  // --- Change Detection ---
  const infoHasChanges =
    username !== initialUsername ||
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    email !== initialEmail ||
    // profilePictureUrl !== initialProfilePictureUrl; // Change detection for picture is handled by selectedFile state
    !!selectedFile; // Consider changes if a new file is selected

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
                    src={previewUrl || profilePictureUrl || '/default-avatar.png'} // Show preview, then DB image, then default
                    alt="Profile"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} // Fallback image
                />
                <label htmlFor="profile-picture-upload" className={styles.uploadButton}>
                  Change Picture
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }} // Hide default input
                  disabled={isUpdatingInfo} // Disable while info is saving
                />
                {/* TODO: Add button to trigger upload API call */}
             </div>
             {selectedFile && <small style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)'}}>Selected: {selectedFile.name}</small>}
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
            {showConfirm && (
              <ConfirmModal
                message={confirmMessage}
                onConfirm={onConfirmCallback}
                onCancel={() => setShowConfirm(false)}
              />
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isUpdatingInfo || (!infoHasChanges && !selectedFile)} // Disable if no text changes AND no file selected
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