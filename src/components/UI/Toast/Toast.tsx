import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './style.module.scss';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      onClose();
    }
  }, [isVisible, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -100, y: 0 }}
      transition={{ duration: 0.5 }}
      className="toast-container"
    >
      <p>{message}</p>
    </motion.div>
  );
};

export default Toast;