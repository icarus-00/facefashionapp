import { FlashList } from "@shopify/flash-list";
import databaseService, { generationsWithImage } from "@/services/database/db";
import { View, Text, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  Badge,
  BadgeIcon,
  BadgeText,
  ThirdPartyBadgeIcon,
} from "@/components/ui/badge";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";

const VidecamIcon = (props: any) => (
  <Ionicons name="videocam" size={props.size || 24} {...props} />
);
const { width: screenWidth } = Dimensions.get("window");
function GenerationView({ item }: { item: generationsWithImage }) {
  return (
    <View className="flex-1 flex-row items-center justify-center w-full h-full p-10">
      <View style={{ width: "100%", height: "100%" }}>
        <Image
          className="w-full h-full rounded-md"
          source={{ uri: item.generationImageUrl }}
          resizeMode="cover"
        />

        <Badge
          className="z-10"
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          <ThirdPartyBadgeIcon
            icon={Ionicons}
            iconProps={{ name: "videocam" }}
            color="black"
          />
          <BadgeText style={{ fontSize: 12 }}>Video</BadgeText>
        </Badge>
      </View>
    </View>
  );
}

export default function GetGeneration({ id }: { id: string }) {
  const [generationsData, setGenerationsData] =
    useState<generationsWithImage>();

  useEffect(() => {
    databaseService.getGeneration(id).then((data) => {
      setGenerationsData(data);
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {generationsData && <GenerationView item={generationsData} />}
    </SafeAreaView>
  );
}
