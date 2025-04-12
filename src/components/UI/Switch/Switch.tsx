import React from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ isOn, onToggle, disabled = false }) => {
  return (
    <div
      className={`${styles.switchContainer} ${disabled ? styles.disabled : ''}`}
      onClick={!disabled ? onToggle : undefined}
    >
      <motion.div
        className={styles.switchBackground}
        animate={{ backgroundColor: isOn ? 'rgb(204, 224, 255)' : 'var(--prim)' }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={styles.switchHandle}
          layout
          animate={isOn ? { x: 17 } : { x: 1 }}
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
        />
      </motion.div>
    </div>
  );
};

export default Switch;