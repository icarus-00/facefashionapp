import type React from "react"
import { useState } from "react"
import { Box } from "@/components/ui/box"
import type { OutfitWithImage } from "@/interfaces/outfitDB"
import { Skeleton } from "@/components/ui/skeleton"
import { View, Image, Text, Dimensions, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Pressable } from "react-native-gesture-handler"
const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = 4
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns
// Using 9:16 aspect ratio (portrait)
const itemHeight = itemWidth * 1.6

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

  // Check if item is a placeholder
  const isPlaceholder = "isPlaceholder" in item

  // Safe way to get outfit name
  const getOutfitName = (): string => {
    if (isPlaceholder) return "Loading..."
    return item.outfitName || "Unknown outfit"
  }

  // Safe way to get brand
  const getBrand = (): string => {
    if (isPlaceholder) return ""
    return (item as OutfitWithImage).brand || ""
  }

  // Safe way to get theme
  const getTheme = (): string => {
    if (isPlaceholder) return ""
    return (item as OutfitWithImage).attireTheme || ""
  }

  // Safe way to render image
  const renderOutfitImage = (): React.JSX.Element => {
    if (loading || isPlaceholder) {
      return <Skeleton variant="sharp" style={styles.image} />
    }

    try {
      // Use the imageUrl from OutfitWithImage
      const outfitItem = item as OutfitWithImage
      return (
        <Image
          source={{
            uri: fallbackImage ? DEFAULT_IMAGE : outfitItem.imageUrl,
          }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setFallbackImage(true)}
        />
      )
    } catch (error) {
      console.error("Image rendering error:", error)
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Image not available</Text>
        </View>
      )
    }
  }

  return (
    <Pressable onPress={() => onPress()} onLongPress={onLongPress} delayLongPress={500} style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Image container */}
        <Box style={styles.imageBox}>{renderOutfitImage()}</Box>

        {/* Info section below image */}
        <View style={styles.infoSection}>
          <Text style={styles.outfitName} numberOfLines={1} ellipsizeMode="tail">
            {getOutfitName()}
          </Text>

          {getBrand() ? (
            <Text style={styles.brandText} numberOfLines={1} ellipsizeMode="tail">
              {getBrand()}
            </Text>
          ) : null}

          {getTheme() ? (
            <Text style={styles.themeText} numberOfLines={1} ellipsizeMode="tail">
              {getTheme()}
            </Text>
          ) : null}
        </View>

        {/* Selection indicator */}
        {selecting && (
          <View style={styles.selectionIndicator}>
            {selected ? (
              <Ionicons name="checkmark-circle" size={22} color="#000" />
            ) : (
              <Ionicons name="ellipse-outline" size={22} color="#666" />
            )}
          </View>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    height: itemHeight + 60, // Extra height for info section
    margin: spacing / 2,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  imageBox: {
    width: "100%",
    height: itemHeight,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  errorContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#666",
  },
  infoSection: {
    padding: 8,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  brandText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  themeText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 2,
  },
})
