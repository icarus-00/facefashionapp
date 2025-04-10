import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { AntDesign } from "@expo/vector-icons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors["light"].tabIconSelected[500],
        animation: "shift",
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: Colors["light"].primary[500],
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 40,
          height: 60,
          position: "absolute",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          alignContent: "center",
          paddingHorizontal: 20,

          borderWidth: 1,
          borderColor: "#0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="actor"
        options={{
          title: "Actor",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="outfit"
        options={{
          title: "outfit",
          tabBarIcon: ({ color }) => (
            <AntDesign name="skin" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="generations"
        options={{
          title: "generator",
          tabBarIcon: ({ color }) => (
            <AntDesign name="copy1" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "prifle",
          tabBarIcon: ({ color }) => (
            <AntDesign name="copy1" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
