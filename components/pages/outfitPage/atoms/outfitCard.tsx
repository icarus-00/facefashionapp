import { memo } from "react"
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform, Text } from "react-native"
import { Image } from "expo-image"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckIcon } from "@/components/ui/icon"
import { LinearGradient } from "expo-linear-gradient"

const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = Platform.OS === "android" ? 10 : 7
const itemWidth = (screenWidth - spacing * (numColumns + 3)) / numColumns
const itemHeight = itemWidth * 1.5

interface OutfitCardProps {
  item: any
  loading: boolean
  index: number
  onPress: () => void
  onLongPress: () => void
  selecting: boolean
  selected: boolean
  actorSelected: boolean
}

const OutfitCard = ({ item, loading, index, onPress, onLongPress, selecting, selected, actorSelected }: OutfitCardProps) => {
  // Check if the item is a placeholder
  const isPlaceholder = "isPlaceholder" in item

  if (loading || isPlaceholder) {
    return (
      <View style={styles.card}>
        <Skeleton style={styles.skeleton} />
      </View>
    )
  }

  // Use the selected prop directly from parent
  const isSelected = selected

  // Checkbox: show if in selection mode
  const showCheckbox = selecting

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={selecting ? onLongPress : undefined}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        Platform.OS === "android" && styles.androidCard,
      ]}
      disabled={false}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />

      {/* Selection indicator - Show in selection mode */}
      {showCheckbox && (
        <View style={[
          styles.selectedIndicator,
          isSelected ? styles.selectedIndicatorSelected : styles.selectedIndicatorUnselected
        ]}>
          {isSelected && <CheckIcon color="white\" width={16} height={16} />}
        </View>
      )}

      {/* Outfit name label */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradientLabel}
      >
        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
          {item.outfitName}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

// Removed the custom memo comparison to let React handle rerenders naturally
export default memo(OutfitCard)

const styles = StyleSheet.create({
  card: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  androidCard: {
    marginBottom: 4,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#6D28D9",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  skeleton: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    borderWidth: 2,
  },
  selectedIndicatorUnselected: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    borderColor: "rgba(0, 0, 0, 0.3)", // Faded black border
  },
  selectedIndicatorSelected: {
    backgroundColor: "#000", // Solid black when selected
    borderColor: "#000",
  },
  gradientLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 8
  },
  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
})