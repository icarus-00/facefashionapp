import { Ionicons } from "@expo/vector-icons";
import {
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
} from "react-native";

import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Badge, BadgeText } from "@/components/ui/badge";
import useStore from "@/store/lumaGeneration/useStore";
import { ScrollView } from "react-native-gesture-handler";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface SelectedItemsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SelectedItemsModal = ({ visible, onClose }: SelectedItemsModalProps) => {
  const fadeAnim = useRef(new Animated.Value(-screenWidth / 2)).current;
  const {
    actorImageUrl,
    outfitItems,
    hasFullOutfit,
    updateActorImageUrl,
    removeOutfitItem,
    removeActorItems,
    actorItems,
  } = useStore();
  const [actorName, setActorName] = useState("");

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      fadeAnim.setValue(-screenWidth / 2);
      Animated.timing(fadeAnim, {
        toValue: -screenWidth / 2,
        duration: 300,
        useNativeDriver: false,
      }).start(onClose);
    }
  }, [visible]);

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END && visible) {
      const finalTranslateX = event.nativeEvent.translationX;
      if (finalTranslateX < -50) onClose();
    }
  };

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

  return (
    visible && (
      <TouchableOpacity
        className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/50"
        activeOpacity={1}
      >
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <Animated.View
            className="absolute left-0 right-0 z-100 bg-white rounded-r-3xl p-6"
            style={{
              transform: [{ translateX: fadeAnim }],
              width: screenWidth / 1.2,
              height: screenHeight / 1.5,
            }}
          >
            <ScrollView style={{ flex: 1 }}>
              {/* Actor/Model Section */}
              <View className="mb-6">
                <View>
                  {actorImageUrl ? (
                    <>
                      <Image
                        source={{ uri: actorItems.imageUrl }}
                        className="w-full aspect-square rounded-2xl"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 bg-secondary-500 border-offwhite-500 rounded-full p-1"
                        onPress={handleRemoveActor}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View
                      className="w-full aspect-square rounded-2xl justify-center items-center bg-secondary-500 border-offwhite-500"
                      style={{
                        borderWidth: 2,
                      }}
                    >
                      <Ionicons name="person" size={64} color="white" />
                      <Text className="text-white mt-2">No model selected</Text>
                    </View>
                  )}
                </View>

                {/* Name input */}
              </View>

              {/* Horizontal divider */}

              {/* Outfit Items Section */}
              {hasFullOutfit() ? (
                // Full outfit display
                <View className="relative mb-6">
                  {fullItem ? (
                    <>
                      <View className="rounded-2xl overflow-hidden bg-secondary-500 border-offwhite-500">
                        <Image
                          source={{ uri: fullItem.imageUrl }}
                          className="w-full aspect-video"
                          resizeMode="cover"
                        />
                      </View>
                      <TouchableOpacity
                        className="absolute top-2 right-2 bg-primary-500 rounded-full p-1"
                        onPress={() => handleRemoveItem("full")}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={24}
                          color="white"
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View
                      className="w-full aspect-video rounded-2xl justify-center items-center"
                      style={{
                        backgroundColor: "#1E40AF",
                        borderColor: "#3B82F6",
                        borderWidth: 2,
                      }}
                    >
                      <Text className="text-blue-300">
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
                    {topItem ? (
                      <>
                        <View
                          className="rounded-xl overflow-hidden"
                          style={{ borderColor: "#3B82F6", borderWidth: 2 }}
                        >
                          <Image
                            source={{ uri: topItem.imageUrl }}
                            className="w-full h-32"
                            resizeMode="cover"
                          />
                        </View>
                        <TouchableOpacity
                          className="absolute top-2 right-2 bg-green-600 rounded-full p-1"
                          onPress={() => handleRemoveItem("top")}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View
                        className="w-full h-20 rounded-xl justify-center items-center"
                        style={{
                          backgroundColor: "#1E40AF",
                          borderColor: "#3B82F6",
                          borderWidth: 2,
                        }}
                      >
                        <HStack className="items-center space-x-2">
                          <Ionicons
                            name="shirt-outline"
                            size={24}
                            color="#22C55E"
                          />
                          <Text className="text-blue-300">No top selected</Text>
                        </HStack>
                      </View>
                    )}
                  </View>

                  {/* Bottom item */}
                  <View className="relative">
                    {bottomItem ? (
                      <>
                        <View
                          className="rounded-xl overflow-hidden"
                          style={{ borderColor: "#EF4444", borderWidth: 2 }}
                        >
                          <Image
                            source={{ uri: bottomItem.imageUrl }}
                            className="w-full h-20"
                            resizeMode="cover"
                          />
                        </View>
                        <TouchableOpacity
                          className="absolute top-2 right-2 bg-green-600 rounded-full p-1"
                          onPress={() => handleRemoveItem("bottom")}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View
                        className="w-full h-16 rounded-xl justify-center items-center"
                        style={{
                          backgroundColor: "#7C2D12",
                          borderColor: "#EF4444",
                          borderWidth: 2,
                        }}
                      >
                        <HStack className="items-center space-x-2">
                          <Ionicons
                            name="hardware-chip-outline"
                            size={24}
                            color="#22C55E"
                          />
                          <Text className="text-red-300">
                            No bottom selected
                          </Text>
                        </HStack>
                      </View>
                    )}
                  </View>

                  {/* Accessory item */}
                  <View className="relative">
                    {accessoryItem ? (
                      <>
                        <View
                          className="rounded-xl overflow-hidden"
                          style={{ borderColor: "#EF4444", borderWidth: 2 }}
                        >
                          <Image
                            source={{ uri: accessoryItem.imageUrl }}
                            className="w-full h-20"
                            resizeMode="cover"
                          />
                        </View>
                        <TouchableOpacity
                          className="absolute top-2 right-2 bg-green-600 rounded-full p-1"
                          onPress={() => handleRemoveItem("accessory")}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View
                        className="w-full h-16 rounded-xl justify-center items-center"
                        style={{
                          backgroundColor: "#7C2D12",
                          borderColor: "#EF4444",
                          borderWidth: 2,
                        }}
                      >
                        <HStack className="items-center space-x-2">
                          <Ionicons
                            name="glasses-outline"
                            size={24}
                            color="#22C55E"
                          />
                          <Text className="text-red-300">
                            No accessory selected
                          </Text>
                        </HStack>
                      </View>
                    )}
                  </View>
                </VStack>
              )}
              <View className="p-4 items-center">
                <TouchableOpacity
                  className="px-6 py-3 rounded-xl w-32"
                  style={{
                    backgroundColor: "#166534",
                    borderColor: "#22C55E",
                    borderWidth: 2,
                  }}
                >
                  <Text className="text-green-400 text-lg font-medium text-center">
                    dress up
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Bottom Button - fixed at the bottom */}
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    )
  );
};

function ModalButton({ onPress }: { onPress: () => void }) {
  const { getLength } = useStore();

  return (
    getLength() !== 0 && (
      <TouchableOpacity
        className="h-full flex-row items-center p-3 bg-purple-500 rounded-full mx-3"
        onPress={onPress}
      >
        <Badge className="z-10 absolute top-1 right-0 bg-red-500 rounded-full">
          <BadgeText className="font-bold text-white">
            {getLength().toString()}
          </BadgeText>
        </Badge>

        <View className="p-0">
          <Ionicons name="images" size={32} color={"black"} onPress={onPress} />
        </View>
      </TouchableOpacity>
    )
  );
}

export { ModalButton };
export default SelectedItemsModal;
