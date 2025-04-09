import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
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
export default function GetActor() {
  const { id } = useLocalSearchParams();
  const [outfit, setOutfit] = useState<OutfitWithImage>();
  const [loading, setLoading] = useState(true);
  console.log(id);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await databaseService.getOutfit(id as string);

        console.log(data);
        setOutfit(data);
      } catch (error) {
        console.error("Error fetching actors: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <SafeAreaView className="flex-1">
      <VStack className="flex-1">
        <Center className="flex-1 w-full p-5">
          <View className="w-full flex-row items-center px-0 py-2">
            <BackButton />
            <View className="flex-1" />
          </View>
          <Image
            source={{ uri: outfit?.imageUrl }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </Center>
        <View className="flex-[1_1_0] w-full p-5 gap-5">
          <Text className="font-extrabold text-4xl ">Item Info</Text>
          <View className="flex-row flex-auto ">
            <View className="flex-1 gap-5">
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
  );
}
