import { ThemedView } from "@/components/ThemedView";
import { View, Image, Dimensions, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import { useState, useEffect, useRef } from "react";
import databaseService from "@/services/database/db";
import { AntDesign } from "@expo/vector-icons";
import {
  ButtonGroup,
  Button,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { EditIcon, AddIcon } from "@/components/ui/icon";

// Calculate dimensions
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

// Fixed height with proper aspect ratio for full-body actor photos (2:3 aspect ratio)
const itemHeight = itemWidth * 1.5;

export default function Actor() {
  const [actors, setActors] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    // This would be your actual API call
    setTimeout(() => {
      setActors([
        { id: "1", name: "John Doe", image: "https://example.com/1.jpg" },
        { id: "2", name: "Jane Smith", image: "https://example.com/2.jpg" },
        { id: "3", name: "Chris Evans", image: "https://example.com/3.jpg" },
        {
          id: "4",
          name: "Scarlett Johansson",
          image: "https://example.com/4.jpg",
        },
        {
          id: "5",
          name: "Robert Downey Jr.",
          image: "https://example.com/5.jpg",
        },
        { id: "6", name: "Zendaya", image: "https://example.com/6.jpg" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  // Actor card component with placeholder
  const ActorCard = ({ item, loading }) => (
    <Pressable
      className="overflow-hidden rounded-lg shadow-md"
      style={{ width: itemWidth, margin: spacing / 2 }}
    >
      <Box
        className="bg-background-100 rounded-lg overflow-hidden"
        style={{ width: itemWidth, height: itemHeight }}
      >
        {loading ? (
          <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
        ) : (
          <>
            <View style={{ width: "100%", height: "100%" }}>
              <Image
                source={{ uri: item.image }}
                className="w-full h-full rounded-t-lg"
                style={{ resizeMode: "cover" }}
              />
              <View className="absolute bottom-0 w-full bg-black/50 p-2">
                <Text className="text-white font-medium text-center">
                  {item.name}
                </Text>
              </View>
            </View>
          </>
        )}
      </Box>
    </Pressable>
  );

  const TabBar = () => {
    const [selectedTab, setSelectedTab] = useState("All");

    const handleTabPress = (tab) => {
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
  databaseService.init();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1">
        <TabBar />
        <FlashList
          data={loading ? [...Array(6).keys()] : actors}
          estimatedItemSize={itemHeight}
          renderItem={({ item }) => <ActorCard item={item} loading={loading} />}
          keyExtractor={(item) => (loading ? item.toString() : item.id)}
          numColumns={numColumns}
          contentContainerClassName="px-2 py-2"
          showsVerticalScrollIndicator={false}
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
