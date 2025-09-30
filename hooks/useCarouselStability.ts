import { useEffect, useState } from 'react';

/**
 * Hook to manage carousel initialization and prevent layout shifts
 */
export const useCarouselStability = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow DOM to settle
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    // Visibility delay to prevent flash
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  return {
    isInitialized,
    isVisible,
    containerProps: {
      'data-embla-initialized': isInitialized,
      style: {
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.3s ease-in-out'
      }
    }
  };
};
