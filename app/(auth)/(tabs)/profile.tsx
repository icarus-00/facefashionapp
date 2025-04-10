import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";
import { Avatars, Client } from "react-native-appwrite";
import { useRouter } from "expo-router";
import { icons } from "@/constants/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { FlashList } from "@shopify/flash-list";
import { account } from "@/services/config/appwrite";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
//empty array of four items
const { width } = Dimensions.get("window");
// Define an interface for history items

// Mock profile data (replace with real user data later)
const profileData = {
  username: "@georgia_overdrive",
  displayName: "Georgia Overdrive",
  profileImage: icons.personb, // Using existing icon instead of asset
  bio: "Digital fashion creator | AI enthusiast",
  following: 0,
  followers: 0,
  likes: 0,
};

const Profile = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"actors" | "items" | "history">(
    "actors"
  );
  const getPlaceholderData = (): any[] => {
    return Array.from({ length: 6 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }));
  };
  const displaydata: any = getPlaceholderData();
  const { width } = Dimensions.get("window");

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {};

    loadUserData();
  }, []);

  // Render a model/actor card
  const renderActorItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className=" overflow-hidden rounded-lg  aspect-square p-2"
      onPress={() => {
        /* Navigate to clothing detail */
      }}
    >
      <Skeleton className="w-full aspect-square rounded-md" />
    </TouchableOpacity>
  );

  // Render a clothing item card
  const renderClothingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className=" overflow-hidden rounded-lg  aspect-square p-2"
      onPress={() => {
        /* Navigate to clothing detail */
      }}
    >
      <Skeleton className="w-full aspect-square rounded-md" />
    </TouchableOpacity>
  );

  // Render a history item card
  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className=" overflow-hidden rounded-lg  aspect-square p-2"
      onPress={() => {
        /* Navigate to history detail */
      }}
    >
      <Skeleton className="w-full aspect-square rounded-md" />
    </TouchableOpacity>
  );
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.EXPO_PUBLIC_Appwrite_Project_ID || "");

  const result = async () => {
    console.log("start");
    const avatar = new Avatars(client);
    const url = avatar.getInitials(
      await account.get().then((response) => {
        console.log(response);
        return response.name;
      })
    );
    console.log(url);
    return url;
  };
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    result().then((url) => setUrl(url.toString()));
  }, []);

  console.log(url);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Profile Header */}
        <View className="items-center flex-1 pt-4 pb-2 px-4 border-b border-gray-200">
          <View className="relative">
            <Image source={{ uri: url }} className="w-24 h-24 rounded-full" />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-cyan-500 w-8 h-8 rounded-full items-center justify-center"
              onPress={() => {
                console.log("pressed" + url);
              }}
            >
              <Text className="text-white text-xl">+</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold mt-2">{profileData.username}</Text>

          {/* Stats Row */}
          <View className="flex-row justify-center mt-4 w-full">
            <View className="items-center mx-6">
              <Text className="text-xl font-bold">{profileData.following}</Text>
              <Text className="text-gray-500">Following</Text>
            </View>

            <View className="items-center mx-6">
              <Text className="text-xl font-bold">{profileData.followers}</Text>
              <Text className="text-gray-500">Followers</Text>
            </View>

            <View className="items-center mx-6">
              <Text className="text-xl font-bold">{profileData.likes}</Text>
              <Text className="text-gray-500">Likes</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <View className="flex-row mt-4 w-full">
            <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg border border-gray-300">
              <Text className="text-black text-center font-semibold">
                Edit profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="ml-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
              <Text className="text-black">▼</Text>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <TouchableOpacity className="mt-3 mb-2 w-full items-center">
            <Text className="text-center text-gray-500">+ Add bio</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "actors" ? "border-b-2 border-black" : ""
            }`}
            onPress={() => setActiveTab("actors")}
          >
            <Text className={activeTab === "actors" ? "font-bold" : ""}>
              Actors
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "items" ? "border-b-2 border-black" : ""
            }`}
            onPress={() => setActiveTab("items")}
          >
            <Text className={activeTab === "items" ? "font-bold" : ""}>
              Items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 items-center py-3 ${
              activeTab === "history" ? "border-b-2 border-black" : ""
            }`}
            onPress={() => setActiveTab("history")}
          >
            <Text className={activeTab === "history" ? "font-bold" : ""}>
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View className="flex-1">
          {activeTab === "actors" &&
            (displaydata.length > 0 ? (
              <FlashList
                data={displaydata}
                renderItem={renderActorItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{ padding: 2 }}
                estimatedItemSize={width / 3}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">No actors added yet</Text>
                <TouchableOpacity className="mt-4 bg-primary py-2 px-4 rounded-lg">
                  <Text className="text-white font-medium">Add Actors</Text>
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === "items" &&
            (displaydata.length > 0 ? (
              <FlashList
                data={displaydata}
                renderItem={renderClothingItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                estimatedItemSize={width / 3}
                contentContainerStyle={{ padding: 2 }}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">
                  No clothing items added yet
                </Text>
                <TouchableOpacity className="mt-4 bg-primary py-2 px-4 rounded-lg">
                  <Text className="text-white font-medium">
                    Add Clothing Items
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === "history" &&
            (displaydata.length > 0 ? (
              <FlashList
                data={displaydata}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={{ padding: 2 }}
                estimatedItemSize={width / 3}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">No generation history yet</Text>
                <TouchableOpacity className="mt-4 bg-primary py-2 px-4 rounded-lg">
                  <Text className="text-white font-medium">
                    Create Generation
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
      {/* Bottom Tab Bar - This would typically be handled by the app's navigation */}
    </SafeAreaView>
  );
};

export default Profile;

{
  ///the footer
  /*
  <View className="flex-row justify-around py-3 border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <Text className="text-2xl">|||</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-2xl">🔒</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-2xl">✉️</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-2xl">👤</Text>
        </TouchableOpacity>
      </View>*/
}
