import React, { useState, useEffect, useCallback } from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  View,
  Image,
  Dimensions,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Box } from "@/components/ui/box";
import databaseService, { OutfitWithImage } from "@/services/database/db";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ModalHeader, ModalCloseButton } from "@/components/ui/modal";
import GetOutfit from "../outfit/[get]";
import OutFitPageComp from "@/components/pages/outfitPage/view";
import Index from "@/components/pages/outfitPage";

// Define types for our data
export default function outfit() {
  const { selecting } = (useLocalSearchParams() as { selecting?: boolean }) || {
    selecting: false,
  };

  return (
    <SafeAreaView className="flex-1 ">
      <Index selecting={selecting as boolean} />
    </SafeAreaView>
  );
}
