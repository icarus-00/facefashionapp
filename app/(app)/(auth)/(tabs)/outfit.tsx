"use client"

import { useState, useEffect, useRef } from "react"
import { Pressable, StyleSheet, Animated, Easing } from "react-native"
import SafeAreaView from "@/components/atoms/safeview/safeview"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import SelectedItemsModal from "@/components/atoms/selectedItemsModal"
import OutFitPageComp from "@/components/pages/outfitPage/view"
import useStore from "@/store/lumaGeneration/useStore"

export default function Outfit() {
  const { getLength, outfitItems, actorItems } = useStore()
  const router = useRouter()

  const selecting = getLength() > 0
  const [modalvisible, setModalVisible] = useState(false)

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setModalVisible(selecting)

    // Button animation
    if (selecting) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [selecting, scaleAnim, rotateAnim])

  const handleForwardPress = () => {
    // Navigate to the next screen or perform action with selected items
    if (selecting && outfitItems.length > 0) {
      router.push("/(auth)/generate")
    }
  }

  // Calculate rotation for animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  })

  return (
    <SafeAreaView style={styles.container}>
      <OutFitPageComp selecting={selecting} />
      <SelectedItemsModal visible={modalvisible} />

      {/* Animated forward button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <Pressable
          style={[styles.forwardButton, selecting ? styles.activeButton : styles.inactiveButton]}
          onPress={handleForwardPress}
          android_ripple={{ color: "rgba(255,255,255,0.2)", radius: 28 }}
          disabled={!selecting || outfitItems.length === 0}
        >
          <Ionicons name={selecting ? "arrow-forward" : "add"} size={24} color="white" />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 50,
  },
  forwardButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeButton: {
    backgroundColor: "#000",
  },
  inactiveButton: {
    backgroundColor: "#333",
  },
})
