import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { icons } from '@/constants/icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: icons.personb,
    title: 'Virtual Costume Fitting\nfor Cinema Professionals',
    description: 'Upload outfit images and visualize them, streamlining costume design for your productions.',
  },
  {
    id: '2',
    image: icons.untitled,
    title: 'Personalized Virtual Try-\nOn Experiences',
    description: 'Create from your photos to virtually try on outfits, ensuring the perfect look before making a choice.',
  },
  {
    id: '3',
    image: icons.starb,
    title: 'AI-Powered Custom\nOutfit Generation',
    description: 'Describe your fashion ideas, and our AI transforms them into unique outfit designs.',
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to home screen
      router.replace('/(tabs)');
    }
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => {
    return (
      <View className="w-full items-center px-8 pt-16" style={{ width }}>
        <View className="h-[500px] justify-center items-center mb-10">
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            className="w-[300px] h-[400px]"
            resizeMode="cover"
          />
        </View>
        
        <View className="flex-row mb-6">
          {slides.map((_, index) => (
            <View 
              key={index} 
              className={`w-8 h-2 rounded mx-1 ${index === currentIndex ? 'bg-black' : 'bg-gray-200'}`}
            />
          ))}
        </View>

        <Text className="text-2xl font-bold text-center text-black mb-5">{item.title}</Text>
        <Text className="text-base text-center text-gray-600 mb-10 leading-6">{item.description}</Text>
        
        <TouchableOpacity 
          className="bg-black py-4 px-8 rounded-full w-full items-center" 
          onPress={handleNext}
        >
          <Text className="text-white text-lg font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
};

export default Onboarding;
