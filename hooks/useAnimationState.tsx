import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AnimationStateProps {
  persistAcrossScreens?: boolean;
}

export const useAnimationState = ({ persistAcrossScreens = true }: AnimationStateProps = {}) => {
  const [state, setState] = useState({
    hasPlayed: false,
    isFirstRender: true
  });

  useEffect(() => {
    // Mark first render complete after mount
    if (state.isFirstRender) {
      setState(prev => ({
        ...prev,
        isFirstRender: false
      }));
    }

    // If we want animations to replay when app comes back from background
    if (!persistAcrossScreens) {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          setState(prev => ({
            ...prev,
            hasPlayed: false
          }));
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      return () => {
        subscription.remove();
      };
    }
  }, [persistAcrossScreens, state.isFirstRender]);

  const resetAnimationState = () => {
    setState({
      hasPlayed: false,
      isFirstRender: false
    });
  };

  const markAnimationsPlayed = () => {
    setState(prev => ({
      ...prev,
      hasPlayed: true
    }));
  };

  return {
    animationState: state,
    resetAnimationState,
    markAnimationsPlayed
  };
};

export default useAnimationState;