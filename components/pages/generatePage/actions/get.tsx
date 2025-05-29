import { FlashList } from "@shopify/flash-list";
import databaseService, { generationsWithImage } from "@/services/database/db";
import {
  View,
  Text,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import { useEffect, useState, useRef } from "react";
import {
  Badge,
  BadgeIcon,
  BadgeText,
  ThirdPartyBadgeIcon,
} from "@/components/ui/badge";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { router } from "expo-router";
import mockDatabaseService from "@/services/database/mockDb";
import { useUser } from "@/context/authcontext";
import useStore from '@/store/lumaGeneration/useStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const ItemHeight = screenHeight * 0.85; // Reduced height to make room for buttons below

// Image Component
function GenerationImageView({
  item,
  isLoading,
  height,
}: {
  item: generationsWithImage;
  isLoading: boolean;
  height: number;
}) {
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
}

// Video Player Component
function VideoPlayer({
  videoUri,
  height,
  onTabChange,
}: {
  videoUri: string;
  height: number;
  onTabChange?: (index: number) => void;
}) {
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });

  // Subscribe to playing change event

  // Update time manually with interval

  // Clear timeout on unmount

  return (
    <View style={{ width: "100%", height }} className="p-5">
      <VideoView
        style={{ width: "100%", height: "100%", borderRadius: 12 }}
        player={player}
        allowsFullscreen={true}
        nativeControls
      />
    </View>
  );
}

// Video View Component
function GenerationVideoView({
  item,
  isLoading,
  height,
  onCreateVideo,
  onRetryVideo,
  onTabChange,
}: {
  item: generationsWithImage;
  isLoading: boolean;
  height: number;
  onCreateVideo: () => void;
  onRetryVideo: () => void;
  onTabChange?: (index: number) => void;
}) {
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

  return (
    <VideoPlayer
      videoUri={item.videoUrl}
      height={height}
      onTabChange={onTabChange}
    />
  );
}

