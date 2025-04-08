import React, { useState } from 'react';
import { changePassword } from '../services/profileApi';
import styles from './ProfilePage.module.css'; // Reuse profile styles for now
import ConfirmModal from '../components/ui/ConfirmModal';

const SettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => () => {});

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    setConfirmMessage('Are you sure you want to change your password?');
    setOnConfirmCallback(() => async () => {
      setIsUpdatingPassword(true);
      try {
        const resp = await changePassword({ currentPassword, newPassword });
        if (resp.success) {
          setPasswordSuccess('Password changed successfully!');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setPasswordError(resp.error || 'Failed to change password.');
        }
      } catch (err: any) {
        setPasswordError(err.response?.data?.error || 'Failed to change password.');
        console.error("Password change error:", err);
      } finally {
        setIsUpdatingPassword(false);
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Settings</h1>

      <div className={styles.profileCard}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
        {passwordSuccess && <div className={styles.successMessage}>{passwordSuccess}</div>}
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="current-password" className={styles.label}>Current Password:</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingPassword}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="new-password" className={styles.label}>New Password:</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingPassword}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirm-password" className={styles.label}>Confirm New Password:</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isUpdatingPassword}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {isUpdatingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={onConfirmCallback}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;