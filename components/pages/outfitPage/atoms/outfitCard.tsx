import { Box } from "@/components/ui/box";
import { OutfitWithImage } from "@/interfaces/outfitDB";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 2;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * 1.777;
const DEFAULT_IMAGE = "https://placehold.co/900x1600";

// Create a union type for outfit data items
type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true };

// Props for OutfitCard component
interface OutfitCardProps {
  item: OutfitItem;
  loading: boolean;
  index: number;
  selected?: boolean;
  onLongPress?: () => void;
  onPress: () => void;
  selecting: boolean | false;
}
export default function OutfitCard({
  item,
  loading,
  index,
  selected,
  onLongPress,
  onPress,
  selecting,
}: OutfitCardProps): React.JSX.Element {
  const [fallbackImage, setFallbackImage] = useState<boolean>(false);
  const router = useRouter();
  // Check if item is a placeholder
  const isPlaceholder = "isPlaceholder" in item;

  // Safe way to get outfit name
  const getOutfitName = (): string => {
    if (isPlaceholder) return "Loading...";
    return item.outfitName || "Unknown outfit";
  };

  // Safe way to render image
  const renderOutfitImage = (): React.JSX.Element => {
    if (loading || isPlaceholder) {
      return (
        <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
      );
    }

    try {
      // Use the imageUrl from OutfitWithImage
      const outfitItem = item as OutfitWithImage;
      return (
        <Image
          source={{
            uri: fallbackImage ? DEFAULT_IMAGE : outfitItem.imageUrl,
          }}
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

  const Item = () => {
    return (
      <Pressable onPress={onPress}>
        <View
          className={`"overflow-hidden rounded-sm shadow-md shadow-black  " ${""}`}
          style={{ width: itemWidth, height: itemHeight, margin: spacing / 2 }}
        >
          <Box
            className="bg-background-100 rounded-sm overflow-hidden"
            style={{ width: itemWidth, height: itemHeight }}
          >
            <View style={{ width: "100%", height: "100%" }}>
              {renderOutfitImage()}
            </View>
          </Box>
        </View>
      </Pressable>
    );
  };

  if (selecting && onLongPress) {
    const LongPressGesture = Gesture.LongPress()
      .runOnJS(true)
      .onStart(() => {
        console.log("Long press started");
        onLongPress();
      });

    return (
      <GestureDetector gesture={LongPressGesture}>
        <Item />
      </GestureDetector>
    );
  } else {
    return <Item />;
  }
}
