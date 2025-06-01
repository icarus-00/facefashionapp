import React, { useRef, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import useStore from "@/store/lumaGeneration/useStore";

interface SelectedItemsModalProps {
  visible: boolean;
}

const SelectedItemsModal = ({ visible }: SelectedItemsModalProps) => {
  const {
    outfitItems,
    hasFullOutfit,
    removeOutfitItem,
    removeActorItems,
    actorItems,
  } = useStore();

  const bottomSheetRef = useRef<BottomSheet>(null);

  // Define snap points
  const snapPoints = ["20%", "100%"];

  // Get outfit items by category
  const getItemByCategory = (category: string) => {
    return outfitItems.find((item) => item.category === category);
  };

  // Memoize derived outfit items
  const topItem = useMemo(() => getItemByCategory("top"), [outfitItems]);
  const bottomItem = useMemo(() => getItemByCategory("bottom"), [outfitItems]);
  const accessoryItem = useMemo(() => getItemByCategory("accessory"), [outfitItems]);
  const fullItem = useMemo(() => getItemByCategory("full"), [outfitItems]);

  // Handle removing actor
  const handleRemoveActor = () => {
    removeActorItems();
  };

  // Handle removing outfit items
  const handleRemoveItem = (category: string) => {
    removeOutfitItem(category as "full" | "top" | "bottom" | "accessory");
  };

  // Extracted Card Components for reusability and performance
  const ItemCard = React.memo(({ item, onRemove, typeIcon, emptyText }: any) => (
    <View className="relative">
      {item ? (
        <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-2 flex-row">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-1/3 h-32"
            resizeMode="cover"
          />
          <View className="p-3 flex-1">
            {item.outfitName && (
              <Text className="text-base font-bold text-black mb-1" numberOfLines={1}>{item.outfitName}</Text>
            )}
            <View className="space-y-1">
              {item.brand && (
                <Text className="text-xs text-gray-600" numberOfLines={1}>Brand: <Text className="font-medium text-black">{item.brand}</Text></Text>
              )}
              {item.size && (
                <Text className="text-xs text-gray-600" numberOfLines={1}>Size: <Text className="font-medium text-black">{item.size}</Text></Text>
              )}
              {item.material && (
                <Text className="text-xs text-gray-600" numberOfLines={1}>Material: <Text className="font-medium text-black">{item.material}</Text></Text>
              )}
              {item.attireTheme && (
                <Text className="text-xs text-gray-600" numberOfLines={1}>Theme: <Text className="font-medium text-black">{item.attireTheme}</Text></Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
            onPress={onRemove}
          >
            <Ionicons name="close-circle" size={20} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          className="w-full h-20 rounded-xl justify-center items-center bg-transparent flex-row"
          style={{ borderWidth: 1, borderColor: '#CCCCCC' }}
        >
          <HStack className="items-center space-x-2">
            <Ionicons name={typeIcon} size={24} color="#999999" />
            <Text className="text-gray-500 ml-2">{emptyText}</Text>
          </HStack>
        </View>
      )}
    </View>
  ));

  const Section = ({ title, children }: any) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold mb-2 text-gray-700">{title}</Text>
      {children}
    </View>
  );

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#666666', width: 50 }}
      backgroundStyle={{ backgroundColor: '#F8F9FB' }}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Sticky Title */}
        <View style={{ backgroundColor: '#F8F9FB', paddingBottom: 8, position: 'sticky', top: 0, zIndex: 10 }}>
          <Text className="text-xl font-bold text-center mb-4 text-black">Selected Items</Text>
        </View>

        {/* Model Section */}
        <Section title="Model">
          {actorItems && actorItems.imageUrl ? (
            <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4">
              <View className="relative">
                <Image
                  source={{ uri: actorItems.imageUrl }}
                  className="w-full aspect-square"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                  onPress={handleRemoveActor}
                >
                  <Ionicons name="close-circle" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View className="p-4">
                {actorItems.actorName && (
                  <Text className="text-lg font-bold text-black mb-2">{actorItems.actorName}</Text>
                )}
                <View className="space-y-2">
                  {actorItems.age > 0 && (
                    <HStack className="justify-between">
                      <Text className="text-gray-600">Age:</Text>
                      <Text className="text-black font-medium">{actorItems.age}</Text>
                    </HStack>
                  )}
                  {actorItems.gender && (
                    <HStack className="justify-between">
                      <Text className="text-gray-600">Gender:</Text>
                      <Text className="text-black font-medium">{actorItems.gender}</Text>
                    </HStack>
                  )}
                  {actorItems.genre && (
                    <HStack className="justify-between">
                      <Text className="text-gray-600">Genre:</Text>
                      <Text className="text-black font-medium">{actorItems.genre}</Text>
                    </HStack>
                  )}
                  {(actorItems.height > 0) && (
                    <HStack className="justify-between">
                      <Text className="text-gray-600">Height:</Text>
                      <Text className="text-black font-medium">{actorItems.height > 0 ? `${actorItems.height}cm` : ""}</Text>
                    </HStack>
                  )}
                  {(actorItems.weight > 0) && (
                    <HStack className="justify-between">
                      <Text className="text-gray-600">Size:</Text>
                      <Text className="text-black font-medium">{actorItems.weight > 0 ? `${actorItems.weight}kg` : ""}</Text>
                    </HStack>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View
              className="w-full aspect-square rounded-2xl justify-center items-center bg-transparent"
              style={{ borderWidth: 1, borderColor: '#CCCCCC', backgroundColor: '#F3F4F6' }}
            >
              <Ionicons name="person" size={64} color="#999999" />
              <Text className="text-gray-500 mt-2">No model selected</Text>
            </View>
          )}
        </Section>

        {/* Divider */}
        <View className="h-px bg-gray-300 my-4" />

        {/* Outfit Items Section */}
        <Section title="Outfit Items">
          {hasFullOutfit() ? (
            <View className="relative mb-6">
              {fullItem ? (
                <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 flex-row">
                  <Image
                    source={{ uri: fullItem.imageUrl }}
                    className="h-36 w-1/3"
                    resizeMode="cover"
                  />
                  <View className="p-4 flex-1">
                    {fullItem.outfitName && (
                      <Text className="text-lg font-bold text-black mb-2">{fullItem.outfitName}</Text>
                    )}
                    <View className="space-y-2 mt-2">
                      {fullItem.brand && (
                        <HStack className="justify-between">
                          <Text className="text-gray-600">Brand:</Text>
                          <Text className="text-black font-medium">{fullItem.brand}</Text>
                        </HStack>
                      )}
                      {fullItem.size && (
                        <HStack className="justify-between">
                          <Text className="text-gray-600">Size:</Text>
                          <Text className="text-black font-medium">{fullItem.size}</Text>
                        </HStack>
                      )}
                      {fullItem.material && (
                        <HStack className="justify-between">
                          <Text className="text-gray-600">Material:</Text>
                          <Text className="text-black font-medium">{fullItem.material}</Text>
                        </HStack>
                      )}
                      {fullItem.garmentType && (
                        <HStack className="justify-between">
                          <Text className="text-gray-600">Type:</Text>
                          <Text className="text-black font-medium">{fullItem.garmentType}</Text>
                        </HStack>
                      )}
                      {fullItem.attireTheme && (
                        <HStack className="justify-between">
                          <Text className="text-gray-600">Theme:</Text>
                          <Text className="text-black font-medium">{fullItem.attireTheme}</Text>
                        </HStack>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("full")}
                  >
                    <Ionicons name="close-circle" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-full aspect-video rounded-2xl justify-center items-center bg-transparent"
                  style={{ borderWidth: 1, borderColor: '#CCCCCC', backgroundColor: '#F3F4F6' }}
                >
                  <Text className="text-gray-500">No full outfit selected</Text>
                </View>
              )}
            </View>
          ) : (
            <VStack className="space-y-4 mb-6">
              <ItemCard
                item={topItem}
                onRemove={() => handleRemoveItem("top")}
                typeIcon="shirt-outline"
                emptyText="No top selected"
              />
              <View style={{ height: 10 }} />
              <ItemCard
                item={bottomItem}
                onRemove={() => handleRemoveItem("bottom")}
                typeIcon="hardware-chip-outline"
                emptyText="No bottom selected"
              />
              <View style={{ height: 10 }} />
              <ItemCard
                item={accessoryItem}
                onRemove={() => handleRemoveItem("accessory")}
                typeIcon="glasses-outline"
                emptyText="No accessory selected"
              />
            </VStack>
          )}
        </Section>
        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default SelectedItemsModal;