import ActivitySpinner from "@/components/atoms/activitySpinner/activitySpinner";
import { account, client } from "@/services/config/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
} from "react-native";
import {  Avatars } from "react-native-appwrite";
import { Dialog } from "@rneui/themed";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { ScrollView } from "react-native-gesture-handler";
import { useUser } from "@/context/authcontext";
import { client as sClient } from "@/utils/config/supabase";
const { width } = Dimensions.get("window");
const ProfilePage = () => {
  const router = useRouter();
  const { logout } = useUser();
  const [activeTab, setActiveTab] = useState<"actors" | "items" | "history">(
    "actors"
  );
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    url: string;
  }>();

  const [loading, setLoading] = useState(true);

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
  const handleLogout = async () => {
    await logout();
  };
  // Render a model/actor card
  const renderActorItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className=" overflow-hidden rounded-lg w-full h-full aspect-square p-2"
      onPress={() => {
        /* Navigate to clothing detail */
      }}
    >
      <Skeleton style={{ width: "100%", height: "100%" }} />
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

  const result = async () => {
    console.log("start");
    const avatar = new Avatars(client);
    const url = avatar
      .getInitials(
        await account.get().then((response) => {
          console.log(response);
          return response.name;
        })
      )
      .toString();
    const name = (await account.get()).name;
    const email = (await account.get()).email;
    return { name: name, email: email, url: url };
  };

  useEffect(() => {
    setLoading(true);
    result()
      .then(({ name, email, url }) => setUserDetails({ name, email, url: url }))
      .finally(() => setLoading(false));
  }, []);

  console.log(userDetails);

  return (
    <ScrollView>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Profile Header */}
      <View className="items-center flex-1 pt-4 pb-2 px-4 border-b border-gray-200">
        <View className="relative">
          <Image
            source={{ uri: userDetails?.url }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-cyan-500 w-8 h-8 rounded-full items-center justify-center">
            <Text className="text-white text-xl">+</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex items-center justify-center">
          <Text className="text-xl font-bold mt-2 w-full text-center">
            {userDetails?.name}
          </Text>
          <Text className="text-sm font-bold text-secondary-500 mt-2 w-full text-center">
            {userDetails?.email}
          </Text>
        </View>
        {/* Stats Row */}

        {/* Edit Profile Button */}
        <View className="flex-row mt-4 w-full">
          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg border border-gray-300">
            <Text className="text-black text-center font-semibold">
              Edit profile
            </Text>
          </TouchableOpacity>
          <Menu
            placement="bottom"
            offset={5}
            trigger={({ ...triggerProps }) => (
              <TouchableOpacity
                {...triggerProps}
                className="ml-2 bg-gray-100 px-4 py-2 rounded-lg border mx-4 border-gray-300"
              >
                <Ionicons name="arrow-down" size={24} color="black" />
              </TouchableOpacity>
            )}
          >
            <MenuItem
              onPress={handleLogout}
              key="logout"
              textValue="Logout"
              className="bg-red-200 text-black"
            >
              <Ionicons name="log-out-sharp" size={20} className="mr-2" />
              <Text>Logout</Text>
            </MenuItem>
          </Menu>
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
      <View className="flex-1 w-full">
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
              <Text className="text-gray-500">No clothing items added yet</Text>
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
  );
};

export default ProfilePage;
