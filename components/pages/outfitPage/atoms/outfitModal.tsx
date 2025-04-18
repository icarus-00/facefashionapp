import { ModalHeader } from "@/components/ui/modal";
import { View, Pressable } from "react-native";
import Modal from "react-native-modal";
import GetOutfit from "../actions/get";
import { Overlay } from "@gluestack-ui/overlay";

const ModalComponent = ({
  id,
  visible,
  onPress,
}: {
  id: string;
  visible: boolean;
  onPress: () => void;
}) => {
  if (!visible) {
    return null;
  } else if (visible) {
    return (
      <Modal
        accessible
        animationIn="slideInUp"
        animationOut="slideOutDown"
        swipeThreshold={50}
        isVisible={visible}
        onBackButtonPress={onPress}
        swipeDirection={"down"}
        onSwipeComplete={onPress}
        backdropColor="black"
      >
        <View className="flex-1 justify-center items-center ">
          <Pressable
            onPress={onPress}
            className="flex-1 absolute h-full w-full"
          />
          <View className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden">
            <ModalHeader className="flex-row px-2 py-1 bg-white justify-center">
              <View className="h-1 w-20 rounded-full bg-primary-400" />
            </ModalHeader>
            <GetOutfit paramid={id} onClose={onPress} />
          </View>
        </View>
      </Modal>
    );
  }
};
export default ModalComponent;
