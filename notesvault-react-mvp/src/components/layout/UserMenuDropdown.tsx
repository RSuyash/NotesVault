import React from 'react';
import { Link } from 'react-router-dom';
import styles from './UserMenuDropdown.module.css';
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface UserMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdownContainer}>
      <div className={styles.dropdownMenu}>
        <Link to="/dashboard/profile" className={styles.menuItem} onClick={onClose}>
          <UserCircleIcon className={styles.menuIcon} />
          <span>My Profile</span>
        </Link>
        <Link to="/dashboard/settings" className={styles.menuItem} onClick={onClose}>
          <Cog6ToothIcon className={styles.menuIcon} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default UserMenuDropdown;