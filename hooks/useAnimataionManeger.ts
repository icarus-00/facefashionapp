import { useState, useEffect, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';

interface AnimationSection {
  [key: string]: boolean;
}

export const useAnimationManager = (initialSections: string[]) => {
  // Create initial state object with all sections set to false
  const initialState = initialSections.reduce((acc, section) => {
    acc[section] = false;
    return acc;
  }, {} as AnimationSection);

  // State to track if animations have played
  const [animationsPlayed, setAnimationsPlayed] = useState<AnimationSection>(initialState);
  
  // Store animation values in a ref to avoid recreating them
  const animationValues = useRef<{[key: string]: any}>({});
  
  // Initialize animation values
  useEffect(() => {
    initialSections.forEach(section => {
      if (!animationValues.current[section]) {
        animationValues.current[section] = {
          opacity: useSharedValue(0),
          scale: useSharedValue(0.9),
          translateY: useSharedValue(50),
        };
      }
    });
  }, [initialSections]);

  // Function to play animation for a specific section
  const playAnimation = (section: string) => {
    if (!animationsPlayed[section] && animationValues.current[section]) {
      setAnimationsPlayed(prev => ({
        ...prev,
        [section]: true
      }));
      return true;
    }
    return false;
  };

  // Function to reset all animations
  const resetAnimations = () => {
    setAnimationsPlayed(initialState);
  };

  return {
    animationsPlayed,
    animationValues: animationValues.current,
    playAnimation,
    resetAnimations
  };
};

export default useAnimationManager;