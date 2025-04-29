import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay 
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface ImageSkeletonProps {
  height?: number;
  width?: number;
  borderRadius?: number;
}

const ImageSkeleton = ({ 
  height = 300, 
  width = width - 40, 
  borderRadius = 8 
}: ImageSkeletonProps) => {
  const opacity = useSharedValue(0.5);

  // Create shimmer effect
  React.useEffect(() => {
    opacity.value = withRepeat(
      withDelay(
        300,
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View 
      style={[
        styles.container, 
        { height, width, borderRadius }
      ]}
    >
      <Animated.View 
        style={[
          styles.shimmer,
          animatedStyle,
          { height, width: width * 2, borderRadius }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  shimmer: {
    backgroundColor: "#F5F5F5",
    position: "absolute",
    top: 0,
    left: -width,
    right: 0,
    bottom: 0,
  },
});

export default ImageSkeleton;