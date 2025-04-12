import React, { useState, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { Emoji } from '../../../../utils/types';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './style.module.scss';

import { groupEmojisByCategory, handleRecentEmojis } from '../../../../utils/helpers/emojiUtils';
import { initializeEmojiSearch, debounceSearchQuery } from '../../../../utils/helpers/emojiSearchUtils';

// ICONS
import SearchIcon from '../../../../assets/icons/search.svg';
import BackIcon from '../../../../assets/icons/arrow-down_2.svg';
import CpuIcon from '../../../../assets/icons/cpu_blue.svg';
import {fetchEmojis} from "../../../../utils/services/emoji.service.ts";

interface SingleChatPageEmojiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

const RECENT_EMOJIS_KEY = 'recentEmojis';

const SingleChatPageEmojiSidebar: React.FC<SingleChatPageEmojiSidebarProps> = ({ isOpen, onClose, onEmojiSelect }) => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [filteredEmojis, setFilteredEmojis] = useState<Emoji[]>([]);
  const [recentEmojis, setRecentEmojis] = useState<Emoji[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchEmojis().then((data: Emoji[]) => {
        setEmojis(data);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const storedRecentEmojis = localStorage.getItem(RECENT_EMOJIS_KEY);
    if (storedRecentEmojis) {
      setRecentEmojis(JSON.parse(storedRecentEmojis));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const emojiSearch = useMemo(() => initializeEmojiSearch(emojis), [emojis]);

  const debounceSearch = useMemo(
    () =>
      debounce((query: string) => {
        debounceSearchQuery(emojiSearch, setFilteredEmojis, setShowNoResults, setIsSearchLoading)(query);
      }, 300),
    [emojiSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    debounceSearch(query);
  };

  const handleInputFocus = () => setIsFocused(true);
  const handleInputBlur = () => setIsFocused(false);

  const groupedEmojis = useMemo(() => groupEmojisByCategory(emojis), [emojis]);

  const handleEmojiSelect = (emoji: Emoji) => {
    onEmojiSelect(emoji.char);
    const updatedRecentEmojis = handleRecentEmojis(emoji, recentEmojis);
    setRecentEmojis(updatedRecentEmojis);
  };

  const handleScroll = throttle(() => {
    const scrollTop = document.querySelector(`.${styles['emoji-categories']}`)?.scrollTop || 10;

    let activeCategory: string | null = null;

    Object.keys(categoryRefs.current).forEach((category) => {
      const categoryElement = categoryRefs.current[category];
      if (categoryElement) {
        const { offsetTop } = categoryElement;
        if (scrollTop >= offsetTop - 150) {
          activeCategory = category;
        }
      }
    });

    setTimeout(() => {
      setCurrentCategory(activeCategory);
    }, 200);
  }, 100);

  const renderCategories = () => {
    return Object.keys(groupedEmojis).map((category) => (
      <div
        key={category}
        className={styles['emoji-category']}
        ref={(el) => (categoryRefs.current[category] = el)}
      >
        <h3 className={styles['category-name']}>{category}</h3>
        <div className={styles['emoji-list']}>
          {groupedEmojis[category].map((emoji, index) => (
            <span
              key={index}
              className={styles['emoji-item']}
              onClick={() => handleEmojiSelect(emoji)}
              title={emoji.name}
            >
              {emoji.char}
            </span>
          ))}
        </div>
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className={styles['emoji-sidebar']}>
      <div className={styles['top-bar']}>
        <button onClick={onClose} className={styles['back-button']}>
          <img src={BackIcon} alt="Close" />
        </button>
        <h3>Эмодзи</h3>
      </div>
      <div className={styles['main-emoji-sidebar-content']}>
          <div className={styles['generate-emoji-content']}>
            <img src={CpuIcon} alt="" />
            <p>Сгенерировать эмодзи</p>
          </div>
          <div className={`${styles['search-container']} ${isFocused ? styles['focused'] : ''}`}>
            <input
              type="text"
              placeholder="Найти"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className={styles['emoji-search']}
              value={searchQuery}
              ref={searchInputRef}
            />
            <img src={SearchIcon} alt="Search" className={styles['search-icon']} />
          </div>
          {isLoading ? (
            <p className={styles['loading-message']}>Загрузка эмодзи...</p>
          ) : (
            <div>
              <div className={styles['fixed-category-body']}>
                <AnimatePresence>
                  {currentCategory && (
                    <motion.div
                      className={styles['fixed-category']}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {currentCategory}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={styles['emoji-categories']} onScroll={handleScroll}>
                {isSearching && searchQuery.length > 0 ? (
                  <div className={styles['emoji-list']}>
                    {isSearchLoading ? (
                      <p className={styles['loading-message']}>Поиск эмодзи...</p>
                    ) : filteredEmojis.length > 0 ? (
                      filteredEmojis.map((emoji, index) => (
                        <span
                          key={index}
                          className={styles['emoji-item']}
                          onClick={() => handleEmojiSelect(emoji)}
                          title={emoji.name}
                        >
                          {emoji.char}
                        </span>
                      ))
                    ) : showNoResults ? (
                      <p className={styles['no-results-message']}>Ничего не найдено</p>
                    ) : (
                      <p className={styles['loading-message']}>Загрузка эмодзи...</p>
                    )}
                  </div>
                ) : (
                  <>
                    {recentEmojis.length > 0 && (
                      <div className={styles['emoji-category']}>
                        <h4 className={styles['category-name']}>Недавние</h4>
                        <div className={styles['emoji-list']}>
                          {recentEmojis.map((emoji, index) => (
                            <span
                              key={index}
                              className={styles['emoji-item']}
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji.char}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {renderCategories()}
                  </>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SingleChatPageEmojiSidebar;
