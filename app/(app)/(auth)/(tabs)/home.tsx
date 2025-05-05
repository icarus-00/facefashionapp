import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
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
import { Card } from "@/components/ui/card";
import { icons } from "@/constants/Icons";
import { images } from "@/constants/images";
import CollectionComponent from "@/components/CollectionCards";
import { router } from "expo-router";
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
  SlideInDown,
  SlideInRight
} from "react-native-reanimated";

const headerImage = require("@/assets/images/home/image copy(1).png");
const secondModelImage = require("@/assets/images/home/second-model.jpg");
const { width } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);
const AnimatedBox = Animated.createAnimatedComponent(Box);

// Fashion categories with icons
const categories = [
  { id: 1, name: "Fashion \n Enthusiasts", icon: icons.FrameF },
  { id: 2, name: "Production \n Teams", icon: icons.FrameP },
  { id: 3, name: "Everyone \n Else", icon: icons.FrameA },
];

// Dropdown data
const dropdownData = [
  {
    id: '1',
    icon: icons.person,
    title: '1. Choose Your Actor',
    description: 'Browse our curated gallery of actor images and select the one that embodies your creative vision. With detailed profiles and carousel previews, finding the perfect face for your style story has never been easier.'
  },
  {
    id: '2',
    icon: icons.starb,
    title: '2. Select Your Outfit',
    description: 'Mix and match from an exclusive collection of clothing pieces. Navigate through categories like tops, bottoms, and accessories to create a unique ensemble that speaks to your style.'
  },
  {
    id: '3',
    icon: icons.dresser,
    title: '3. Generate Your Look',
    description: 'Leverage our cutting-edge AI to bring your concept to life. See your chosen actor wearing the selected outfit in realistic images, and explore multiple angles to perfect your look before making a decision.'
  }
];

// Trending styles
const trendingStyles = [
  { id: 1, name: "Urban Minimalist", image: images.polo},
  { id: 2, name: "Boho Chic", image: images.tropical },
  { id: 3, name: "Tech Wear", image: images.trucker },
  { id: 4, name: "Tech Wear", image: images.blazer },
  { id: 5, name: "Tech Wear", image: images.jacket }
];

export default function Home() {
  // Add state
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  const CARD_WIDTH = 200; // match your View width
  const SPACING = 16;

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

  // Define DropdownItem component
  const DropdownItem = ({ item }: { item: typeof dropdownData[0] }) => {
    const isExpanded = expandedDropdown === item.id;

    const toggleDropdown = () => {
        setExpandedDropdown(isExpanded ? null : item.id);
    };

    return (
        <View className="mb-4 rounded-2xl bg-gray-100">
            <TouchableOpacity 
                onPress={toggleDropdown} 
                className="flex-row items-center justify-between p-4"
            >
                <View className="flex-row items-center">
                    <Image source={item.icon} className="w-6 h-6 mr-3" tintColor="black" />
                    <Text className="text-black font-semibold">{item.title}</Text>
                </View>
                <Text className="text-black">{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            
            {isExpanded && (
                <View className="p-4  border-t rounded-b-2xl border-gray-300">
                    <Text className="text-gray-600">{item.description}</Text>
                </View>
            )}
        </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        ref={scrollRef} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
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
            {/* RenderWear Text */}
            <Animated.View style={[brandTextAnimStyle, { position: 'absolute', top: '93%', left: 0, right: 0, zIndex: 1 }]} className="mb-4">
              <Center>
                <AnimatedHeading 
                  className="text-black font-extrabold"
                  size="5xl"
                >
                  RenderWear
                </AnimatedHeading>
              </Center>
            </Animated.View>
          </ImageBackground>
        </Animated.View>

        {/* AI Feature Section */}
        <Box>
          <Center>
            <Text className="text-black text-4xl font-bold mt-8 mb-2 text-center">
              Revolutionizing Try-On {"\n"} Experiences
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Instantly create unique outfit designs{"\n"}
              Style Anytime, Anywhere!
            </Text>
          </Center>
        </Box>

        {/* Get Started Button */}
        <Center className="my-2">
          <Animated.View style={buttonAnimStyle}>
            <Button
              size="lg"
              variant="solid"
              className="rounded-full bg-black shadow-md px-8 h-16"
              onPress={() => {
                handleButtonPress();
                router.push("/(app)/(auth)/(tabs)/actor");
              }}
            >
              <ButtonText>Get Started</ButtonText>
            </Button>
          </Animated.View>
        </Center>

        {/* Add Spacing */}
        <View className="h-10">
        </View>

        {/* Features Section */}
        <Animated.View style={featuresAnimStyle} className="px-5">
          <VStack space="lg">
            {/* AI Feature Section */}
            <Box>
              <Center>
                <Text className="text-black text-4xl font-bold mt-8 mb-2 text-center">
                  AI-Powered Outfit {"\n"}Generation
                </Text>
                <Text className="text-gray-600 text-center mb-2">
                Create, customize, and try-on outfits {"\n"} in real time using advanced AI technologies.
                </Text>
              </Center>
            </Box>

            {/* Categories */}
            <HStack space="md"  className=" justify-between mb-4">
              {categories.map((category, index) => (
                <AnimatedPressable
                  key={category.id}
                  entering={FadeIn.delay(800 + index * 100).duration(500)}
                  className="items-center"
                  onPress={() => handleButtonPress()}
                >
                  <View className="items-center">
                    <Image 
                      source={categories[index].icon}
                      style={{ width: 80, height: 80 }}
                      resizeMode="contain"
                    />
                    <Text className="text-black text-center font-bold text-xs">{category.name}</Text>
                  </View>
                </AnimatedPressable>
              ))}
            </HStack>

            <View className="flex-1 justify-center items-center">
              <View className="w-full">
                <Text className="text-black text-4xl font-bold mt-8 mb-2 text-center">
                Creating a profile{"\n"} has never been easier 
                </Text>
                <Text className="text-gray-600 text-center">
                  upload your image, pick the perfect outfit,{"\n"}setting, add your finishing touches. 
                </Text>
              </View>
            </View>

              {/* Collection Cards*/}
            <CollectionComponent/>

            {/* Trending Styles - Horizontal Scrolling */}
            <AnimatedBox entering={FadeIn.delay(1200).duration(800)}>
              <Text className="text-black text-4xl font-bold mt-8 mb-2 text-center">Explore Various Styles</Text>
              <Text className="text-gray-600 text-center mb-6">
                Whether you lean toward clean cuts or bold statements, discover inspiring styles for every look.
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <FlatList
                data={trendingStyles}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
                renderItem={({ item, index }) => (
                <Animated.View
                entering={SlideInRight.delay(1300 + index * 150).duration(500)}
                >
                <View className="overflow-hidden w-[200px] h-[260px]">
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: 260,
                    borderRadius: 12,
                  }}
                />
                </View>
                </Animated.View>
                )}
                />
              </ScrollView>
            </AnimatedBox>
          </VStack>
        </Animated.View>

        {/* Dropdown Features */}
        <View className=" relative flex-1 mb-20 mt-6 mx-5">
                <View className=" absolute top-0 left-0 right-5 justify-center items-center align-center">
                </View>
                <Text className="text-xl mb-4 font-bold text-dark-100 ">
                How It Works: Your Virtual Styling
                </Text>
                {dropdownData.map((item) => (
                    <DropdownItem key={item.id} item={item} />
                ))}
        </View>
        <View className="mb-10">
        </View>  
      </ScrollView>

    </View>
  );
};