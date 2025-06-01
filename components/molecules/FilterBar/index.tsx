import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { Text } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  ZoomIn,
  interpolate,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface FilterOption {
  id: string;
  label: string;
  icon?: keyof typeof FontAwesome.glyphMap;
}

interface FilterBarProps {
  options: FilterOption[];
  onFilterChange: (selectedOption: string) => void;
  initialFilter?: string;
  containerStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  inactiveTabStyle?: ViewStyle;
  activeTextStyle?: TextStyle;
  inactiveTextStyle?: TextStyle;
  title?: string;
  rightComponent?: React.ReactNode;
  showIcons?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  options,
  onFilterChange,
  initialFilter,
  containerStyle,
  activeTabStyle,
  inactiveTabStyle,
  activeTextStyle,
  inactiveTextStyle,
  title = "Filter",
  rightComponent,
  showIcons = false,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter || (options.length > 0 ? options[0].id : ''));
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(1, { duration: 800 });
  }, []);

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: animatedValue.value,
    transform: [{ translateY: interpolate(animatedValue.value, [0, 1], [-20, 0]) }],
  }));

  return (
    <Animated.View 
      style={[containerAnimStyle, containerStyle]} 
      className="mx-4 bg-white"
    >
      <HStack className="justify-between items-center mb-3">
        <Animated.Text 
          entering={FadeIn.delay(300).duration(400)}
          className="text-2xl font-bold text-gray-800"
        >
          {title}
        </Animated.Text>
        
        {rightComponent ? (
          <Animated.View entering={ZoomIn.delay(400).duration(300)}>
            {rightComponent}
          </Animated.View>
        ) : null}
      </HStack>
      
      <HStack space="md" className="overflow-visible">
        <FlatList
          data={options}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <AnimatedTouchable
              entering={FadeIn.delay(300 + index * 50).duration(300)}
              onPress={() => handleFilterSelect(item.id)}
              className={`py-3 px-4 mr-2 rounded-full`}
              style={[
                selectedFilter === item.id 
                  ? [{ backgroundColor: '#0f0d23' }, activeTabStyle] 
                  : [{ backgroundColor: '#f3f4f6' }, inactiveTabStyle]
              ]}
            >
              <HStack space="md" className="items-center">
                {showIcons && item.icon && (
                  <FontAwesome 
                    name={item.icon} 
                    size={14} 
                    color={selectedFilter === item.id ? '#ffffff' : '#4b5563'} 
                  />
                )}
                <Text
                  className={`font-medium`}
                  style={[
                    selectedFilter === item.id 
                      ? [{ color: '#ffffff' }, activeTextStyle] 
                      : [{ color: '#4b5563' }, inactiveTextStyle]
                  ]}
                >
                  {item.label}
                </Text>
              </HStack>
            </AnimatedTouchable>
          )}
        />
      </HStack>
    </Animated.View>
  );
};

export default FilterBar;
