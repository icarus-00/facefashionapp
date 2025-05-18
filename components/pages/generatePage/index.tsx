import React, { useState, useEffect, useCallback } from "react";
import { Dimensions, View, Pressable } from "react-native";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import { FlashList } from "@shopify/flash-list";
import { Image } from "react-native";
import { Text } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, ButtonText } from "@/components/ui/button";

import { EvilIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import databaseService, { generationsWithImage } from "@/services/database/db";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

// Define constants for layout
const { width: screenWidth } = Dimensions.get("window");
const numColumns = 2;
const spacing = 8;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
// 9:16 aspect ratio for image
const itemHeight = itemWidth * (16 / 9);

// Extended type to include placeholder state
type GenerationItem =
  | (generationsWithImage & { has_Motion?: boolean })
  | { id: number; isPlaceholder: true };

// Generation Card Component
const GenerationCard = ({
  item,
  loading = false,
}: {
  item: GenerationItem;
  loading?: boolean;
}): React.JSX.Element => {
  const [imageError, setImageError] = useState(false);
  const isPlaceholder = "isPlaceholder" in item;

  if (loading || isPlaceholder) {
    return (
      <View
        style={{
          width: itemWidth,
          height: itemHeight,
          margin: spacing / 2,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
      </View>
    );
  }

  // Check if the item has motion
  const hasMotion = item.has_Motion === true;

  return (
    <Pressable
      style={{
        width: itemWidth,
        height: itemHeight,
        margin: spacing / 2,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        position: "relative",
      }}
      onPress={() =>
        router.push({
          pathname: "/(app)/(auth)/generations/get",
          params: { id: item.$id },
        })
      }
    >
      <Image
        source={{
          uri: imageError
            ? "https://placehold.co/900x1600/png"
            : item.generationImageUrl,
        }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        onError={() => setImageError(true)}
      />

      {/* Motion indicator */}
      {hasMotion && (
        <View
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 12,
            padding: 4,
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <MaterialIcons name="videocam" color="white" size={16} />
        </View>
      )}

      {item.title && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {item.title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

// Tab Component
const TabSelector = ({
  activeTab,
  setActiveTab,
  motionCount = 0,
  imageCount = 0,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  motionCount: number;
  imageCount: number;
}): React.JSX.Element => {
  const tabs = [
    { id: "all", label: "All", count: imageCount },
    { id: "motion", label: "Motion", count: motionCount },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "solid" : "outline"}
          style={{
            marginRight: 8,
            backgroundColor: activeTab === tab.id ? Colors.light.primary[500] : "transparent",
            borderColor: activeTab === tab.id ? "#3b82f6" : "#d1d5db",
          }}
          onPress={() => setActiveTab(tab.id)}
        >
          <ButtonText
            style={{
              color: activeTab === tab.id ? "white" : "#4b5563",
            }}
          >
            {tab.label} ({tab.count})
          </ButtonText>
        </Button>
      ))}
    </View>
  );
};

export default function GeneratePage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [generationsData, setGenerationsData] = useState<GenerationItem[]>([]);
  const [filteredData, setFilteredData] = useState<GenerationItem[]>([]);

  // Keep track of counts for UI
  const motionCount = generationsData.filter(
    (item) => !("isPlaceholder" in item) && item.has_Motion === true
  ).length;

  const imageCount = generationsData.filter(
    (item) => !("isPlaceholder" in item)
  ).length;

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await databaseService.listGenerations();

      // Assuming the API doesn't return has_Motion, let's simulate it
      // In a real scenario, you would get this from your API
      const dataWithMotion = data.map((item) => ({
        ...item,
        has_Motion: Math.random() > 0.5, // Simulate has_Motion randomly for demo purposes
      }));

      setGenerationsData(dataWithMotion);
    } catch (error) {
      console.error("Error fetching generations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Filter data based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredData(generationsData);
    } else if (activeTab === "motion") {
      setFilteredData(
        generationsData.filter(
          (item) => !("isPlaceholder" in item) && item.has_Motion === true
        )
      );
    }
  }, [activeTab, generationsData]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Generate placeholder data when loading
  const placeholderData = Array.from({ length: 6 }, (_, index) => ({
    id: index,
    isPlaceholder: true as const,
  }));

  // Data to display based on loading state
  const displayData = loading ? placeholderData : filteredData;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TabSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        motionCount={motionCount}
        imageCount={imageCount}
      />
      <FlashList
        data={displayData}
        estimatedItemSize={itemHeight}
        renderItem={({ item }) => (
          <GenerationCard item={item} loading={loading} />
        )}
        keyExtractor={(item) =>
          "isPlaceholder" in item ? `placeholder-${item.id}` : item.$id
        }
        numColumns={numColumns}
        contentContainerStyle={{ padding: spacing / 2 }}

        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
              height: 200,
            }}
          >
            <Text style={{ color: "#6b7280" }}>
              {activeTab === "motion"
                ? "No motion generations found"
                : "No generations found"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
