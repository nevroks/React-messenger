import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./style.module.scss";

interface PopoverProps {
  isOpen: boolean;
  anchorRef?: React.RefObject<HTMLElement> | null;
  anchorPosition?: { top?: number; left?: number };
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  anchorOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  transformOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const Popover: React.FC<PopoverProps> = ({
  isOpen,
  anchorRef,
  anchorPosition,
  onClose,
  children,
  className,
  anchorOrigin = { vertical: "top", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!anchorRef?.current) return null;

  const calculatePosition = () => {
  const anchorRect = anchorRef.current!.getBoundingClientRect();
  const popoverHeight = popoverRef.current?.offsetHeight || 0;
  const popoverWidth = popoverRef.current?.offsetWidth || 0;

  const topPosition = anchorPosition 
    ? anchorPosition.top 
    : anchorRect.top + window.scrollY + 
      (anchorOrigin.vertical === "bottom" 
        ? anchorRect.height 
        : anchorOrigin.vertical === "center" 
        ? -popoverHeight / 2 
        : 0);

  const leftPosition = anchorPosition 
    ? anchorPosition.left 
    : anchorRect.left + window.scrollX + 
      (anchorOrigin.horizontal === "center" 
        ? -popoverWidth / 2 
        : anchorOrigin.horizontal === "right" 
        ? -popoverWidth 
        : 0);

  return { top: topPosition, left: leftPosition };
};

  const { top, left } = calculatePosition();
  const positionStyles: React.CSSProperties = {
    top,
    left,
    transformOrigin: `${transformOrigin.horizontal} ${transformOrigin.vertical}`,
    position: "absolute",
    zIndex: 1000,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          className={`${styles.popover} ${className || ""}`}
          initial={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={positionStyles}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popover;
