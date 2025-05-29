import { memo } from "react"
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform, Text } from "react-native"
import { Image } from "expo-image"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckIcon } from "@/components/ui/icon"
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = Platform.OS === "android" ? 10 : 7 // Increased spacing for Android
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
  actorSelected: boolean // <-- add this prop
}

const OutfitCard = memo(({ item, loading, index, onPress, onLongPress, selecting, selected, actorSelected }: OutfitCardProps) => {
  // Check if the item is a placeholder
  const isPlaceholder = "isPlaceholder" in item
  console.log(selecting)

  if (loading || isPlaceholder) {
    return (
      <View style={styles.card}>
        <Skeleton style={styles.skeleton} />
      </View>
    )
  }

  // Checkbox: show if in selection mode
  const showCheckbox = selecting;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={selecting ? onLongPress : undefined}
      style={[
        styles.card,
        selected && styles.selectedCard,
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

      {/* Custom Checkbox (bottom left) */}
      {showCheckbox && (
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxOuter}>
            {selected ? <View style={styles.checkboxInner} /> : null}
          </View>
        </View>
      )}

      {/* Selection indicator - Always show when selected (top right) */}
      {selected && (
        <View style={styles.selectedIndicator}>
          <CheckIcon color="white" />
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
})

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
    // Android-specific adjustments
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6D28D9",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    zIndex: 10,
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#111",
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

OutfitCard.displayName = 'OutfitCard';
export default OutfitCard
