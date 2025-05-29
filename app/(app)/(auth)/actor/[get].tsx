import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import { VStack } from "@/components/ui/vstack";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useStore from "@/store/lumaGeneration/useStore";
const { width } = Dimensions.get("window");

const BackButton = () => (
  <TouchableOpacity
    style={{ padding: 8, backgroundColor: "transparent", borderRadius: 999 }}
    onPress={() => router.back()}
    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
  >
    <AntDesign name="arrowleft" size={24} color="black" />
  </TouchableOpacity>
);

const Loading = () => (
  <Center style={{ flex: 1, width: "100%", height: "100%" }}>
    <Spinner size="large" />
  </Center>
);

export default function GetActor() {
  const { updateActorItems } = useStore();
  const { get } = useLocalSearchParams(); // Use 'get' param from route
  const [actor, setActor] = useState<ActorWithImage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (get) {
        const data = await databaseService.getActor(get as string);
        setActor(data);
      }
    } catch (error) {
      console.error("Error fetching actor: ", error);
    } finally {
      setLoading(false);
    }
  }, [get]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;
  if (!actor)
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text style={{ color: "#888", fontSize: 18 }}>Actor not found.</Text>
        <Button className="mt-4" onPress={() => router.back()}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack className="flex-1">
        <View style={{ flex: 1, width: "100%", padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <BackButton />
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Actor Profile
            </Text>
            <View style={{ width: 32 }} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              {actor?.imageUrl ? (
                <Image
                  source={{ uri: actor.imageUrl }}
                  style={{
                    width: width * 0.8,
                    height: width * 1.1,
                    borderRadius: 16,
                    backgroundColor: "#eee",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: width * 0.8,
                    height: width * 1.1,
                    borderRadius: 16,
                    backgroundColor: "#eee",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No image</Text>
                </View>
              )}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  justifyContent: "flex-end",
                  paddingHorizontal: 16,
                  paddingBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  {actor?.actorName}
                </Text>
              </LinearGradient>
            </View>
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                Bio
              </Text>
              <Text style={{ color: "#444", fontSize: 16 }}>
                {actor?.bio || "No bio provided."}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, minWidth: 120, marginBottom: 8 }}>
                <Text style={{ color: "#888" }}>Age</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {actor?.age ?? "-"}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, marginBottom: 8 }}>
                <Text style={{ color: "#888" }}>Height</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {actor?.height ?? "-"} cm
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, marginBottom: 8 }}>
                <Text style={{ color: "#888" }}>Weight</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {actor?.weight ?? "-"} kg
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, marginBottom: 8 }}>
                <Text style={{ color: "#888" }}>Gender</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {actor?.gender ?? "-"}
                </Text>
              </View>
              <View style={{ flex: 1, minWidth: 120, marginBottom: 8 }}>
                <Text style={{ color: "#888" }}>Genre</Text>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {actor?.genre ?? "-"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ padding: 20, paddingTop: 0 }}>
          <Button
            size="full"
            onPress={() => {
              updateActorItems(
                actor.fileID,
                actor.imageUrl,
                actor.actorName,
                actor.age,
                actor.weight, // weight
                actor.height, // height
                actor.bio,
                actor.gender,
                actor.genre
              );
              router.push("/(app)/(auth)/(tabs)/outfit")
            }
            }
          >
            <ButtonText>Dress up</ButtonText>
          </Button>
        </View>
      </VStack>
    </SafeAreaView>
  );
}
