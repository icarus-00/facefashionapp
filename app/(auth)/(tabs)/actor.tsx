import React, { useState, useEffect, useCallback } from "react";
import { ThemedView } from "@/components/ThemedView";
import { View, Image, Dimensions, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { ActorWithImage } from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";
import { Modal } from "@/components/ui/modal";
import ActorPageComp from "@/components/pages/actorPage/view";
import RootNav from "@/components/atoms/rootNavBar";
// Define types for our data

export default function Actor(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-background-100">
      <RootNav name="RenderWear" onPress={() => {}} />
      <ActorPageComp />
    </SafeAreaView>
  );
}
