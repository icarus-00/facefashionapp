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
import databaseService from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import { ModalHeader, ModalCloseButton } from "@/components/ui/modal";
import GetOutfit from "@/components/pages/outfitPage/actions/get";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import SubCategoriesExbandableFilter from "@/components/atoms/subCategories";
import useAttireStore from "@/store/cayegoryStore";
import { OutfitWithImage } from "@/interfaces/outfitDB";
import ModalComponent from "./atoms/outfitModal";
import OutfitCard from "./atoms/outfitCard";
import { Ionicons } from "@expo/vector-icons";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// Define types for our data
const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * 1.5;

type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true };

export default function OutFitPageComp({
  selecting,
}: {
  selecting: boolean | false;
}): React.JSX.Element {
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectingOutfit, setSelectingOutfit] = useState<boolean>(false);
  const [attireTheme, setAttireTheme] = useState<string[]>([]);
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>();
  const [isSelecting, setSelecting] = useState<boolean>(selecting);
  const [modalProps, setModalProps] = useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });

  // Use useCallback to prevent recreation of this function on every render
  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setAttireTheme([]);
    try {
      const data = await databaseService.ListOutfits();
      const themes = useAttireStore.getState().themes;
      setAttireTheme(themes);
      console.log(attireTheme);
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
                className={`mx-1 rounded-md ${selectedTab === item ? "bg-primary-400" : "bg-gray-100"
                  }`}
                onPress={() => handleTabPress(item)}
              >
                <ButtonText
                  className={`${selectedTab === item ? "text-white" : "text-typography-500"
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
      <SubCategoriesExbandableFilter
        loading={loading}
        themes={attireTheme}
        selected={selectedSubFilter}
        multiSelect={false}
        onChange={(themes) =>
          setSelectedSubFilter(Array.isArray(themes) ? themes[0] : themes)
        }
      />
      <ModalComponent
        id={modalProps.id}
        visible={modalProps.visible}
        onPress={() => setModalProps({ id: "", visible: false })}
      />
      <FlashList
        extraData={selectedItem}
        data={displayData}
        estimatedItemSize={itemHeight}
        renderItem={({ item, index }) => (
          <View>
            <OutfitCard
              selected={!("isPlaceholder" in item) && selectedItem === item.$id}
              item={item}
              loading={loading}
              index={index}
              onLongPress={() => {
                if (!("isPlaceholder" in item)) {
                  setSelectedItem((prev) => item.$id || ""); // Functional update
                  console.log(selectedItem === item.$id);
                }
              }}
              onPress={() => {
                console.log(isSelecting);
                if (!("isPlaceholder" in item)) {
                  setSelectingOutfit(true);
                  console.log(selectedItem === item.$id);
                  setModalProps({
                    id: item.$id || "",
                    visible: true,
                  });
                }
              }}
              selecting={isSelecting}
            />
            <View className=" w-full absolute bottom-0 bg-white p-2 justify-end flex-row">
              {"isPlaceholder" in item ? (
                <Ionicons name="checkbox-outline" size={24} color="black" />
              ) : selectedItem === item.$id ? (
                <Ionicons
                  name="checkbox"
                  className="justify-end justify-self-end"
                  size={24}
                  color="black"
                />
              ) : (
                <Ionicons name="checkbox-outline" size={24} color="black" />
              )}
            </View>
          </View>
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
