import React from "react";
import { motion } from "framer-motion";
import "./style.module.scss";

interface DropdownProps {
  onClose: () => void;
  options: { label: string; icon: string }[];
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Dropdown: React.FC<DropdownProps> = ({ onClose, options }) => {
  return (
    <motion.div
      className="dropdown-menu"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={dropdownVariants}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {options.map((option) => (
        <div key={option.label} className="dropdown-item" onClick={onClose}>
          <span className="icon">{option.icon}</span> {option.label}
        </div>
      ))}
    </motion.div>
  );
};

export default Dropdown;