import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SafeAreaView from "@/components/atoms/safeview/safeview";import { ScrollView } from "react-native-gesture-handler";
import { VStack } from "@/components/ui/vstack";
import databaseService, {
  ActorWithImage,
  OutfitWithImage,
} from "@/services/database/db";
import { useEffect, useState } from "react";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { AntDesign } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { SpeedDial } from "@rneui/themed";
import { Feather } from "@expo/vector-icons";
const BackButton = () => {
  return (
    <Button
      size="sm"
      className="p-2 bg-transparent border-transparent rounded-full"
      onPress={() => {
        router.back();
      }}
      variant="outline"
    >
      <AntDesign name="arrowleft" size={20} color="black" />
    </Button>
  );
};

const Loading = () => {
  return (
    <Center className="flex-1 w-full h-full">
      <Spinner size="large" />
    </Center>
  );
};
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

export default function GetOutfit({
  paramid,
  onClose,
}: {
  paramid?: string;
  onClose?: () => void;
}) {
  //const { id } = useLocalSearchParams() || { paramid };
  const id = paramid;
  const [outfit, setOutfit] = useState<OutfitWithImage>();
  const [loading, setLoading] = useState(true);
  //console.log(id);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await databaseService.getOutfit(id as string);

        // console.log(data);
        setOutfit(data);
      } catch (error) {
        console.error("Error fetching actors: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
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
        runOnJS(() => router.back())();
        router.back();
      }
    });
  const handledelete = async () => {
    await databaseService.deleteOutfit(id as string, outfit?.fileID as string);
  };
  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView className="flex-1">
        <VStack className="flex-1">
          <View className="w-full aspect-square">
            <Image
              source={{ uri: outfit?.imageUrl }}
              className="w-full h-full aspect-square"
            />
            <CustomFab
              onEdit={() => {
                router.push({
                  pathname: `/(auth)/outfit/edit`,
                  params: {
                    id: id,
                  },
                });
                onClose!();
              }}
              onDelete={() => {
                handledelete();
                onClose!();
              }}
            />
          </View>

          <View className="flex-1 w-full p-5 gap-5">
            <Text className="font-extrabold text-4xl ">Item Info</Text>
            <View className="flex-row flex-1 w-full ">
              <View className="flex-1 gap-5 w-full">
                <Text>
                  <Text className="text-typography-500">Describtion: </Text>
                  <Text className="font-bold">{outfit?.outfitName}</Text>
                </Text>
                <Text className="text-typography-500">Brand: </Text>
                <Text className="text-typography-500">Size: </Text>
              </View>
              <View className="flex-1"></View>
            </View>
          </View>
        </VStack>
      </SafeAreaView>
    </GestureDetector>
  );
}
