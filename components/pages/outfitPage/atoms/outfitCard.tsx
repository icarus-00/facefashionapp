import type React from "react"
import { useState, useEffect } from "react"
import { Box } from "@/components/ui/box"
import type { OutfitWithImage } from "@/interfaces/outfitDB"
import { Skeleton } from "@/components/ui/skeleton"
import { View, Image, Text, Dimensions, StyleSheet, Pressable } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
  withDelay,
} from "react-native-reanimated"

const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = 12
const itemWidth = (screenWidth - spacing * (numColumns + 3)) / numColumns
const itemHeight = itemWidth * 1.5

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
  
  // Animation values
  const itemCardScale = useSharedValue(0.95)
  
  useEffect(() => {
    // Staggered animation for cards
    itemCardScale.value = withDelay(
      index * 100 + 200,
      withSpring(1, { damping: 12, stiffness: 90 })
    )
  }, [index, itemCardScale])
  
  const cardAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: itemCardScale.value }],
      opacity: interpolate(itemCardScale.value, [0.95, 1], [0.5, 1])
    }
  })

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

  const handlePress = () => {
    itemCardScale.value = withSequence(
      withTiming(0.97, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 300 })
    )
    onPress()
  }

  return (
    <View style={[styles.container]}>
      <Animated.View style={[cardAnimStyle, { flex: 1 }]}>
        <Pressable 
          onPress={handlePress} 
          onLongPress={onLongPress}
          delayLongPress={500}
          style={{flex: 1}}
        >
          <Box style={styles.cardContainer}>
            {/* Image container */}
            <View style={styles.imageBox}>
              {renderOutfitImage()}
              
              {/* Gradient overlay for text */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              >
                <Text style={styles.outfitNameOverlay} numberOfLines={1} ellipsizeMode="tail">
                  {getOutfitName()}
                </Text>

                {getBrand() ? (
                  <View style={styles.metadataContainer}>
                    <FontAwesome name="tag" size={10} color="#f3f4f6" />
                    <Text style={styles.metadataText} numberOfLines={1} ellipsizeMode="tail">
                      {getBrand()}
                    </Text>
                  </View>
                ) : null}
              </LinearGradient>
            </View>

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
          </Box>
        </Pressable>
      </Animated.View>
    </View>
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
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBox: {
    width: "100%",
    height: itemHeight,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    borderRadius: 12,
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
    borderRadius: 12,
  },
  errorText: {
    color: "#666",
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12
  },
  outfitNameOverlay: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metadataText: {
    fontSize: 12,
    color: "#f3f4f6",
    marginLeft: 4,
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
    zIndex: 10,
  },
})
