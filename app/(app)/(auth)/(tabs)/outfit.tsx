"use client";

import { useState } from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RootNav from "@/components/atoms/rootNavBar";
import SelectedItemsModal from "@/components/atoms/selectedItemsModal";
import OutFitPageComp from "@/components/pages/outfitPage/view";
import useStore from "@/store/lumaGeneration/useStore";

export default function outfit() {
  const { getLength, outfitItems, actorItems } = useStore();

  const selecting = getLength() > 0;
  const [modalvisible, setModalVisible] = useState(selecting);

  return (
    <SafeAreaView className="flex-1">
      <RootNav
        name="RenderWear"
        onPress={() => {
          setModalVisible(true);
        }}
      />

      <OutFitPageComp selecting={selecting} />
      <SelectedItemsModal visible={modalvisible} />

      {/* Improved button styling and positioning */}
      {selecting && <View  className="absolute right-0 bottom-0 items-center justify-center p-5">
        <Pressable
          className="w-16 h-16 rounded-full bg-black items-center justify-center shadow-md"
          style={{
            elevation: 5, // Android shadow
            shadowColor: "#000", // iOS shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>
      </View>}
    </SafeAreaView>
  );
}
