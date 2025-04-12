import { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useAdjustPosition = (
  position: Position,
  menuWidth = 180,
  menuHeight = 220,
  padding = 10
) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const [openUpwards, setOpenUpwards] = useState(false);

  const adjustPosition = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let newX = position.x;
    let newY = position.y;

    if (position.x + menuWidth + padding > screenWidth) {
      newX = screenWidth - menuWidth - padding;
    }

    const spaceBelow = screenHeight - position.y;
    const spaceAbove = position.y;

    if (spaceBelow < menuHeight + padding && spaceAbove > menuHeight + padding) {
      newY = position.y - menuHeight;
      setOpenUpwards(true);
    } else {
      setOpenUpwards(false);
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [position, menuWidth, menuHeight, padding]); 

  useEffect(() => {
    adjustPosition();
  }, [position, adjustPosition]);

  return { adjustedPosition, openUpwards };
};

export const useKeyboardNavigation = (
  menuItems: { label: string; action: string; disabled?: boolean }[],
  onAction: (action: string) => void,
  onClose: () => void
) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        if (!menuItems[activeIndex].disabled) {
          onAction(menuItems[activeIndex].action);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [activeIndex, menuItems, onAction, onClose]);

  return { activeIndex, setActiveIndex };
};

export const useEmojiExpansion = (initialExpanded = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return { isExpanded, toggleExpand };
};