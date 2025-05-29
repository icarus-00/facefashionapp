import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Dimensions, View, Pressable, ViewStyle, ActivityIndicator } from "react-native";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import { FlashList } from "@shopify/flash-list";
import { Image as RNImage } from "react-native";
import { Text } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, ButtonText } from "@/components/ui/button";
import { MaterialIcons } from "@expo/vector-icons";
import databaseService, { generationsWithImage } from "@/services/database/db";
import mockDatabaseService from "@/services/database/mockDb";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/context/authcontext";
import OrbsBackground from "@/components/ui/OrbsBackground";
import { EvilIcons } from "@expo/vector-icons";

// Layout constants
const { width: screenWidth } = Dimensions.get("window");
const numColumns = 2;
const spacing = 8;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * (16 / 9);

// Calculate estimated item size for FlashList
const estimatedItemSize = itemHeight + spacing;

// Extended type to include placeholder state
type GenerationItem =
  | (generationsWithImage & { has_Motion?: boolean })
  | { id: number; isPlaceholder: true };

// Generation Card Component (memoized for performance)
const GenerationCard = React.memo(
  ({
    item,
    loading = false,
  }: {
    item: GenerationItem;
    loading?: boolean;
  }): React.JSX.Element => {
    const [imageError, setImageError] = useState(false);
    const isPlaceholder = "isPlaceholder" in item;

    // Detect states
    const isGenerating = !isPlaceholder && item.state === "generating";
    const isImageFailed = !isPlaceholder && item.state === "failed" && !item.videoUrl;
    const isVideoFailed = !isPlaceholder && item.state === "completed" && item.videoGeneration === "failed";
    const hasMotion = !isPlaceholder && !!item.has_Motion;

    // Skeleton color logic
    let skeletonColor = "bg-background-200";
    if (isImageFailed) skeletonColor = "bg-red-500";

    if (loading || isPlaceholder || isGenerating || isImageFailed) {
      return (
        <View
          style={{
            width: itemWidth,
            height: itemHeight,
            margin: spacing / 2,
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Skeleton
            variant="sharp"
            style={{ width: "100%", height: "100%" }}
            startColor={skeletonColor}
            isLoaded={false}
          />
          {/* Error indicator for failed image */}
          {isImageFailed && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: 16,
                padding: 4,
                zIndex: 2,
              }}
            >
              <EvilIcons name="exclamation" size={24} color="#ef4444" />
            </View>
          )}
        </View>
      );
    }

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
        {imageError ? (
          <View style={{ width: "100%", height: "100%", backgroundColor: "#eee", justifyContent: "center", alignItems: "center" }}>
            <MaterialIcons name="broken-image" size={40} color="#ccc" />
          </View>
        ) : (
          <RNImage
            source={{ uri: item.generationImageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            onError={() => setImageError(true)}
            // @ts-ignore: quality is supported on iOS/Android
            quality={0.5}
            // @ts-ignore: progressiveRenderingEnabled is iOS/Android only
            progressiveRenderingEnabled={true}
          />
        )}

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

        {/* Video error badge */}
        {isVideoFailed && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 999,
              paddingVertical: 2,
              paddingHorizontal: 10,
              zIndex: 2,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <MaterialIcons name="videocam" color="#ef4444" size={16} />
            <EvilIcons name="exclamation" size={22} color="#ef4444" style={{ marginLeft: 2 }} />
          </View>
        )}

        {"title" in item && item.title && (
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
  }
);

// GenerationTypeTabs replaces TabSelector, fixes filtering logic
const GenerationTypeTabs = ({
  activeType,
  setActiveType,
  motionCount = 0,
  imageCount = 0,
}: {
  activeType: string;
  setActiveType: (tab: string) => void;
  motionCount: number;
  imageCount: number;
}): React.JSX.Element => {
  const tabs = useMemo(
    () => [
      { id: "all", label: "All", count: imageCount },
      { id: "motion", label: "Motion", count: motionCount },
    ],
    [imageCount, motionCount]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
      }}
    >
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeType === tab.id ? "solid" : "outline"}
          style={{
            marginRight: 8,
            backgroundColor:
              activeType === tab.id ? Colors.light.primary[500] : "transparent",
            borderColor: activeType === tab.id ? "#3b82f6" : "#d1d5db",
          }}
          onPress={() => setActiveType(tab.id)}
        >
          <ButtonText
            style={{
              color: activeType === tab.id ? "white" : "#4b5563",
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
  const [activeType, setActiveType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [generationsData, setGenerationsData] = useState<GenerationItem[]>([]);
  const [filteredData, setFilteredData] = useState<GenerationItem[]>([]);

  const { testMode } = useUser();
  const dbService = testMode.enabled ? mockDatabaseService : databaseService;

  // Fetch data function (no random has_Motion, use actual property)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dbService.listGenerations();
      setGenerationsData(data);
    } catch (error) {
      console.error("Error fetching generations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dbService]);

  // Filter data based on activeType
  useEffect(() => {
    if (activeType === "all") {
      setFilteredData(generationsData);
    } else if (activeType === "motion") {
      setFilteredData(
        generationsData.filter(
          (item) =>
            !("isPlaceholder" in item) &&
            !!item.has_Motion // Only true if has_Motion is true
        )
      );
    }
  }, [activeType, generationsData]);

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
  const placeholderData = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        id: index,
        isPlaceholder: true as const,
      })),
    []
  );

  // Data to display based on loading state
  const displayData = loading ? placeholderData : filteredData;

  // Accurate counts for tabs
  const motionCount = useMemo(
    () =>
      generationsData.filter(
        (item) => !("isPlaceholder" in item) && !!item.has_Motion
      ).length,
    [generationsData]
  );
  const imageCount = useMemo(
    () => generationsData.filter((item) => !("isPlaceholder" in item)).length,
    [generationsData]
  );

  // Memoized renderItem and keyExtractor for FlashList performance
  const renderGenerationItem = useCallback(
    ({ item }: { item: GenerationItem }) => (
      <GenerationCard item={item} loading={loading} />
    ), [loading]
  );

  const generationKeyExtractor = useCallback(
    (item: GenerationItem) =>
      "isPlaceholder" in item ? `placeholder-${item.id}` : item.$id,
    []
  );

  // Move ListEmptyComponent style out to avoid inline object recreation
  const emptyComponentStyle = useMemo(
    () =>
    ({
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      height: 200,
    } as ViewStyle),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <OrbsBackground />
      <GenerationTypeTabs
        activeType={activeType}
        setActiveType={setActiveType}
        motionCount={motionCount}
        imageCount={imageCount}
      />
      <FlashList
        data={displayData}
        renderItem={renderGenerationItem}
        keyExtractor={generationKeyExtractor}
        numColumns={numColumns}
        contentContainerStyle={{ padding: spacing / 2 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        estimatedItemSize={estimatedItemSize}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={emptyComponentStyle}>
            <Text style={{ color: "#6b7280" }}>
              {activeType === "motion"
                ? "No motion generations found"
                : "No generations found"}
            </Text>
          </View>
        }
      />
      {refreshing && (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 100,
        }}>
          <ActivityIndicator size="large" color={Colors.light.primary[500]} />
        </View>
      )}
    </View>
  );
}