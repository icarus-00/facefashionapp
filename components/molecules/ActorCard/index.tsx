import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, ViewStyle, Pressable, Text } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
  withDelay,
} from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons';

// Define default image
const DEFAULT_IMAGE = "https://placehold.co/900x1600";

// Define types for our component
export interface ActorInfo {
  $id?: string;
  id?: number;
  actorName?: string;
  imageUrl?: string;
  age?: number;
  height?: string;
  weight?: string;
  bio?: string;
  isPlaceholder?: boolean;
}

interface ActorCardProps {
  actor: ActorInfo;
  loading: boolean;
  index: number;
  onPress: (actor: ActorInfo) => void;
  style?: ViewStyle;
  width?: number;
  height?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActorCard: React.FC<ActorCardProps> = ({
  actor,
  loading,
  index,
  onPress,
  style,
  width,
  height,
}) => {
  const [fallbackImage, setFallbackImage] = useState<boolean>(false);
  const { width: screenWidth } = Dimensions.get('screen');
  
  // Default dimensions if not provided
  const cardWidth = width || (screenWidth - 24) / 2;
  const cardHeight = height || cardWidth * 1.5;
  
  // Animation values
  const itemCardScale = useSharedValue(0.95);
  
  useEffect(() => {
    // Staggered animation for cards
    itemCardScale.value = withDelay(
      index * 100 + 200,
      withSpring(1, { damping: 12, stiffness: 90 })
    );
  }, [index, itemCardScale]);
  
  const cardAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: itemCardScale.value }],
      opacity: interpolate(itemCardScale.value, [0.95, 1], [0.5, 1])
    };
  });

  // Safe way to get actor name
  const getActorName = (): string => {
    if (actor.isPlaceholder) return "Loading...";
    return actor.actorName || "Unknown Actor";
  };

  // Safe way to get actor age
  const getActorAge = (): string => {
    if (actor.isPlaceholder || !actor.age) return "";
    return `${actor.age} yrs`;
  };

  // Safe way to render image
  const renderActorImage = (): React.JSX.Element => {
    if (loading || actor.isPlaceholder) {
      return (
        <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
      );
    }

    try {
      return (
        <Image
          source={{ uri: fallbackImage ? DEFAULT_IMAGE : actor.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setFallbackImage(true)}
        />
      );
    } catch (error) {
      console.error("Image rendering error:", error);
      return (
        <View className="flex-1 w-full h-full bg-gray-200 justify-center items-center">
          <Text className="text-gray-500">Image not available</Text>
        </View>
      );
    }
  };

  const handlePress = () => {
    if (!actor.isPlaceholder) {
      itemCardScale.value = withSequence(
        withTiming(0.97, { duration: 100 }),
        withSpring(1, { damping: 4, stiffness: 300 })
      );
      onPress(actor);
    }
  };

  return (
    <AnimatedPressable
      style={[cardAnimStyle, style]}
      className="overflow-hidden rounded-xl elevation-3"
      onPress={handlePress}
    >
      <Box
        className="bg-background-50 rounded-xl overflow-hidden"
        style={{ width: cardWidth, height: cardHeight }}
      >
        <View style={{ width: "100%", height: "100%" }}>
          {renderActorImage()}
        </View>
        
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            justifyContent: 'flex-end',
            paddingHorizontal: 12,
            paddingBottom: 12
          }}
        >
          <Text className="text-white font-semibold text-base">{getActorName()}</Text>
          
          {!actor.isPlaceholder && (
            <HStack className="mt-1 items-center">
              {actor.age && (
                <HStack className="items-center mr-3">
                  <FontAwesome name="calendar" size={10} color="#f3f4f6" />
                  <Text className="text-gray-200 text-xs ml-1">{getActorAge()}</Text>
                </HStack>
              )}
              
              {actor.height && (
                <HStack className="items-center">
                  <FontAwesome name="arrows-v" size={10} color="#f3f4f6" />
                  <Text className="text-gray-200 text-xs ml-1">{actor.height}</Text>
                </HStack>
              )}
            </HStack>
          )}
        </LinearGradient>
      </Box>
    </AnimatedPressable>
  );
};

export default ActorCard;
