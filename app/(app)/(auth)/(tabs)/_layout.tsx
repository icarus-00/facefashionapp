import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Platform, Easing } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import BlurTabBarBackground from "../../../../components/ui/TabBarBackground.ios";

const { width } = Dimensions.get("window");
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors["light"].offwhite[500],
        animation: "shift",
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: Colors["light"].primary[500],
        },
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarStyle: {
          backgroundColor: Colors["light"].primary[500],
          width: width - 20,
          height:  70,
          alignContent: "center",
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: "#0f0d23",
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: 50,
          position: 'absolute',
          overflow: 'hidden',
          bottom: 20,
          marginHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",

          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="home" size={width / 15} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="actor"
        options={{
          headerShown: false,
          title: "Actor",

          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={width / 15} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfit"
        options={{
          title: "outfit",
          tabBarIcon: ({ color }) => (
            <Ionicons name="shirt" size={width / 15} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generations"
        options={{
          title: "generator",
          tabBarIcon: ({ color }) => (
            <Ionicons name="color-wand" size={width / 15} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-circle-outline"
              size={width / 15}
              color={color}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}

/*
tabBarStyle: {
          backgroundColor: Colors["light"].primary[500],
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 40,
          height: width / 7,
          position: "absolute",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          alignContent: "center",
          paddingHorizontal: 20,

          borderWidth: 1,
          borderColor: "#0f0d23",
        },*/
