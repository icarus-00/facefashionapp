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
  const snapPoints = ["20%", "100%"];

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
        // marginBottom: 40,
      }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Title */}
        <Text className="text-xl font-bold text-center mb-4 text-black">
          Selected Items
        </Text>

        {/* Actor/Model Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700">Model</Text>

          <View>
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
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Actor Details */}
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
                    {(actorItems.height > 0 ) && (
                      <HStack className="justify-between">
                        <Text className="text-gray-600">Height:</Text>
                        <Text className="text-black font-medium">{actorItems.height > 0 ? `${actorItems.height}cm` : ""}</Text>
                      </HStack>
                    )}
                    {(actorItems.weight > 0 ) && (
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
              <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-4">
                <HStack>
                  <View className="relative w-1/3">
                    <Image
                      source={{ uri: fullItem.imageUrl }}
                      className="h-36"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                      onPress={() => handleRemoveItem("full")}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  
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
                </HStack>
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
                <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-2">
                  <HStack>
                    <Image
                      source={{ uri: topItem.imageUrl }}
                      className="w-1/3 h-32"
                      resizeMode="cover"
                    />
                    <View className="p-3 flex-1">
                      {topItem.outfitName && (
                        <Text className="text-base font-bold text-black mb-1" numberOfLines={1}>{topItem.outfitName}</Text>
                      )}
                      <View className="space-y-1">
                        {topItem.brand && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Brand: <Text className="font-medium text-black">{topItem.brand}</Text></Text>
                        )}
                        {topItem.size && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Size: <Text className="font-medium text-black">{topItem.size}</Text></Text>
                        )}
                        {topItem.material && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Material: <Text className="font-medium text-black">{topItem.material}</Text></Text>
                        )}
                        {topItem.attireTheme && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Theme: <Text className="font-medium text-black">{topItem.attireTheme}</Text></Text>
                        )}
                      </View>
                    </View>
                  </HStack>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("top")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
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
                    <Text className="text-gray-500 ml-2">No top selected</Text>
                  </HStack>
                </View>
              )}
            </View>

            {/* Bottom item */}
            <View className="relative">
              <Text className="text-sm font-medium mb-1 text-gray-600 mt-2">Bottom</Text>
              {bottomItem ? (
                <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-2">
                  <HStack>
                    <Image
                      source={{ uri: bottomItem.imageUrl }}
                      className="w-1/3 h-32"
                      resizeMode="cover"
                    />
                    <View className="p-3 flex-1">
                      {bottomItem.outfitName && (
                        <Text className="text-base font-bold text-black mb-1" numberOfLines={1}>{bottomItem.outfitName}</Text>
                      )}
                      <View className="space-y-1">
                        {bottomItem.brand && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Brand: <Text className="font-medium text-black">{bottomItem.brand}</Text></Text>
                        )}
                        {bottomItem.size && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Size: <Text className="font-medium text-black">{bottomItem.size}</Text></Text>
                        )}
                        {bottomItem.material && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Material: <Text className="font-medium text-black">{bottomItem.material}</Text></Text>
                        )}
                        {bottomItem.attireTheme && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Theme: <Text className="font-medium text-black">{bottomItem.attireTheme}</Text></Text>
                        )}
                      </View>
                    </View>
                  </HStack>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("bottom")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
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
                    <Text className="text-gray-500 ml-2">
                      No bottom selected
                    </Text>
                  </HStack>
                </View>
              )}
            </View>

            {/* Accessory item */}
            <View className="relative">
              <Text className="text-sm font-medium mb-1 text-gray-600 mt-2">Accessory</Text>
              {accessoryItem ? (
                <View className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-2">
                  <HStack>
                    <Image
                      source={{ uri: accessoryItem.imageUrl }}
                      className="w-1/3 h-32"
                      resizeMode="cover"
                    />
                    <View className="p-3 flex-1">
                      {accessoryItem.outfitName && (
                        <Text className="text-base font-bold text-black mb-1" numberOfLines={1}>{accessoryItem.outfitName}</Text>
                      )}
                      <View className="space-y-1">
                        {accessoryItem.brand && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Brand: <Text className="font-medium text-black">{accessoryItem.brand}</Text></Text>
                        )}
                        {accessoryItem.size && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Size: <Text className="font-medium text-black">{accessoryItem.size}</Text></Text>
                        )}
                        {accessoryItem.material && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Material: <Text className="font-medium text-black">{accessoryItem.material}</Text></Text>
                        )}
                        {accessoryItem.attireTheme && (
                          <Text className="text-xs text-gray-600" numberOfLines={1}>Theme: <Text className="font-medium text-black">{accessoryItem.attireTheme}</Text></Text>
                        )}
                      </View>
                    </View>
                  </HStack>
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                    onPress={() => handleRemoveItem("accessory")}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
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
                    <Text className="text-gray-500 ml-2">
                      No accessory selected
                    </Text>
                  </HStack>
                </View>
              )}
            </View>
          </VStack>
        )}

        {/* Additional space for bottom navigation */}
        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>

  );
};

export default SelectedItemsModal;