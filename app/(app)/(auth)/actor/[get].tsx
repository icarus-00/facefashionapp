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
  const [actor, setActor] = useState<ActorWithImage>();
  const [loading, setLoading] = useState(true);
  console.log(id);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await databaseService.getActor(id as string);

        console.log(data);
        setActor(data);
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
        <Center className="flex-[3_3_0] w-full p-5">
          <View className="w-full flex-row items-center px-0 py-2">
            <BackButton />
            <View className="flex-1" />
          </View>

          <Image
            source={{ uri: actor?.imageUrl }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </Center>
        <View className="flex-[1_1_0] w-full p-5">
          <Text className="font-extrabold text-4xl ">Actor Profile</Text>
          <View className="flex-row flex-auto">
            <View className="flex-1">
              <Text>
                <Text className="text-typography-500">Actor Name: </Text>
                <Text className="font-bold">{actor?.actorName}</Text>
              </Text>
            </View>
            <View className="flex-1">
              <Text>Actor Age: </Text>
            </View>
          </View>
        </View>
        <View className="p-5 flex-grow-0">
          <Button size="full">
            <ButtonText>Dress up</ButtonText>
          </Button>
        </View>
      </VStack>
    </SafeAreaView>
  );
}
