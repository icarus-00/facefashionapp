import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

interface TabButtonsProps {
  currentIndex: number;
  onImagePress: () => void;
  onVideoPress: () => void;
  videoType: "video" | "create-video";
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  currentIndex,
  onImagePress,
  onVideoPress,
  videoType,
}) => {
  return (
    <View className="absolute bottom-6 left-0 right-0 flex-row justify-center space-x-4">
      <Button
        variant={currentIndex === 0 ? "solid" : "outline"}
        onPress={onImagePress}
        className={currentIndex === 0 ? "bg-blue-500" : "bg-white"}
      >
        <Ionicons
          name={currentIndex === 0 ? "image" : "image-outline"}
          size={20}
          color={currentIndex === 0 ? "white" : "#3b82f6"}
          style={{ marginRight: 8 }}
        />
        <Text
          className={
            currentIndex === 0
              ? "text-white font-medium"
              : "text-blue-500 font-medium"
          }
        >
          Image
        </Text>
      </Button>

      <Button
        variant={currentIndex === 1 ? "solid" : "outline"}
        onPress={onVideoPress}
        className={currentIndex === 1 ? "bg-blue-500" : "bg-white"}
      >
        <Ionicons
          name={
            currentIndex === 1
              ? videoType === "video"
                ? "videocam"
                : "add-circle"
              : videoType === "video"
              ? "videocam-outline"
              : "add-circle-outline"
          }
          size={20}
          color={currentIndex === 1 ? "white" : "#3b82f6"}
          style={{ marginRight: 8 }}
        />
        <Text
          className={
            currentIndex === 1
              ? "text-white font-medium"
              : "text-blue-500 font-medium"
          }
        >
          {videoType === "video" ? "Video" : "Create Video"}
        </Text>
      </Button>
    </View>
  );
};
