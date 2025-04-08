import React from 'react';
import styles from './SlideConfirm.module.css';

interface SlideConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const SlideConfirm: React.FC<SlideConfirmProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'Cancel',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.toast}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onCancel}>{cancelText}</button>
          <button className={styles.confirmButton} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default SlideConfirm;