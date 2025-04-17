import React from "react";
import { View, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Badge, BadgeText, ThirdPartyBadgeIcon } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { generationsWithImage } from "@/services/database/db";

interface GenerationImageViewProps {
  item: generationsWithImage;
  isLoading: boolean;
  height: number;
}

export const GenerationImageView: React.FC<GenerationImageViewProps> = ({
  item,
  isLoading,
  height,
}) => {
  if (isLoading) {
    return (
      <View style={{ width: "100%", height }} className="p-5">
        <Skeleton className="w-full h-full rounded-xl bg-gray-200" speed={4} />
      </View>
    );
  }

  if (item.state === "failed") {
    return (
      <View
        style={{ width: "100%", height }}
        className="p-5 items-center justify-center"
      >
        <View className="rounded-xl bg-red-50 w-full h-full items-center justify-center">
          <Ionicons name="warning" size={64} color="#ef4444" />
          <Text className="text-red-500 font-bold text-xl mt-4">
            Generation Failed
          </Text>
          <Text className="text-red-400 text-center mt-2 mx-8">
            There was an error processing your request
          </Text>
        </View>
      </View>
    );
  }

  if (item.state === "generating") {
    return (
      <View style={{ width: "100%", height }} className="p-5">
        <Skeleton className="w-full h-full rounded-xl bg-blue-100" speed={4} />
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-blue-700 font-bold">Generating...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: "100%", height }} className="p-5">
      <View className="w-full h-full">
        <Image
          className="w-full h-full rounded-xl"
          source={{ uri: item.generationImageUrl }}
          resizeMode="cover"
        />

        <Badge
          className="z-10"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <ThirdPartyBadgeIcon
            icon={Ionicons}
            iconProps={{ name: "image" }}
            color="black"
          />
          <BadgeText style={{ fontSize: 12 }}>Image</BadgeText>
        </Badge>
      </View>
    </View>
  );
};
