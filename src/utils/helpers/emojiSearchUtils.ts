import Fuse from 'fuse.js';
import { Emoji } from '../../utils/types';

export const initializeEmojiSearch = (emojis: Emoji[]) => {
  const fuse = new Fuse(emojis, {
    keys: ['name', 'char'],
    threshold: 0.3,
    shouldSort: true,
    useExtendedSearch: true,
  });

  return (query: string) => fuse.search(query).map(({ item }) => item);
};

export const debounceSearchQuery = (
  searchFunction: (query: string) => Emoji[],
  setFilteredEmojis: React.Dispatch<React.SetStateAction<Emoji[]>>,
  setShowNoResults: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    setShowNoResults(false);

    if (trimmedQuery.length > 0) {
      setIsSearchLoading(true);
      const results = searchFunction(trimmedQuery);
      setFilteredEmojis(results);
      setIsSearchLoading(false);

      if (results.length === 0) {
        setShowNoResults(true);
      }
    } else {
      setFilteredEmojis([]);
      setIsSearchLoading(false);
    }
  };
};