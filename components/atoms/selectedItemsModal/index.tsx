import { useRef, useState } from "react";
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

  const [actorName, setActorName] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Define snap points
  const snapPoints = ["10%", "85%"];

  // Get outfit items by category
  const getItemByCategory = (category: string) => {
    return outfitItems.find((item) => item.category === category);
  };

  const topItem = getItemByCategory("top");
  const bottomItem = getItemByCategory("bottom");
  const accessoryItem = getItemByCategory("accessory");
  const fullItem = getItemByCategory("full");

  // Handle removing actor
  const handleRemoveActor = () => {
    removeActorItems();
  };

  // Handle removing outfit items
  const handleRemoveItem = (category: string) => {
    removeOutfitItem(category as "full" | "top" | "bottom" | "accessory");
  };

  if (!visible) return null;

  return (

    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: '#666666', width: 50 }}
      backgroundStyle={{ backgroundColor: '#FFFFFF' }}
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
      <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Title */}
        <Text className="text-xl font-bold text-center mb-4 text-black">
          Selected Items
        </Text>

        {/* Actor/Model Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Model</Text>

          <View>
            {actorItems && actorItems.imageUrl ? (
              <View className="relative">
                <Image
                  source={{ uri: actorItems.imageUrl }}
                  className="w-full aspect-square rounded-2xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                  onPress={handleRemoveActor}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>


              </View>
            ) : (
              <View
                className="w-full aspect-square rounded-2xl justify-center items-center bg-transparent"
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}
              >
                <Ionicons name="person" size={64} color="#999999" />
                <Text className="text-gray-500 mt-2">No model selected</Text>
              </View>
            )}
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-300 my-4" />

        {/* Outfit Items Section */}
        <Text className="text-lg font-semibold mb-2 text-gray-700">Outfit Items</Text>

        {hasFullOutfit() ? (
          // Full outfit display
          <View className="relative mb-6">
            {fullItem ? (
              <View className="relative">
                <View className="rounded-2xl overflow-hidden border border-gray-300">
                  <Image
                    source={{ uri: fullItem.imageUrl }}
                    className="w-full aspect-video"
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                  onPress={() => handleRemoveItem("full")}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                className="w-full aspect-video rounded-2xl justify-center items-center bg-transparent"
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}
              >
                <Text className="text-gray-500">
                  No full outfit selected
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Individual items
          <VStack className="space-y-4 mb-6">
            {/* Top item */}
            <View className="relative">
              <Text className="text-sm font-medium mb-1 text-gray-600">Top</Text>
              {topItem ? (
                <View className="relative">
                  <View className="rounded-xl overflow-hidden border border-gray-300">
                    <Image
                      source={{ uri: topItem.imageUrl }}
                      className="w-full h-32"
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("top")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-full h-20 rounded-xl justify-center items-center bg-transparent"
                  style={{
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}
                >
                  <HStack className="items-center space-x-2">
                    <Ionicons
                      name="shirt-outline"
                      size={24}
                      color="#999999"
                    />
                    <Text className="text-gray-500">No top selected</Text>
                  </HStack>
                </View>
              )}
            </View>

            {/* Bottom item */}
            <View className="relative">
              <Text className="text-sm font-medium mb-1 text-gray-600">Bottom</Text>
              {bottomItem ? (
                <View className="relative">
                  <View className="rounded-xl overflow-hidden border border-gray-300">
                    <Image
                      source={{ uri: bottomItem.imageUrl }}
                      className="w-full h-32"
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("bottom")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-full h-20 rounded-xl justify-center items-center bg-transparent"
                  style={{
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}
                >
                  <HStack className="items-center space-x-2">
                    <Ionicons
                      name="hardware-chip-outline"
                      size={24}
                      color="#999999"
                    />
                    <Text className="text-gray-500">
                      No bottom selected
                    </Text>
                  </HStack>
                </View>
              )}
            </View>

            {/* Accessory item */}
            <View className="relative">
              <Text className="text-sm font-medium mb-1 text-gray-600">Accessory</Text>
              {accessoryItem ? (
                <View className="relative">
                  <View className="rounded-xl overflow-hidden border border-gray-300">
                    <Image
                      source={{ uri: accessoryItem.imageUrl }}
                      className="w-full h-32"
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("accessory")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-full h-20 rounded-xl justify-center items-center bg-transparent"
                  style={{
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                  }}
                >
                  <HStack className="items-center space-x-2">
                    <Ionicons
                      name="glasses-outline"
                      size={24}
                      color="#999999"
                    />
                    <Text className="text-gray-500">
                      No accessory selected
                    </Text>
                  </HStack>
                </View>
              )}
            </View>
          </VStack>
        )}

        {/* Action button */}

      </BottomSheetScrollView>
    </BottomSheet>

  );
};

export default SelectedItemsModal;