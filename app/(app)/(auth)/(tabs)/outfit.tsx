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
import useStore from "@/store/lumaGeneration/useStore";
import RootNav from "@/components/atoms/rootNavBar";
import SelectedItemsModal from "@/components/atoms/selectedItemsModal";
import SubCategoriesExbandableFilter from "@/components/atoms/subCategories";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
// Define types for our data
export default function outfit() {
  const { getLength, outfitItems, actorItems } = useStore();
  const [modalvisible, setModalVisible] = useState(false);
  const selecting = getLength() > 0;
  console.log(actorItems);
  console.log(getLength());
  console.log(selecting);

  console.log("modal visible", modalvisible);
  return (
    <SafeAreaView className="flex-1 ">
      <RootNav
        name="RenderWear"
        onPress={() => {
          setModalVisible(true);
        }}
      />

      <OutFitPageComp selecting={selecting} />
      <SelectedItemsModal
        onClose={() => {
          setModalVisible(false);
        }}
        visible={modalvisible}
      />
    </SafeAreaView>
  );
}
