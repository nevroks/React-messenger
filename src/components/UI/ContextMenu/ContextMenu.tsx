import { forwardRef, useEffect, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';
import { useKeyboardNavigation, useEmojiExpansion } from '../../../utils/helpers/contextMenuHelper';
import { emojis, expandedEmojis } from '../../../utils/data/emojiData';
import { debounce, throttle } from 'lodash';

// ICONS
import ReplyIcon from '../../../assets/icons/undo.svg';
import PinIcon from '../../../assets/icons/pin.svg';
import CopyIcon from '../../../assets/icons/copy.svg';
import ForwardIcon from '../../../assets/icons/redo.svg';
import TrashIcon from '../../../assets/icons/trash.svg';
import SelectIcon from '../../../assets/icons/tick-circle.svg';
import ExpandIcon from '../../../assets/icons/arrow-down_2.svg';
import EditIcon from '../../../assets/icons/edit.svg';
import { useComponentsHeightStore } from '../../../stores/ComponentsHeight';

const iconMap: { [key: string]: string } = {
  reply: ReplyIcon,
  edit: EditIcon,
  pin: PinIcon,
  copy: CopyIcon,
  forward: ForwardIcon,
  delete: TrashIcon,
  select: SelectIcon,
};

interface ContextMenuProps {
  position?: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
  onEmojiClick?: (emoji: string) => void;
  menuItems: { label: string; action: string; disabled?: boolean }[];
  closeSensitivity?: { scroll?: number; blur?: number; click?: number };
}

const emojiContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const emojiItemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      duration: 0.1,
    },
  },
};

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ onClose, onAction, menuItems, closeSensitivity, onEmojiClick }, ref) => {
    // const { adjustedPosition, openUpwards } = useAdjustPosition();
    const { activeIndex, setActiveIndex } = useKeyboardNavigation(menuItems, onAction, onClose);
    const { isExpanded, toggleExpand } = useEmojiExpansion();
    const [heightMenu, setHeightMenu] = useState(0);
    // const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isMobile = useMemo(() => isMobileDevice(), []);
    // const longPressDuration = isMobile ? 700 : 500;

    const adaptiveSensitivity = useMemo(() => {
      if (isMobile) {
        return closeSensitivity || { scroll: 200, blur: 150, click: 200 };
      } else {
        return closeSensitivity || { scroll: 100, blur: 100, click: 150 };
      }
    }, [isMobile, closeSensitivity]);

    const stableOnClose = useCallback(onClose, [onClose]);

    const debouncedClose = useMemo(() => debounce(stableOnClose, adaptiveSensitivity.click), [stableOnClose, adaptiveSensitivity.click]);

    const throttledHandleWindowEvents = useMemo(() => throttle(() => debouncedClose(), adaptiveSensitivity.scroll), [debouncedClose, adaptiveSensitivity.scroll]);

    const handleTouchOutside = useCallback((e: TouchEvent | PointerEvent) => {
      if (ref && typeof ref !== 'function' && ref.current && !(ref.current as HTMLElement).contains(e.target as Node)) {
        debouncedClose();
      }
    }, [debouncedClose, ref]);

    useEffect(() => {
      const handlePointerDownOutside = (e: PointerEvent) => handleTouchOutside(e);
      const handleTouchStart = (e: TouchEvent) => handleTouchOutside(e);

      window.addEventListener('scroll', throttledHandleWindowEvents, true);
      window.addEventListener('resize', throttledHandleWindowEvents, true);
      window.addEventListener('blur', () => debounce(stableOnClose, adaptiveSensitivity.blur)());
      window.addEventListener('pointerdown', handlePointerDownOutside);
      window.addEventListener('touchstart', handleTouchStart);

      return () => {
        window.removeEventListener('scroll', throttledHandleWindowEvents, true);
        window.removeEventListener('resize', throttledHandleWindowEvents, true);
        window.removeEventListener('blur', () => debounce(stableOnClose, adaptiveSensitivity.blur)());
        window.removeEventListener('pointerdown', handlePointerDownOutside);
        window.removeEventListener('touchstart', handleTouchStart);
        debouncedClose.cancel();
        throttledHandleWindowEvents.cancel();
      };
    }, [debouncedClose, throttledHandleWindowEvents, handleTouchOutside, adaptiveSensitivity, stableOnClose]);

    // const handleMouseDown = (e: React.MouseEvent) => {
    //   if (e.type === 'mousedown' && e.button === 0) {
    //     longPressTimeoutRef.current = setTimeout(() => {
    //     }, longPressDuration);
    //   }
    // };

    // const handleMouseUp = () => {
    //   if (longPressTimeoutRef.current) {
    //     clearTimeout(longPressTimeoutRef.current);
    //   }
    // };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        debouncedClose.cancel();
        stableOnClose();
      }
    };

    // const getDynamicMenuPosition = () => {
    //   if (ref && typeof ref !== 'function' && ref.current) {
    //     const viewportWidth = window.innerWidth;
    //     const viewportHeight = window.innerHeight;
    //     const menuWidth = ref.current.offsetWidth || 0;
    //     const menuHeight = ref.current.offsetHeight || 0;

    // const newX = adjustedPosition.x + menuWidth > viewportWidth ? viewportWidth - menuWidth : adjustedPosition.x;
    // const newY = adjustedPosition.y + menuHeight > viewportHeight ? viewportHeight - menuHeight : adjustedPosition.y;

    //     return { x: newX, y: newY };
    //   }
    //   return { x: adjustedPosition.x, y: adjustedPosition.y };
    // };


    // const dynamicPosition = getDynamicMenuPosition();


    useEffect(() => {
      if (ref && typeof ref !== 'function' && ref.current) {
        // actions.setContextMenuHeightAction(ref.current.offsetHeight)
        setHeightMenu(ref.current.offsetHeight)

      }
    }, [ref, menuItems, isExpanded]);

    const { actions, selectors } = useComponentsHeightStore()
    //отправка высоты контекста 
    useEffect(() => {
      if (heightMenu) {
        actions.setContextMenuHeightAction(heightMenu)
      }
    }, [heightMenu])
    const height = selectors.totalHeightSelector ? -0 : 0
    const heightClone = selectors.totalHeightSelector ? -200 : 0


    return (
      selectors.getmessagesHeightSelector > 250 ? (<motion.div
        ref={ref}
        className={styles['context-menu']}
        style={{ translateY: `${height}px` }}

        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className={styles['emoji-panel']}
          style={ selectors.totalHeightSelector &&  isExpanded ? {top: `${0}px`} : {  } }
          initial="hidden"
          animate="visible"
          variants={emojiContainerVariants}
        >
          {emojis.map((emoji) => (
            <motion.span
              key={emoji}
              className={styles['emoji']}
              onClick={() => onEmojiClick(emoji)}
              variants={emojiItemVariants}
            >
              {emoji}
            </motion.span>
          ))}

          {isExpanded && 
            expandedEmojis.map((emoji) => (
              <motion.span
                key={emoji}
                className={styles['emoji']}
                onClick={() => onEmojiClick(emoji)}
                variants={emojiItemVariants}
              >
                {emoji}
              </motion.span>
            ))}
          <span
            className={`${styles['emoji-expand']} ${isExpanded ? styles['rotate'] : ''}`}
            onClick={toggleExpand}
          >
            <img src={ExpandIcon} alt="Expand" />
          </span>
        </motion.div>
        {!isExpanded && (
          <div className={styles['context-menu-body']}>
            {menuItems.map((item, index) => (
              <div
                key={item.action}
                onClick={() => !item.disabled && onAction(item.action)}
                className={`${styles['menu-item']} ${item.disabled ? styles['disabled'] : ''}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onAction(item.action)}
                aria-disabled={item.disabled}
                aria-selected={activeIndex === index}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <img src={iconMap[item.action]} alt={`${item.label} icon`} className={styles['menu-icon']} />
                {item.label}
              </div>
            ))}
          </div>
        )}
      </motion.div>)

        :

        (
          <motion.div
            ref={ref}
            className={styles['context-menu']}
            style={{ top: `${heightClone}px` }}
            // exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            // transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onKeyDown={handleKeyDown}
          >
            <motion.div
              className={styles['emoji-panel']}
              style={ selectors.totalHeightSelector &&  isExpanded ? {top: `${0}px`} : {  } }
              initial="hidden"
              animate="visible"
              variants={emojiContainerVariants}
            >
              {emojis.map((emoji) => (
                <motion.span
                  key={emoji}
                  className={styles['emoji']}
                  onClick={() => onEmojiClick(emoji)}
                  variants={emojiItemVariants}
                >
                  {emoji}
                </motion.span>
              ))}

              {isExpanded &&
                expandedEmojis.map((emoji) => (
                  <motion.span
                    key={emoji}
                    className={styles['emoji']}
                    style={{ top: `${heightClone}px` }}
                    onClick={() => onEmojiClick(emoji)}
                    variants={emojiItemVariants}
                  >
                    {emoji}
                  </motion.span>
                ))}
              <span
                className={`${styles['emoji-expand']} ${isExpanded ? styles['rotate'] : ''}`}
                onClick={toggleExpand}
              >
                <img src={ExpandIcon} alt="Expand" />
              </span>
            </motion.div>
            {!isExpanded && (
              <div className={styles['context-menu-body']}>
                {menuItems.map((item, index) => (
                  <div
                    key={item.action}
                    onClick={() => !item.disabled && onAction(item.action)}
                    className={`${styles['menu-item']} ${item.disabled ? styles['disabled'] : ''}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onAction(item.action)}
                    aria-disabled={item.disabled}
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <img src={iconMap[item.action]} alt={`${item.label} icon`} className={styles['menu-icon']} />
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )
    );
  }
);

export default ContextMenu;