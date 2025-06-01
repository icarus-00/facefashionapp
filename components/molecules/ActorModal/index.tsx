import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Button, ButtonText } from '@/components/ui/button';

const windowDimensions = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ActorDetailProps {
  actorName?: string;
  imageUrl?: string;
  fileID?: string;
  age?: number;
  height?: string;
  weight?: string;
  bio?: string;
  isVisible: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const ActorModal: React.FC<ActorDetailProps> = ({
  actorName = "Unknown Actor",
  imageUrl,
  fileID,
  age,
  height,
  weight,
  bio,
  isVisible,
  onClose,
  onEdit,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const [expanded, setExpanded] = useState(false);

  // Animation styles
  const imageAnimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Handle modal appearance animations
  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withSequence(
        withTiming(1.05, { duration: 300 }),
        withSpring(1, { damping: 8 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.9, { duration: 300 });
    }
  }, [isVisible, opacity, scale]);

  const toggleBioExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.7}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      propagateSwipe
    >
      <Animated.View
        entering={SlideInDown.duration(400)}
        exiting={SlideOutDown.duration(300)}
        className="bg-white rounded-t-3xl overflow-hidden"
        style={{ 
          maxHeight: windowDimensions.height * 0.92,
          width: '100%'
        }}
      >
        {/* Modal drag indicator */}
        <View className="w-full items-center py-2">
          <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </View>

        <ScrollView 
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Actor Image */}
          <Box className="relative overflow-hidden" style={{ height: windowDimensions.height * 0.55 }}>
            <Animated.View style={[imageAnimStyle]} className="h-full w-full">
              <Image
                source={{ uri: imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              
              {/* Image gradient overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  justifyContent: 'flex-end',
                  padding: 16
                }}
              >
                <Animated.Text 
                  entering={FadeIn.delay(200).duration(400)}
                  className="text-white text-4xl font-semibold"
                >
                  {actorName}
                </Animated.Text>
              </LinearGradient>
            </Animated.View>
            
            {/* Close button */}
            <AnimatedTouchableOpacity
              entering={FadeIn.delay(400).duration(300)}
              onPress={onClose}
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-10"
            >
              <FontAwesome name="close" size={20} color="#fff" />
            </AnimatedTouchableOpacity>
            
            {/* Edit button */}
            {onEdit && (
              <AnimatedTouchableOpacity
                entering={FadeIn.delay(400).duration(300)}
                onPress={onEdit}
                className="absolute top-4 left-4 bg-black/50 rounded-full p-2 z-10"
              >
                <FontAwesome name="edit" size={20} color="#fff" />
              </AnimatedTouchableOpacity>
            )}
          </Box>
          
          {/* Actor details */}
          <VStack className="px-5 py-6">
            <HStack className="justify-between mb-6">
              {age && (
                <Animated.View 
                  entering={FadeIn.delay(300).duration(400)}
                  className="items-center"
                >
                  <HStack className="items-center mb-1 justify-center">
                    <FontAwesome name="calendar" size={14} color="#4b5563" className="mr-1" />
                    <Text className="text-gray-500 text-sm ml-1">Age</Text>
                  </HStack>
                  <Text className="text-gray-800 text-base font-semibold">{age} years</Text>
                </Animated.View>
              )}
              
              {height && (
                <Animated.View 
                  entering={FadeIn.delay(350).duration(400)}
                  className="items-center"
                >
                  <HStack className="items-center mb-1 justify-center">
                    <FontAwesome name="arrows-v" size={14} color="#4b5563" className="mr-1" />
                    <Text className="text-gray-500 text-sm ml-1">Height</Text>
                  </HStack>
                  <Text className="text-gray-800 text-base font-semibold">{height}</Text>
                </Animated.View>
              )}
              
              {weight && (
                <Animated.View 
                  entering={FadeIn.delay(400).duration(400)}
                  className="items-center"
                >
                  <HStack className="items-center mb-1 justify-center">
                    <FontAwesome name="balance-scale" size={14} color="#4b5563" className="mr-1" />
                    <Text className="text-gray-500 text-sm ml-1">Weight</Text>
                  </HStack>
                  <Text className="text-gray-800 text-base font-semibold">{weight}</Text>
                </Animated.View>
              )}
            </HStack>
            
            {/* Bio section */}
            {bio && (
              <Animated.View 
                entering={SlideInDown.delay(450).duration(400)}
                className="mb-6"
              >
                <Text className="text-gray-500 text-sm mb-2">Biography</Text>
                <Text 
                  className="text-gray-800 leading-6"
                  numberOfLines={expanded ? undefined : 4}
                >
                  {bio}
                </Text>
                {bio.length > 150 && (
                  <TouchableOpacity
                    onPress={toggleBioExpand}
                    className="mt-2"
                  >
                    <Text className="text-primary-600 font-medium">
                      {expanded ? "Read less" : "Read more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            )}
            
            {/* Action buttons */}
            <Animated.View
              entering={SlideInDown.delay(500).duration(400)}
              className="mt-4"
            >
              <Button 
                className="bg-primary-500 rounded-full" 
                onPress={onEdit || onClose}
              >
                <ButtonText>
                  {onEdit ? "Edit Actor" : "Close"}
                </ButtonText>
              </Button>
            </Animated.View>
          </VStack>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default ActorModal;
