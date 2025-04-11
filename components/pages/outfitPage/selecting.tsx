import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  View,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { OutfitWithImage } from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import { ModalHeader, ModalCloseButton } from "@/components/ui/modal";
import GetOutfit from "@/components/pages/outfitPage/actions/get";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * 1.5;

// Define default image
const DEFAULT_IMAGE = "https://placehold.co/900x1600";

// Create a union type for outfit data items
type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true };

// Props for OutfitCard component
interface OutfitCardProps {
  item: OutfitItem;
  loading: boolean;
  index: number;
  selected: boolean;
}

const ModalComponent = ({
  id,
  visible,
  onPress,
}: {
  id: string;
  visible: boolean;
  onPress: () => void;
}) => {
  if (!visible) {
    return null;
  } else if (visible) {
    return (
      <Modal
        accessible
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={onPress}
        className="relative flex-1 justify-center items-center"
      >
        <View className="flex-1 justify-center items-center bg-black/25">
          <Pressable
            onPress={onPress}
            className="flex-1 absolute h-full w-full"
          />
          <View className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden">
            <ModalHeader className="flex-row px-2 py-2 justify-end bg-black ">
              <ModalCloseButton onPress={onPress}>
                <Icon
                  as={CloseIcon}
                  size="lg"
                  color="white"
                  className="stroke-white group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-white group-[:focus-visible]/modal-close-button:stroke-white"
                />
              </ModalCloseButton>
            </ModalHeader>
            <GetOutfit paramid={id} />
          </View>
        </View>
      </Modal>
    );
  }
};

export default function SelectingOutfitPage(): React.JSX.Element {
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectingOutfit, setSelectingOutfit] = useState<boolean>(false);
  const [modalProps, setModalProps] = useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });

  // Use useCallback to prevent recreation of this function on every render
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const data = await databaseService.ListOutfits();
      setOutfits(data);
    } catch (error) {
      console.error("Error fetching outfits: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Only call fetchData on initial mount and manual refreshes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh separately without retriggering the useEffect
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Outfit card component with placeholder
  function OutfitCard({
    item,
    loading,
    index,
    selected,
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
    const LongPressGesture = Gesture.LongPress()
      .runOnJS(true)
      .onStart(() => {
        console.log("Long press started");
      })
      .onEnd((_e, success) => {
        if (!("isPlaceholder" in item)) {
          setModalProps({ id: item.$id, visible: true });
        }
      });

    return (
      <GestureDetector gesture={LongPressGesture}>
        <View
          className={`"overflow-hidden rounded-lg shadow-md shadow-black  " ${""}`}
          style={{ width: itemWidth, height: itemHeight, margin: spacing / 2 }}
        >
          <Box
            className="bg-background-100 rounded-lg overflow-hidden"
            style={{ width: itemWidth, height: itemHeight }}
          >
            <View style={{ width: "100%", height: "100%" }}>
              {renderOutfitImage()}
              <View className="absolute bottom-0 w-full bg-black/50 p-2">
                <Text className="text-white font-medium text-center">
                  {getOutfitName()}
                </Text>
              </View>
            </View>
          </Box>
        </View>
      </GestureDetector>
    );
  }

  const TabBar = (): React.JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<string>("All");

    const handleTabPress = (tab: string): void => {
      setSelectedTab(tab);
    };

    return (
      <View>
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
      </View>
    );
  };

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): OutfitItem[] => {
    return Array.from({ length: 4 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }));
  };

  const displayData: OutfitItem[] = loading ? getPlaceholderData() : outfits;
  const [selectedItem, setSelectedItem] = useState<string>("");

  return (
    <ThemedView className="flex-1">
      <TabBar />
      <ModalComponent
        id={modalProps.id}
        visible={modalProps.visible}
        onPress={() => setModalProps({ id: "", visible: false })}
      />
      <FlashList
        data={displayData}
        estimatedItemSize={itemHeight}
        renderItem={({ item, index }) => (
          <OutfitCard
            selected={!("isPlaceholder" in item) && selectedItem === item.$id}
            item={item}
            loading={loading}
            index={index}
          />
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
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500">No outfits found</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </ThemedView>
  );
}
