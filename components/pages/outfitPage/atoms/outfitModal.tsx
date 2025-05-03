"use client"

import { View, Pressable, Text, StyleSheet } from "react-native"
import Modal from "react-native-modal"
import GetOutfit from "../actions/get"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ModalComponent = ({
  id,
  visible,
  onPress,
}: {
  id: string
  visible: boolean
  onPress: () => void
}) => {
  const insets = useSafeAreaInsets()

  if (!visible) {
    return null
  }

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
      backdropOpacity={0.7}
      style={styles.modal}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <Pressable onPress={onPress} style={styles.backdrop} />
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.headerTitle}>Item Details</Text>
            <Pressable onPress={onPress} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
          </View>
          <GetOutfit paramid={id} onClose={onPress} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    backgroundColor: "white",
    width: "100%",
    height: "90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  handle: {
    position: "absolute",
    top: 8,
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
})

export default ModalComponent
