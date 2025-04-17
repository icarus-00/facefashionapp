import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, BadgeText, ThirdPartyBadgeIcon } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generationsWithImage } from "@/services/database/db";
import { useVideoPlayer, VideoView } from "expo-video";

interface GenerationVideoViewProps {
  item: generationsWithImage;
  isLoading: boolean;
  height: number;
  onCreateVideo: () => void;
  onRetryVideo: () => void;
}

export const GenerationVideoView: React.FC<GenerationVideoViewProps> = ({
  item,
  isLoading,
  height,
  onCreateVideo,
  onRetryVideo,
}) => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={{ width: "100%", height }} className="p-5">
        <Skeleton className="w-full h-full rounded-xl bg-gray-200" speed={4} />
      </View>
    );
  }

  if (!item.videoUrl || item.videoGeneration === "no-video") {
    return (
      <View
        style={{ width: "100%", height }}
        className="p-5 items-center justify-center"
      >
        <View className="rounded-xl bg-gray-50 w-full h-full items-center justify-center">
          <Ionicons name="videocam-outline" size={64} color="#9ca3af" />
          <Text className="text-gray-500 font-medium text-xl mt-4">
            No Video Available
          </Text>
          <TouchableOpacity
            className="mt-6 bg-blue-500 rounded-lg px-6 py-3 flex-row items-center"
            onPress={onCreateVideo}
          >
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Generate Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (item.videoGeneration === "generating") {
    return (
      <View style={{ width: "100%", height }} className="p-5">
        <Skeleton className="w-full h-full rounded-xl bg-blue-100" speed={4} />
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-blue-700 font-bold">Generating Video...</Text>
        </View>
      </View>
    );
  }

  if (item.videoGeneration === "failed") {
    return (
      <View
        style={{ width: "100%", height }}
        className="p-5 items-center justify-center"
      >
        <View className="rounded-xl bg-red-50 w-full h-full items-center justify-center">
          <Ionicons name="warning" size={64} color="#ef4444" />
          <Text className="text-red-500 font-bold text-xl mt-4">
            Video Generation Failed
          </Text>
          <Text className="text-red-400 text-center mt-2 mx-8">
            There was an error processing your video request
          </Text>
          <TouchableOpacity
            className="mt-6 bg-blue-500 rounded-lg px-6 py-3 flex-row items-center"
            onPress={onRetryVideo}
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text className="text-white font-medium ml-2">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <VideoView uri={item.videoUrl} height={height} />;
};
