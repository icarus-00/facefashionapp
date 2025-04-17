import { Ionicons } from "@expo/vector-icons";
import Data from "./interfaces/interface";
import useStore from "@/store/lumaGeneration/useStore";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const SelectedItemsModal = ({ onClose }: { onClose: () => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Data>({
    actorImageID: "",
    actorImageUrl: "",
    outfitItems: [],
    userId: "",
    length: 0,
    outfitImageUrls: [],
  });

  const {
    actorImageID,
    actorImageUrl,
    outfitItems,
    userId,
    length,
    outfitImageUrls,
  } = useStore();

  useEffect(() => {
    setSelectedItems({
      actorImageID,
      actorImageUrl,
      outfitItems,
      userId,
      length,
      outfitImageUrls,
    });
  }, [
    actorImageID,
    actorImageUrl,
    outfitItems,
    userId,
    length,
    outfitImageUrls,
  ]);
  //drawer like modal
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("window").width / 2,
        height: Dimensions.get("window").height * 0.75,
        position: "absolute",
        left: 0,
        top:
          (Dimensions.get("window").height -
            Dimensions.get("window").height * 0.75) /
          2,
      }}
    >
      <Pressable
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
        onPress={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        ></View>
      </Pressable>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 1, padding: 20 }}></View>
      </View>
    </Modal>
  );
};

function ModalButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity>
      <Ionicons name="images-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}

export { ModalButton };
export default SelectedItemsModal;
