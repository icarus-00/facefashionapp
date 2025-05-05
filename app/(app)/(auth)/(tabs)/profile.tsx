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
import SafeAreaView from "@/components/atoms/safeview/safeview";import ProfilePage from "@/components/pages/profilePage/profile";
import { ThemedView } from "@/components/ThemedView";
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
  return (
    <SafeAreaView>
      <ProfilePage />
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
