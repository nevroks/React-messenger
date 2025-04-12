import { Emoji } from '../types';

export const groupEmojisByCategory = (emojis: Emoji[]) => {
  const groups: { [key: string]: Emoji[] } = {
    'Смайлы и люди': [],
    'Животные и природа': [],
    'Еда и напитки': [],
    'Путешествия и места': [],
    'Предметы': [],
    'Деятельность': [],
    'Символы': [],
    'Флаги': [],
  };

  emojis.forEach((emoji) => {
    const { category } = emoji;

    if (category.includes('Smileys & Emotion')) {
      groups['Смайлы и люди'].push(emoji);
    } else if (category.includes('Animals & Nature')) {
      groups['Животные и природа'].push(emoji);
    } else if (category.includes('Food & Drink')) {
      groups['Еда и напитки'].push(emoji);
    } else if (category.includes('Travel & Places')) {
      groups['Путешествия и места'].push(emoji);
    } else if (category.includes('Objects')) {
      groups['Предметы'].push(emoji);
    } else if (category.includes('Activities')) {
      groups['Деятельность'].push(emoji);
    } else if (category.includes('Symbols')) {
      groups['Символы'].push(emoji);
    } else if (category.includes('Flags')) {
      groups['Флаги'].push(emoji);
    }
  });

  return groups;
};

export const handleRecentEmojis = (emoji: Emoji, recentEmojis: Emoji[]) => {
  const updatedRecentEmojis = [emoji, ...recentEmojis.filter((e) => e.char !== emoji.char)].slice(0, 20);
  localStorage.setItem('recentEmojis', JSON.stringify(updatedRecentEmojis));
  return updatedRecentEmojis;
};
