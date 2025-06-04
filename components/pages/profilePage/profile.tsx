import ActivitySpinner from "@/components/atoms/activitySpinner/activitySpinner";
import { account, client } from "@/services/config/appwrite";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
} from "react-native";
import { Avatars } from "react-native-appwrite";
import { Dialog } from "@rneui/themed";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { ScrollView } from "react-native-gesture-handler";
import { useUser } from "@/context/authcontext";
import databaseService, { ActorWithImage, OutfitWithImage, generationsWithImage } from "@/services/database/db";
import Modal from "react-native-modal";
import { grabUserStatus } from "@/services/config/user-optin";
import storageService from "@/services/config/files";

const { width } = Dimensions.get("window");
const numColumns = 3;
const spacing = 8;
const itemWidth = (width - spacing * (numColumns + 1)) / numColumns;

const ProfilePage = ({ onEditProfile }: { onEditProfile: () => void }) => {
  const router = useRouter();
  const { logout } = useUser();
  const [activeTab, setActiveTab] = useState<'history'>('history');
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    url: string;
  }>();

  // State for actual data
  const [actors, setActors] = useState<ActorWithImage[]>([]);
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([]);
  const [generations, setGenerations] = useState<generationsWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      const avatar = new Avatars(client as any);
      const userAccount = await account.get();
      const url = avatar.getInitials(userAccount.name).toString();
      const avatarImage = await grabUserStatus();
      const avatarImageUrl = avatarImage?.documents?.[0]?  await storageService.getfilepreview(avatarImage.documents[0].avatar_file_id) : null;
      setAvatarImage(avatarImageUrl || url);
      setUserDetails({
        name: userAccount.name,
        email: userAccount.email,
        url: url,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  // Fetch actors data
  const fetchActors = useCallback(async () => {
    try {
      const data = await databaseService.listActors();
      setActors(data);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  }, []);

  // Fetch outfits data
  const fetchOutfits = useCallback(async () => {
    try {
      const data = await databaseService.ListOutfits();
      setOutfits(data);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  }, []);

  // Fetch generations data
  const fetchGenerations = useCallback(async () => {
    try {
      const data = await databaseService.listGenerations();
      setGenerations(data);
    } catch (error) {
      console.error("Error fetching generations:", error);
    }
  }, []);
  console.log("fullscreenImage", fullscreenImage);

  // Load all data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchActors(),
        fetchOutfits(),
        fetchGenerations()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchUserProfile, fetchActors, fetchOutfits, fetchGenerations]);

  // Initial data loading
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleLogout = async () => {
    await logout();
  };

  // Navigate to actor detail
  const navigateToActor = (actor: ActorWithImage) => {
    console.log("Navigating to actor detail:", actor);
  };

  // Navigate to outfit detail
  const navigateToOutfit = (outfit: OutfitWithImage) => {
    console.log("Navigating to outfit detail:", outfit);
  };

  // Navigate to generation detail
  const navigateToGeneration = (generation: generationsWithImage) => {
    router.push({
      pathname: "/(app)/(auth)/(tabs)/(generation)/generations",
      params: { id: generation.$id }
    });
  };

  // Render a model/actor card
  const renderActorItem = ({ item }: { item: ActorWithImage }) => (
    <TouchableOpacity
      className="overflow-hidden rounded-lg"
      style={{
        width: itemWidth,
        height: itemWidth * 1.5,
        margin: spacing / 2
      }}
      onPress={() => navigateToActor(item)}
    >
      {loading ? (
        <Skeleton style={{ width: "100%", height: "100%", borderRadius: 8 }} />
      ) : (
        <>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <Text className="text-white text-sm font-medium" numberOfLines={1}>
              {item.actorName}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  // Render a clothing item card
  const renderClothingItem = ({ item }: { item: OutfitWithImage }) => (
    <TouchableOpacity
      className="overflow-hidden rounded-lg"
      style={{
        width: itemWidth,
        height: itemWidth * 1.2,
        margin: spacing / 2
      }}
      onPress={() => navigateToOutfit(item)}
    >
      {loading ? (
        <Skeleton style={{ width: "100%", height: "100%", borderRadius: 8 }} />
      ) : (
        <>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <Text className="text-white text-sm font-medium" numberOfLines={1}>
              {item.outfitName}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );

  // Render a history item card (no overlay, image focus top, fullscreen on press)
  const renderHistoryItem = ({ item }: { item: generationsWithImage }) => (
    <TouchableOpacity
      className="overflow-hidden rounded-lg"
      style={{
        width: itemWidth,
        height: itemWidth * 1.2,
        margin: spacing / 2,
      }}
      onPress={() => {
        if (!loading && item.state !== "generating") setFullscreenImage(item.generationImageUrl);
      }}
      activeOpacity={0.85}
    >
      {loading || item.state === "generating" ? (
        <Skeleton style={{ width: "100%", height: "100%", borderRadius: 8 }} />
      ) : (
        <Image
          source={{ uri: item.generationImageUrl }}
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="h-full bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Profile Header */}
      <View className="items-center pt-4 pb-2 px-4 border-b border-gray-200">
        <View className="relative">
          {loading ? (
            <Skeleton width={96} height={96} circle />
          ) : (
            <Image
              source={{ uri: avatarImage || userDetails?.url }}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"

            />
          )}
        </View>
        <View className="w-full flex items-center justify-center">
          {loading ? (
            <>
              <Skeleton width={150} height={24} style={{ marginTop: 8 }} />
              <Skeleton width={200} height={16} style={{ marginTop: 8 }} />
            </>
          ) : (
            <>
              <Text className="text-xl font-bold mt-2 w-full text-center">
                {userDetails?.name}
              </Text>
              <Text className="text-sm font-bold text-secondary-500 mt-2 w-full text-center">
                {userDetails?.email}
              </Text>
            </>
          )}
        </View>

        {/* Edit Profile Button */}
        <View className="flex-row mt-4 w-full">
          <TouchableOpacity className="flex-1 bg-gray-100 py-2 rounded-lg border border-gray-300" onPress={onEditProfile}>
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
      </View>

      {/* Only show history tab and content */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 border-black`}
          onPress={() => setActiveTab('history')}
        >
          <Text className={"font-bold"}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View className="flex-1 w-full">
        {generations.length > 0 ? (
          <FlashList
            data={generations}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.$id}
            numColumns={3}
            estimatedItemSize={itemWidth * 1.2}
            contentContainerStyle={{ padding: spacing / 2 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            removeClippedSubviews
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No generation history yet</Text>
            <TouchableOpacity
              className="mt-4 bg-primary py-2 px-4 rounded-lg"
              onPress={() => router.push("/(app)/(auth)/(tabs)/(generation)/chat")}
            >
              <Text className="text-white font-medium">
                Create Generation
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Fullscreen image modal using react-native-modal */}
        <Modal
          isVisible={!!fullscreenImage}
          onBackdropPress={() => setFullscreenImage(null)}
          onBackButtonPress={() => setFullscreenImage(null)}
          style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
        >
          <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.95)' }}>
            <TouchableOpacity style={{ position: "absolute", top: 40, right: 20, zIndex: 101 }} onPress={() => setFullscreenImage(null)}>
              <Ionicons name="close" size={36} color="#fff" />
            </TouchableOpacity>



            <Image
              source={{ uri: fullscreenImage! }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}

              onError={e => console.log('Image load error', e.nativeEvent)}
            />


          </View>
        </Modal>
      </View>
    </View>
  );
};

export default ProfilePage;
