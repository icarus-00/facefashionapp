import Slider from "@/components/atoms/slider/slider";
import data from "./constants";
import { account } from "@/services/config/appwrite";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import { useState, useRef } from "react";
import { FlatList } from "react-native";
import { Href, useRouter } from "expo-router";

export default function OnboardingScreen({ path }: { path: Href }) {
  // Track the current slide index
  const currentIndex = useSharedValue(0);
  const isLastSlide = useSharedValue(0); // 0 = not last slide, 1 = last slide
  const router = useRouter();

  // Create a ref to the Slider component
  const sliderRef = useRef<{ goToSlide: (index: number) => void }>(null);

  // Update animations when the current index changes
  const onSlideChange = (index: number) => {
    currentIndex.value = index;
    isLastSlide.value = withTiming(index === data.length - 1 ? 1 : 0, {
      duration: 300,
    });
  };

  // Animated styles for primary button
  const primaryButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide.value === 1 ? 0 : 1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          translateY: interpolate(
            isLastSlide.value,
            [0, 1],
            [0, 40],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // Animated styles for the final buttons container with more subtle animation
  const finalButtonsStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide.value, {
        duration: 500,
        easing: Easing.bezier(0.16, 1, 0.3, 1), // Custom easing for a smoother feel
      }),
      transform: [
        {
          translateY: interpolate(
            isLastSlide.value,
            [0, 1],
            [50, 0], // Reduced distance for subtlety
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  // More unique logo animation style
  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isLastSlide.value, {
        duration: 800,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      }),
      transform: [
        {
          scale: interpolate(
            isLastSlide.value,
            [0, 1],
            [0.9, 1],
            Extrapolation.CLAMP
          ),
        },
        {
          translateY: interpolate(
            isLastSlide.value,
            [0, 1],
            [10, 0],
            Extrapolation.CLAMP
          ),
        },
        {
          rotateZ: `${interpolate(
            isLastSlide.value,
            [0, 1],
            [-5, 0],
            Extrapolation.CLAMP
          )}deg`, // Slight rotation for a more dynamic entrance
        },
      ],
    };
  });

  // Handle button actions
  const handleNext = () => {
    if (currentIndex.value < data.length - 1) {
      // Move to the next slide
      const nextIndex = Math.min(currentIndex.value + 1, data.length - 1);
      if (sliderRef.current) {
        sliderRef.current.goToSlide(nextIndex);
      }
    }
  };

  const handleLogin = () => {
    // Navigate to login screen
    console.log("Login button pressed");

    router.push(path);
  };

  return (
    <View className="flex-1 bg-white">
      <Slider data={data} onSlideChange={onSlideChange} ref={sliderRef} />

      {/* "Next" button for non-final slides */}
      {/*
        <Animated.View
          className="p-5 items-center justify-center"
          style={primaryButtonStyle}
        >
          <Button
            className="bg-blue-500 w-full h-14 rounded-xl"
            variant="solid"
            size="xl"
            onPress={handleNext}
          >
            <ButtonText className="text-white font-bold">Next</ButtonText>
          </Button>
        </Animated.View>*/}

      {/* Logo and buttons for final slide */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 p-5 items-center"
        style={finalButtonsStyle}
      >
        {/* Login button */}
        <Button
          variant="solid"
          size="full"
          onPress={handleLogin}
        >
          <ButtonText>Login</ButtonText>
        </Button>
      </Animated.View>
    </View>
  );
}