// Create Video Component
function CreateVideoItem({
  onPress,
  height,
}: {
  onPress: () => void;
  height: number;
}) {
  return (
    <View
      style={{ width: "100%", height }}
      className="p-5 items-center justify-center"
    >
      <TouchableOpacity
        className="bg-gray-100 rounded-xl w-full h-full items-center justify-center"
        onPress={onPress}
      >
        <View className="items-center">
          <Ionicons name="add-circle" size={80} color="#3b82f6" />
          <Text className="text-blue-500 font-bold text-xl mt-4">
            Create Video
          </Text>
          <Text className="text-gray-500 text-center mt-2 mx-8">
            Transform your image into motion
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Button Group Component (renamed from TabButtons)
function ButtonGroup({
  currentIndex,
  onImagePress,
  onVideoPress,
  videoType,
  onDescriptionPress,
  onDeletePress,
}: {
  currentIndex: number;
  onImagePress: () => void;
  onVideoPress: () => void;
  videoType: "video" | "create-video";
  onDescriptionPress: () => void;
  onDeletePress: () => void;
}) {
  return (
    <View className="bg-secondary-300 rounded-t-3xl shadow-lg py-4 px-4 overflow-hidden">
      {/* Tab Buttons */}

      {/* Action Buttons */}
      <View className="flex-row justify-evenly px-2 gap-3">
        <TouchableOpacity
          className="flex-1 flex-row items-center py-2 px-4 bg-secondary-200 rounded-full"
          onPress={onDescriptionPress}
        >
          <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
          <Text className="text-blue-500 font-bold text-xl ml-2">
            Description
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-2 px-4 bg-red-200 rounded-full"
          onPress={onDeletePress}
        >
          <Ionicons name="trash-sharp" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-2">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Component
export default function GetGeneration({ id }: { id: string }) {
  const [generationsData, setGenerationsData] =
    useState<generationsWithImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashListRef = useRef<FlashList<any>>(null);
  const { testMode } = useUser();
  const service = testMode.enabled ? mockDatabaseService : databaseService;
  const { setVideoGenInput } = useStore();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await service.getGeneration(id);
      setGenerationsData(data);
    } catch (error) {
      console.error("Failed to fetch generation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleCreateVideo = () => {
    // Store videoGenInput in the global store
    setVideoGenInput({ documentId: id, videoprompt: "" });
    router.push('/(app)/(auth)/(tabs)/(generation)/chat')
    // Optionally, navigate to the chat/generation screen if needed
    // router.push('/(app)/(auth)/(tabs)/(generation)/chat');
  };

  const handleRetryVideo = () => {
    console.log("Retry video generation for:", id);
    fetchData();
  };

  const handleDescriptionPress = () => {
    console.log("Description pressed for generation ID:", id);
    // You can implement a modal or navigation to show description details
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Generation",
      "Are you sure you want to delete this generation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => { databaseService.deleteGeneration(generationsData?.$id!, generationsData?.generatedFileId!).then(router.back) },
        },
      ]
    );
  };

  useEffect(() => {
    fetchData();

    // Poll for updates if generation is in progress
    const intervalId = setInterval(() => {
      if (
        generationsData?.state === "generating" ||
        generationsData?.videoGeneration === "generating"
      ) {
        fetchData();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [id]);

  // Generate data for FlashList
  const getListData = () => {
    if (!generationsData) return [];

    const items = [];

    // Image item
    items.push({
      id: "image",
      type: "image",
      data: generationsData,
    });

    // Video or create video item
    if (
      generationsData.has_Motion ||
      generationsData.videoGeneration !== "no-video"
    ) {
      items.push({
        id: "video",
        type: "video",
        data: generationsData,
      });
    } else {
      items.push({
        id: "create-video",
        type: "create-video",
      });
    }

    return items;
  };

  const getVideoType = () => {
    if (!generationsData) return "create-video";
    if (
      generationsData.has_Motion ||
      generationsData.videoGeneration !== "no-video"
    ) {
      return "video";
    }
    return "create-video";
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "image":
        return (
          <GenerationImageView
            item={item.data}
            isLoading={isLoading}
            height={ItemHeight}
          />
        );
      case "video":
        return (
          <GenerationVideoView
            item={item.data}
            isLoading={isLoading}
            height={ItemHeight}
            onCreateVideo={handleCreateVideo}
            onRetryVideo={handleRetryVideo}
            onTabChange={setCurrentIndex}
          />
        );
      case "create-video":
        return (
          <CreateVideoItem onPress={handleCreateVideo} height={ItemHeight} />
        );
      default:
        return null;
    }
  };

  const navigateToImage = () => {
    flashListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const navigateToVideo = () => {
    if (getListData().length > 1) {
      flashListRef.current?.scrollToIndex({ index: 1, animated: true });
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      className="relative"
    >
      <View className=" flex-row px-5 justify-between items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {isLoading && !generationsData ? (
        <View className="flex-1 p-5">
          <Skeleton
            className="w-full h-full rounded-xl bg-gray-200"
            speed={4}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            ref={flashListRef}
            data={getListData()}
            renderItem={renderItem}
            estimatedItemSize={ItemHeight}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0);
              }
            }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          {(generationsData?.state == "failed" || "completed") && (
            <ButtonGroup
              currentIndex={currentIndex}
              onImagePress={navigateToImage}
              onVideoPress={navigateToVideo}
              videoType={getVideoType()}
              onDescriptionPress={handleDescriptionPress}
              onDeletePress={handleDeletePress}
            />)}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    height: 140,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  centerControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    height: 20,
    position: "relative",
    justifyContent: "center",
  },
  progressTouchable: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    position: "absolute",
    top: -10,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  progressHandle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    position: "absolute",
    top: 2,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: "white",
  },
});

{
  /*<View className="flex-row justify-center space-x-4 mb-4">
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
      */
}
