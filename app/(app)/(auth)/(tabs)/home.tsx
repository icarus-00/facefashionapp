import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions, Platform } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
  SlideInDown
} from "react-native-reanimated";

const headerImage = require("@/assets/images/home/image copy(1).png");
const secondModelImage = require("@/assets/images/home/second-model.jpg");
const { width } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedBox = Animated.createAnimatedComponent(Box);


type categoriesType = 
{
  id:number,
  name:string,
  icon: React.ComponentProps<typeof AntDesign>["name"]
}
// Fashion categories with icons
const categories : categoriesType[] = [
  { id: 1, name: "Fashion Enthusiasts", icon: "user" },
  { id: 2, name: "Production Teams", icon: "calendar" },
  { id: 3, name: "Everyone Else", icon: "user" },
];

// How it works steps
const howItWorksSteps = [
  { id: 1, title: "Choose Your Actor" },
  { id: 2, title: "Choose Your Actor" },
  { id: 3, title: "Choose Your Actor" },
];

const Home = () => {
  // Animation values
  const headerOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.95);
  const brandTextScale = useSharedValue(0.9);
  const featuresTranslateY = useSharedValue(50);
  const secondImageOpacity = useSharedValue(0);
  const secondImageScale = useSharedValue(0.9);
  const howItWorksTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(0.95);
  
  // State to track if animations have played
  const [animationState, setAnimationState] = useState({
    hasPlayed: false,
    isFirstRender: true
  });

  // Refs for scrolling
  const scrollRef = useRef(null);

  useEffect(() => {
    // Only play animations if they haven't played before or it's the first render
    if (!animationState.hasPlayed || animationState.isFirstRender) {
      // Entrance animations with proper timing
      headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
      heroScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));
      brandTextScale.value = withDelay(500, withSpring(1, { damping: 12 }));
      featuresTranslateY.value = withDelay(700, withSpring(0, { damping: 12 }));
      secondImageOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
      secondImageScale.value = withDelay(1000, withSpring(1, { damping: 12 }));
      howItWorksTranslateY.value = withDelay(1200, withSpring(0, { damping: 12 }));
      buttonScale.value = withDelay(400, withSpring(1, { damping: 12 }));

      // Update state to indicate animations have played
      setAnimationState({
        hasPlayed: true,
        isFirstRender: false
      });
    }
  }, [animationState]);

  // Header animation
  const headerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }]
    };
  });

  // Hero section animation
  const heroAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: heroScale.value }
      ]
    };
  });

  // Brand text animation
  const brandTextAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: brandTextScale.value }
      ],
      opacity: interpolate(brandTextScale.value, [0.9, 1], [0, 1])
    };
  });

  // Features section animation
  const featuresAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: featuresTranslateY.value }
      ],
      opacity: interpolate(featuresTranslateY.value, [50, 0], [0, 1])
    };
  });

  // Second image animation
  const secondImageAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: secondImageOpacity.value,
      transform: [
        { scale: secondImageScale.value }
      ]
    };
  });

  // How it works section animation
  const howItWorksAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: howItWorksTranslateY.value }
      ],
      opacity: interpolate(howItWorksTranslateY.value, [50, 0], [0, 1])
    };
  });

  // Button animation
  const buttonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: buttonScale.value }
      ]
    };
  });
  
  // Animation for button press
  const handleButtonPress = () => {
    buttonScale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 300 })
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        ref={scrollRef} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Animated Image */}
        <Animated.View style={heroAnimStyle} className="w-full">
          <ImageBackground
            source={headerImage}
            className="w-full aspect-[3/4]"
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 1)"]}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
          </ImageBackground>
        </Animated.View>

        {/* Get Started Button */}
        <Center className="my-6">
          <Animated.View style={buttonAnimStyle}>
            <Button
              size="lg"
              variant="solid"
              className="rounded-full bg-black shadow-md px-8"
              onPress={() => handleButtonPress()}
            >
              <ButtonText>Get Started</ButtonText>
            </Button>
          </Animated.View>
        </Center>

        {/* RenderFusion Text - Added as requested */}
        <Animated.View style={brandTextAnimStyle} className="mb-8">
          <Center>
            <AnimatedHeading 
              className="text-black font-extrabold"
              size="3xl"
            >
              RenderFusion
            </AnimatedHeading>
          </Center>
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={featuresAnimStyle} className="px-5">
          <VStack space="lg">
            {/* AI Feature Section */}
            <Box>
              <Center>
                <Text className="text-black text-2xl font-bold mb-2 text-center">
                  AI-Powered Outfit Generation
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                  Instantly create unique outfit designs{"\n"}
                  Style Anytime, Anywhere!
                </Text>
              </Center>
            </Box>

            {/* Categories */}
            <HStack space="md"  className=" justify-between mb-8">
              {categories.map((category, index) => (
                <AnimatedPressable
                  key={category.id}
                  entering={FadeIn.delay(800 + index * 100).duration(500)}
                  className="items-center"
                  onPress={() => handleButtonPress()}
                >
                  <View className="items-center">
                    <AntDesign
                      name={category.icon}
                      size={24}
                      color="#000"
                      style={{ marginBottom: 8 }}
                    />
                    <Text className="text-black text-center font-medium text-xs">{category.name}</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </HStack>

            {/* Second Model Image Section - with w-full as requested */}
            <Animated.View style={secondImageAnimStyle} className="mb-8">
              <View className="w-full items-center">
                <Image
                  source={secondModelImage}
                  style={{
                    width: '100%', // w-full
                    height: undefined,
                    aspectRatio: 9/16, // Maintain aspect ratio
                    borderRadius: 4
                  }}
                  resizeMode="cover"
                />
                {/* Text below the second image */}
                <Text className="text-black text-center font-medium mt-4">
                  Instantly create unique outfit designs
                </Text>
                <Text className="text-black text-center font-medium">
                  Style Anytime, Anywhere!
                </Text>
              </View>
            </Animated.View>

            {/* How It Works Section */}
            <Animated.View style={howItWorksAnimStyle} className="mb-20">
              <Text className="text-black font-bold text-xl mb-4">
                How It Works Your virtual styling
              </Text>
              
              <VStack space="md">
                {howItWorksSteps.map((step, index) => (
                  <AnimatedPressable
                    key={step.id}
                    entering={SlideInDown.delay(1300 + index * 150).duration(500)}
                    className="bg-gray-100 rounded-lg p-4 flex-row justify-between items-center"
                    onPress={() => handleButtonPress()}
                  >
                    <HStack space="sm" className="align-">
                      <Ionicons name="person" size={20} color="#000" />
                      <Text className="text-black font-medium">{step.title}</Text>
                    </HStack>
                    <Ionicons name="chevron-down" size={24} color="#000" />
                  </AnimatedPressable>
                ))}
              </VStack>
            </Animated.View>
          </VStack>
        </Animated.View>
      </ScrollView>

    </View>
  );
};

export default Home;