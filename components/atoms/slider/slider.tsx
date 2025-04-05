import { Text, View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Image } from "expo-image";
import { SliderProps } from "./interface";
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import Animated, {
  useSharedValue,
  useDerivedValue,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");

// Individual dot component with animations
const DotItem = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  // Create animated width using useDerivedValue
  const dotWidth = useDerivedValue(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    return interpolate(
      scrollX.value,
      inputRange,
      [30, 15, 30], // Min width, Max width, Min width
      Extrapolation.CLAMP
    );
  });

  // Create animated opacity for more visual feedback
  const dotOpacity = useDerivedValue(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    return interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
  });

  return (
    <Animated.View
      style={{
        width: dotWidth,
        height: 8,
        backgroundColor: "#553ea0",
        borderRadius: 5,
        marginHorizontal: 5,
        opacity: dotOpacity,
      }}
    />
  );
};

const Pagination = ({
  data,
  scrollX,
}: {
  data: SliderProps[];
  scrollX: SharedValue<number>;
}) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => (
        <DotItem key={i} index={i} scrollX={scrollX} />
      ))}
    </View>
  );
};

// Use forwardRef to make the component accept a ref
const Slider = forwardRef(
  (
    {
      data,
      onSlideChange,
    }: {
      data: SliderProps[];
      onSlideChange?: (index: number) => void;
    },
    ref
  ) => {
    // Create shared value to track scroll position
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      goToSlide: (index: number) => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index, animated: true });
        }
      },
    }));

    const handleScroll = (event: any) => {
      // Update shared value on scroll
      scrollX.value = event.nativeEvent.contentOffset.x;

      // Calculate current index and notify parent component
      const slideIndex = Math.round(scrollX.value / width);
      if (onSlideChange) {
        onSlideChange(slideIndex);
      }
    };

    return (
      <View style={styles.container}>
        {/* Main content that scrolls */}
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item }) => (
            <View style={styles.slideItemContainer}>
              {/* Image section - top 60% */}
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.image}
                  contentFit="contain"
                />
              </View>

              {/* Text section - bottom 40% */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        {/* Fixed pagination overlay */}
        <Pagination data={data} scrollX={scrollX} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  slideItemContainer: {
    width,
    height: "100%",
    flexDirection: "column",
  },
  imageContainer: {
    height: "60%", // Top 60% for image
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    height: "40%", // Bottom 40% for text
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    paddingTop: 20, // Extra padding to make room for pagination
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  paginationContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // Position at the boundary between image and text
    top: "65%",
    paddingVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: semi-transparent background for better visibility
    zIndex: 10,
  },
});

export default Slider;
