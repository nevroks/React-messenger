import React from 'react';
import styles from './style.module.scss';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles['loader-layout']}>
      <div className={styles['loader']} />
    </div>
  );
};

export default LoadingSpinner;
