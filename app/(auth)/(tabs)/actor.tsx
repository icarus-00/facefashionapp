import React, { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { View, Image, Dimensions, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * 1.5;

// Define default image
const DEFAULT_IMAGE = "https://placehold.co/900x1600";

// Create a union type for actor data items
type ActorItem = ActorWithImage | { id: number; isPlaceholder: true };

// Props for ActorCard component
interface ActorCardProps {
  item: ActorItem;
  loading: boolean;
  index: number;
}

export default function Actor(): React.JSX.Element {
  const [actors, setActors] = useState<ActorWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await databaseService.listActors();
        console.log(data);
        setActors(data);
      } catch (error) {
        console.error("Error fetching actors: ", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    if (refreshing) {
      fetchData();
    }
  }, [refreshing]);

  // Actor card component with placeholder
  function ActorCard({
    item,
    loading,
    index,
  }: ActorCardProps): React.JSX.Element {
    const [fallbackImage, setFallbackImage] = useState<boolean>(false);
    const router = useRouter();
    // Check if item is a placeholder
    const isPlaceholder = "isPlaceholder" in item;

    // Safe way to get actor name
    const getActorName = (): string => {
      if (isPlaceholder) return "Loading...";
      return item.actorName || "Unknown Actor";
    };

    // Safe way to render image
    const renderActorImage = (): React.JSX.Element => {
      if (loading || isPlaceholder) {
        return (
          <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
        );
      }

      try {
        // Use the imageUrl from ActorWithImage
        const actorItem = item as ActorWithImage;
        return (
          ///backlog: fix images biggger than 1 mb not rendering
          <Image
            source={{ uri: fallbackImage ? DEFAULT_IMAGE : actorItem.imageUrl }}
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

    return (
      <Pressable
        className="overflow-hidden rounded-lg shadow-md"
        style={{ width: itemWidth, margin: spacing / 2 }}
        onPress={() => {
          if (!("isPlaceholder" in item)) {
            router.push({
              pathname: "../actor/[get]",
              params: { id: item.$id },
            });
          }
        }}
      >
        <Box
          className="bg-background-100 rounded-lg overflow-hidden"
          style={{ width: itemWidth, height: itemHeight }}
        >
          <View style={{ width: "100%", height: "100%" }}>
            {renderActorImage()}
            <View className="absolute bottom-0 w-full bg-black/50 p-2">
              <Text className="text-white font-medium text-center">
                {getActorName()}
              </Text>
            </View>
          </View>
        </Box>
      </Pressable>
    );
  }

  const TabBar = (): React.JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<string>("All");

    const handleTabPress = (tab: string): void => {
      setSelectedTab(tab);
    };

    return (
      <View className="flex-row justify-between items-center bg-white shadow-md px-4 py-2">
        <FlatList
          data={["All", "Popular", "Top Rated", "Upcoming", "Now Playing"]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Button
              className={`mx-1 rounded-md ${
                selectedTab === item ? "bg-primary-400" : "bg-gray-100"
              }`}
              onPress={() => handleTabPress(item)}
            >
              <ButtonText
                className={`${
                  selectedTab === item ? "text-white" : "text-typography-500"
                }`}
              >
                {item}
              </ButtonText>
            </Button>
          )}
          keyExtractor={(item) => item}
        />
        <Button
          size="md"
          variant="outline"
          className="rounded-full h-[3.5] w-[3.5] border-black p-3.5"
        >
          <ButtonIcon className="text-black" size="md" as={AddIcon} />
        </Button>
      </View>
    );
  };

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): ActorItem[] => {
    return Array.from({ length: 4 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }));
  };

  const displayData: ActorItem[] = loading ? getPlaceholderData() : actors;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1">
        <TabBar />
        <FlashList
          data={displayData}
          estimatedItemSize={itemHeight}
          renderItem={({ item, index }) => (
            <ActorCard item={item} loading={loading} index={index} />
          )}
          keyExtractor={(item, index) => {
            if ("isPlaceholder" in item) {
              return `placeholder-${item.id}`;
            }
            return item.$id || `item-${index}`;
          }}
          numColumns={numColumns}
          contentContainerClassName="px-2 py-2"
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
          }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500">No actors found</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
