
import React, { useState, useEffect, useCallback, useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import { View, Animated, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Box } from "@/components/ui/box";
import databaseService from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import OutfitCard from "./atoms/outfitCard";
import ModalComponent from "./atoms/outfitModal";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStore from "@/store/lumaGeneration/useStore";

const { width: screenWidth } = Dimensions.get("screen");
const numColumns = 2;
const spacing = 12;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;
const itemHeight = itemWidth * 1.5;

const FILTER_TABS = ["All", "Popular", "Top Rated", "Upcoming"];
const GARMENT_TYPES = ["Full", "Tops", "Bottoms", "Accessories"];
const DEFAULT_THEMES = ["streetwear", "casual", "retro", "classic"];

export default function OutFitPageComp({ selecting }: { selecting: boolean }) {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [showMoreThemes, setShowMoreThemes] = useState(false);
  const [allThemes, setAllThemes] = useState([]);
  const [modalProps, setModalProps] = useState({ id: "", visible: false });
  const [selectedItem, setSelectedItem] = useState("");
  const [isSelecting, setSelecting] = useState(selecting);

  const scrollY = useRef(new Animated.Value(0)).current;
  const filterBarHeight = useRef(new Animated.Value(1)).current;
  const bottomSheetHeight = useRef(new Animated.Value(1)).current;

  const { outfitItems, addOutfitItem, removeOutfitItem } = useStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await databaseService.ListOutfits();
      setOutfits(data);
      const themes = [...new Set(data.map(outfit => outfit.attireTheme))];
      setAllThemes(themes);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const filterBarTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const bottomSheetTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const filteredOutfits = outfits.filter(outfit => {
    if (selectedGarmentType && outfit.garmentType !== selectedGarmentType) return false;
    if (selectedThemes.length > 0 && !selectedThemes.includes(outfit.attireTheme)) return false;
    return true;
  });

  const FilterBar = () => (
    <Animated.View style={{ transform: [{ translateY: filterBarTranslateY }] }}>
      <View className="bg-white shadow-md p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab}
              className={`mx-1 ${selectedTab === tab ? 'bg-primary-500' : 'bg-gray-100'}`}
              onPress={() => setSelectedTab(tab)}
            >
              <ButtonText>{tab}</ButtonText>
            </Button>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {GARMENT_TYPES.map((type) => (
            <Button
              key={type}
              className={`mx-1 ${selectedGarmentType === type ? 'bg-primary-500' : 'bg-gray-100'}`}
              onPress={() => setSelectedGarmentType(type)}
            >
              <ButtonText>{type}</ButtonText>
            </Button>
          ))}
        </ScrollView>

        <HStack className="mt-4 flex-wrap">
          {DEFAULT_THEMES.map((theme) => (
            <Button
              key={theme}
              className={`m-1 ${selectedThemes.includes(theme) ? 'bg-primary-500' : 'bg-gray-100'}`}
              onPress={() => {
                setSelectedThemes(prev => 
                  prev.includes(theme) 
                    ? prev.filter(t => t !== theme)
                    : [...prev, theme]
                );
              }}
            >
              <ButtonText>{theme}</ButtonText>
            </Button>
          ))}
          <Button onPress={() => setShowMoreThemes(!showMoreThemes)}>
            <ButtonIcon as={showMoreThemes ? Ionicons.name="chevron-up" : Ionicons.name="chevron-down"} />
          </Button>
        </HStack>

        {showMoreThemes && (
          <View className="mt-2">
            {allThemes
              .filter(theme => !DEFAULT_THEMES.includes(theme))
              .map((theme) => (
                <Button
                  key={theme}
                  className={`m-1 ${selectedThemes.includes(theme) ? 'bg-primary-500' : 'bg-gray-100'}`}
                  onPress={() => {
                    setSelectedThemes(prev => 
                      prev.includes(theme) 
                        ? prev.filter(t => t !== theme)
                        : [...prev, theme]
                    );
                  }}
                >
                  <ButtonText>{theme}</ButtonText>
                </Button>
              ))}
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemedView className="flex-1">
      <FilterBar />
      <FlashList
        data={filteredOutfits}
        estimatedItemSize={itemHeight}
        renderItem={({ item, index }) => (
          <OutfitCard
            item={item}
            loading={loading}
            index={index}
            selected={selectedItem === item.$id}
            onLongPress={() => setSelectedItem(item.$id)}
            onPress={() => {
              if (
                (item.garmentType === "Full" && !outfitItems.some(i => i.category !== "full")) ||
                (item.garmentType !== "Full" && !outfitItems.some(i => i.category === "full"))
              ) {
                addOutfitItem(item.$id, item.garmentType.toLowerCase(), item.imageUrl);
                setModalProps({ id: item.$id, visible: true });
              }
            }}
            selecting={isSelecting}
          />
        )}
        numColumns={numColumns}
        onScroll={handleScroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={refreshing}
        onRefresh={fetchData}
      />
      <ModalComponent
        id={modalProps.id}
        visible={modalProps.visible}
        onPress={() => setModalProps({ id: "", visible: false })}
      />
    </ThemedView>
  );
}
