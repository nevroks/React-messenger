import { useCallback } from 'react';

const useSound = (soundUrl: string) => {
  const playSound = useCallback(() => {
    try {
      const audio = new Audio(soundUrl);
      audio.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    } catch (error) {
      console.error('Error initializing sound:', error);
    }
  }, [soundUrl]);

  return playSound;
};

export default useSound;