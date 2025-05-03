"use client"

import type React from "react"

import { Box } from "@/components/ui/box"
import type { OutfitWithImage } from "@/interfaces/outfitDB"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { View, Image, Text, Dimensions, TouchableOpacity } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated"

const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = 2
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns
const itemHeight = itemWidth * 1.777
const DEFAULT_IMAGE = "https://placehold.co/900x1600"

// Create a union type for outfit data items
type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true }

// Props for OutfitCard component
interface OutfitCardProps {
  item: OutfitItem
  loading: boolean
  index: number
  selected?: boolean
  onLongPress?: () => void
  onPress: () => void
  selecting: boolean
}

export default function OutfitCard({
  item,
  loading,
  index,
  selected,
  onLongPress,
  onPress,
  selecting,
}: OutfitCardProps): React.JSX.Element {
  const [fallbackImage, setFallbackImage] = useState<boolean>(false)

  // Animation for checkbox opacity
  const checkboxOpacity = useSharedValue(0)

  // Use useEffect to update the animation value when selecting changes
  useEffect(() => {
    checkboxOpacity.value = withTiming(selecting ? 1 : 0, { duration: 200 })
  }, [selecting])

  const checkboxAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: checkboxOpacity.value,
    }
  })

  // Check if item is a placeholder
  const isPlaceholder = "isPlaceholder" in item

  // Safe way to get outfit name
  const getOutfitName = (): string => {
    if (isPlaceholder) return "Loading..."
    return item.outfitName || "Unknown outfit"
  }

  // Safe way to render image
  const renderOutfitImage = (): React.JSX.Element => {
    if (loading || isPlaceholder) {
      return <Skeleton variant="sharp" style={{ width: "100%", height: "100%" }} />
    }

    try {
      // Use the imageUrl from OutfitWithImage
      const outfitItem = item as OutfitWithImage
      return (
        <Image
          source={{
            uri: fallbackImage ? DEFAULT_IMAGE : outfitItem.imageUrl,
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setFallbackImage(true)}
        />
      )
    } catch (error) {
      console.error("Image rendering error:", error)
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#666" }}>Image not available</Text>
        </View>
      )
    }
  }

  // Create a gesture for long press
  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .minDuration(500)
    .onStart(() => {
      if (onLongPress) {
        onLongPress()
      }
    })

  return (
    <GestureDetector gesture={longPressGesture}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={{
          width: itemWidth,
          height: itemHeight,
          margin: spacing / 2,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
            position: "relative",
          }}
        >
          <Box
            style={{
              width: itemWidth,
              height: itemHeight,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <View style={{ width: "100%", height: "100%" }}>{renderOutfitImage()}</View>
          </Box>

          {/* Item info overlay at bottom */}
          {!isPlaceholder && !loading && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "500" }} numberOfLines={1} ellipsizeMode="tail">
                {getOutfitName()}
              </Text>
              {!isPlaceholder && (item as OutfitWithImage).brand && (
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }} numberOfLines={1} ellipsizeMode="tail">
                  {(item as OutfitWithImage).brand}
                </Text>
              )}
            </View>
          )}

          {/* Checkbox - only show when in selecting mode */}
          {selecting && (
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  borderRadius: 12,
                  padding: 2,
                },
                checkboxAnimatedStyle,
              ]}
            >
              {selected ? (
                <Ionicons name="checkbox" size={22} color="#0066cc" />
              ) : (
                <Ionicons name="checkbox-outline" size={22} color="#666666" />
              )}
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </GestureDetector>
  )
}
