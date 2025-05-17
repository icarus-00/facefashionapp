"use client"

import { useState, useEffect, useRef } from "react"
import { Pressable, StyleSheet, Animated, Easing } from "react-native"
import SafeAreaView from "@/components/atoms/safeview/safeview"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import SelectedItemsModal from "@/components/atoms/selectedItemsModal"
import OutFitPageComp from "@/components/pages/outfitPage/view"
import useStore from "@/store/lumaGeneration/useStore"
import { generateImage } from "@/services/generation/gen"


export default function Outfit() {
  const { getLength, outfitItems, actorItems } = useStore()
  const router = useRouter()

  const selecting = getLength() > 0
  const [modalvisible, setModalVisible] = useState(false)
  const handleNextClick = () => {

  }
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const shakeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    setModalVisible(selecting)

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
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        // Reset scale and rotation
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        // New disabled animations
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ])
        )
      ]).start()
    }
  }, [selecting, scaleAnim, rotateAnim, shakeAnim, pulseAnim])

  const handleForwardPress = async () => {
    // If selecting items and we have outfits selected, proceed to generation
    if (selecting && outfitItems.length > 0) {
      console.log("Selected items:", actorItems.imageID)
      await generateImage({
        actorRef: actorItems.imageID,
        outfitRefs: outfitItems.map((item) => item.imageID),
        prompt: "Generate an image combining the actor and outfit items"
      })
      router.push("/(app)/(auth)/(tabs)/generations")
    } 
    // If not selecting (showing plus button), navigate to actor gallery
    else if (!selecting) {
      router.push("/(app)/(auth)/(tabs)/actor")
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
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
              { translateX: shakeAnim }
            ],
            opacity: pulseAnim
          },
        ]}
      >
        <Pressable
          style={[styles.forwardButton, selecting ? styles.activeButton : styles.inactiveButton]}
          onPress={handleForwardPress}
          android_ripple={{ color: "rgba(255,255,255,0.2)", radius: 28 }}
          disabled={selecting && outfitItems.length === 0}
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
    bottom: 100,
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
    backgroundColor: "black",
  },
  inactiveButton: {
    backgroundColor: "gray",
  },
})
