import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { useEffect, useState, useRef } from "react";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  AntDesign,
  MaterialIcons,
  Feather,
  EvilIcons,
} from "@expo/vector-icons";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { Icon, SpeedDial } from "@rneui/themed";
import useStore from "@/store/lumaGeneration/useStore";
// Import the correct Fab components based on your structure
import { Fab } from "@/components/ui/fab";

// Swipe gesture handling for closing the modal
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

// Custom Fab components based on your structure
const CustomFab = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <SpeedDial
      isOpen={open}
      icon={<Feather name="menu" size={24} color="white" />}
      openIcon={<Feather name="x" size={24} color="white" />}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      overlayColor="transparent"
      buttonStyle={{
        backgroundColor: Colors.light.tint,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      }}
      style={{ position: "absolute", bottom: 0, right: 0 }}
      containerStyle={{ gap: 0 }}
      title="Actions"
    >
      <SpeedDial.Action
        icon={<Feather name="trash" size={20} color="white" />}
        buttonStyle={{ backgroundColor: Colors.light.tint }}
        onPress={() => onDelete!()}
      />
      <SpeedDial.Action
        icon={<Feather name="edit-2" size={20} color="white" />}
        buttonStyle={{ backgroundColor: Colors.light.tint }}
        onPress={() => onEdit()}
      />
    </SpeedDial>
  );
};
const LoadingSpinner = () => (
  <Center className="flex-1 w-full h-full">
    <Spinner size="large" />
  </Center>
);

export default function GetActor({
  paramid,
  onClose,
}: {
  paramid?: string;
  onClose?: () => void;
}) {
  const [actor, setActor] = useState<ActorWithImage>();
  const [loading, setLoading] = useState(true);
  const { userId, updateActorItems } = useStore();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);

      try {
        if (paramid) {
          const data = await databaseService.getActor(paramid);
          setActor(data);
        }
      } catch (error) {
        console.error("Error fetching actor: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paramid]);


  // Function to handle actor deletion
  const handleDelete = async () => {
    try {
      if (actor?.$id) {
        // Show confirmation dialog (implementation depends on your UI library)
        // For this example, we'll just log the action
        await databaseService.deleteActor(actor.$id, actor.fileID);
        // await databaseService.deleteActor(actor.$id);
        // Close modal after deletion
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error deleting actor:", error);
    }
  };

  // Function to handle actor editing
  const handleEdit = () => {
    if (actor?.$id) {
      // Navigate to edit screen or show edit form
      console.log("Editing actor:", actor.$id);
      // router.push(`/actors/edit/${actor.$id}`);
    }
  };

  // Create a swipe down gesture for closing the modal
  const swipeGesture = Gesture.Pan()

    .onStart(() => {
      console.log("Gesture started");
    })
    .onUpdate((event) => {
      console.log("Gesture updating", event.translationY);
      // You could add visual feedback here
    })
    .onEnd((event) => {
      console.log("Gesture ended", event.translationY);
      if (event.translationY > 50) {
        console.log("Should dismiss");
        if (onClose) runOnJS(onClose)();
      }
    });
  // Handle back button action
  const handleBack = () => {
    if (onClose) onClose();
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <GestureDetector gesture={swipeGesture}>
      <View className="flex-1 bg-white rounded-xl ">
        {/* Gradient overlay at the top for better visibility of back button */}
        <View className="rounded-t-3xl overflow-hidden">
          <View className="h-3 bg-white rounded-t-3xl overflow-hidden" />

          {/* Back button positioned at top-left */}

          {/* Swipe indicator at the top */}
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-center h-full">
            <View className="w-12 h-1 bg-black rounded-full" />
          </View>
        </View>
        <VStack className="flex-1">
          {/* Image Section with Overlay and Back Button */}
          <View className="items-center justify-center aspect-square w-full p-1">
            <Image
              source={{ uri: actor?.imageUrl }}
              className="w-full aspect-square  rounded-b-3xl rounded-t-3xl"
            />
            <CustomFab
              onEdit={() => {
                router.push({
                  pathname: "/(app)/(auth)/actor/edit",
                  params: { id: actor?.$id },
                });
                handleBack();
              }}
              onDelete={() => handleDelete()}
            />
          </View>

          {/* Actor Information Section */}
          <View className="flex-1 w-full p-5 bg-white mt-6">
            <Text className="font-extrabold text-3xl mb-4">
              {actor?.actorName}
            </Text>

            <View className="flex-row flex-wrap mb-4">
              <View className="w-1/2 mb-2">
                <Text className="text-gray-500">ID:</Text>
                <Text className="font-medium">
                  {actor?.$id?.substring(0, 8)}...
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-gray-500">Age:</Text>
                <Text className="font-medium">
                  {actor?.age || "Not specified"}
                </Text>
              </View>
              <View className="w-full mt-2">
                <Text className="text-gray-500">Bio:</Text>
                <Text className="font-medium">
                  {actor?.description || "No biography available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Section */}
          <View className="px-2 w-full flex-row items-center gap-1 justify-between h-24  ">
            {/* Empty space placeholder */}
            <View className="flex-1">{/* Intentionally empty */}</View>

            {/* Dress Up button - takes 4x the space of other elements */}
            <View className="flex-3  h-20">
              <Button
                size="full"
                className="bg-primary-500"
                onPress={() => {
                  updateActorItems(actor?.$id!, actor?.imageUrl!);
                  router.push("/(app)/(auth)/(tabs)/outfit");
                  if (onClose) onClose();
                }}
              >
                <ButtonText>Dress Up</ButtonText>
              </Button>
            </View>

            {/* Back button - maintains square aspect ratio */}
            <View className="flex-1 ">
              <Pressable
                onPress={handleBack}
                className="bg-secondary-500/25 rounded-full aspect-square w-full justify-center items-center"
              >
                <AntDesign name="arrowdown" size={20} color="black" />
              </Pressable>
            </View>
          </View>
          {/* Custom FAB implementation */}
        </VStack>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  gradientOverlay: {
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 80,
    alignItems: "center",
  },
  fabItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
