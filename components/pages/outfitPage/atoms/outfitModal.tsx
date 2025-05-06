"use client"
import { View, Pressable, StyleSheet, Dimensions, Animated } from "react-native"
import Modal from "react-native-modal"
import GetOutfit from "../actions/get"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect, useRef } from "react"
import databaseService, { type OutfitWithImage } from "@/services/database/db"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const ModalComponent = ({
  id,
  visible,
  onPress,
}: {
  id: string
  visible: boolean
  onPress: () => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([])
  const slideAnim = useRef(new Animated.Value(0)).current

  // Fetch all outfits when modal opens
  useEffect(() => {
    if (visible && id) {
      const fetchOutfits = async () => {
        try {
          const fetchedOutfits = await databaseService.ListOutfits()
          setOutfits(fetchedOutfits)
          // Find the index of the current outfit
          const index = fetchedOutfits.findIndex((outfit) => outfit.$id === id)
          if (index !== -1) {
            setCurrentIndex(index)
          }
        } catch (error) {
          console.error("Error fetching outfits:", error)
        }
      }

      fetchOutfits()
    }
  }, [visible, id])

  const handleNext = () => {
    if (currentIndex < outfits.length - 1) {
      // Animate slide out to left
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex + 1)
        // Reset and animate slide in from right
        slideAnim.setValue(SCREEN_WIDTH)
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start()
      })
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Animate slide out to right
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(currentIndex - 1)
        // Reset and animate slide in from left
        slideAnim.setValue(-SCREEN_WIDTH)
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start()
      })
    }
  }

  // Swipe gesture for navigation
  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationX < -50 && currentIndex < outfits.length - 1) {
        runOnJS(handleNext)()
      } else if (event.translationX > 50 && currentIndex > 0) {
        runOnJS(handlePrevious)()
      } else if (event.translationY > 50) {
        runOnJS(onPress)()
      }
    })

  if (!visible) {
    return null
  }

  const currentId = outfits[currentIndex]?.$id || id

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onPress}
      onBackButtonPress={onPress}
      swipeDirection={["up", "down"]}
      animationIn="fadeIn"
      animationOut="fadeOut"
      useNativeDriver
      statusBarTranslucent
      style={styles.modal}
      propagateSwipe={true}
      swipeThreshold={0.2}

      backdropOpacity={0}
    >

      <View style={styles.content}>
        {/* Close button */}
        <Pressable style={styles.closeButton} onPress={onPress}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <Pressable style={[styles.navButton, styles.leftNav]} onPress={handlePrevious}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
        )}

        {currentIndex < outfits.length - 1 && (
          <Pressable style={[styles.navButton, styles.rightNav]} onPress={handleNext}>
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </Pressable>
        )}

        {/* Animated outfit details */}
        <Animated.View style={[styles.animatedContent, { transform: [{ translateX: slideAnim }] }]}>
          <GetOutfit paramid={currentId} onClose={onPress} outfits={outfits} currentIndex={currentIndex} />
        </Animated.View>
      </View>

    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },
  animatedContent: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    position: "absolute",
    top: "25%",
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  leftNav: {
    left: 10,
  },
  rightNav: {
    right: 10,
  },
})

export default ModalComponent
