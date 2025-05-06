"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { View, Text, Pressable, ScrollView, type LayoutChangeEvent, Dimensions, StyleSheet } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  runOnJS,
} from "react-native-reanimated"
import { Ionicons } from "@expo/vector-icons"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const EXPANDED_HEIGHT = 240 // Static height for expanded overlay
const MAX_CHIP_WIDTH_PERCENTAGE = 0.45 // Maximum width a chip can take (as % of container)

interface ChipMeasurement {
  theme: string
  width: number
  measured: boolean
}

interface SubCategoriesFilterProps {
  themes: string[]
  loading?: boolean
  selected?: string | string[]
  multiSelect?: boolean
  onChange: (selection: string | string[]) => void
}

export default function SubCategoriesExbandableFilter({
  themes = [],
  loading = false,
  selected = [],
  multiSelect = false,
  onChange,
}: SubCategoriesFilterProps) {
  const [expanded, setExpanded] = useState(false)
  const animation = useSharedValue(0)
  const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : []

  // Container measurements
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH)
  const [visibleThemes, setVisibleThemes] = useState<string[]>([])
  const [hiddenThemes, setHiddenThemes] = useState<string[]>([])
  const [showExpandButton, setShowExpandButton] = useState(false)

  // Use a ref to store measurements to avoid re-renders
  const chipMeasurementsRef = useRef<ChipMeasurement[]>([])

  // Initialize chip measurements once when themes change
  useEffect(() => {
    if (!themes || themes.length === 0) return

    // Only update if themes have changed
    const currentThemes = chipMeasurementsRef.current.map((chip) => chip.theme)
    const themesChanged =
      themes.some((theme) => !currentThemes.includes(theme)) || currentThemes.some((theme) => !themes.includes(theme))

    if (themesChanged) {
      chipMeasurementsRef.current = themes.map((theme) => {
        const existing = chipMeasurementsRef.current.find((chip) => chip.theme === theme)
        return (
          existing || {
            theme,
            width: Math.min(theme.length * 10 + 40, containerWidth * MAX_CHIP_WIDTH_PERCENTAGE),
            measured: true,
          }
        )
      })

      calculateVisibleThemes()
    }
  }, [themes])

  // Calculate visible themes based on container width - use callback to avoid recreation
  const calculateVisibleThemes = useCallback(() => {
    if (containerWidth <= 0 || !themes || themes.length === 0) {
      return
    }

    let availableWidth = containerWidth - 60 // Reserve space for expand button
    const visible: string[] = []
    const hidden: string[] = []

    // Sort by selection status (selected first) then by theme name
    const sortedThemes = [...themes].sort((a, b) => {
      const aSelected = selectedArray.includes(a) ? 0 : 1
      const bSelected = selectedArray.includes(b) ? 0 : 1
      if (aSelected !== bSelected) return aSelected - bSelected
      return a.localeCompare(b)
    })

    // Calculate visible and hidden themes without triggering state updates
    let shouldShowExpand = false
    for (const theme of sortedThemes) {
      const chip = chipMeasurementsRef.current.find((c) => c.theme === theme)
      if (!chip) continue

      const chipWidth = chip.width

      if (availableWidth >= chipWidth + 16) {
        // 16px for margin
        visible.push(theme)
        availableWidth -= chipWidth + 16
      } else {
        hidden.push(theme)
        shouldShowExpand = true
      }
    }

    // Batch state updates to prevent maximum update depth exceeded
    requestAnimationFrame(() => {
      setVisibleThemes(visible)
      setHiddenThemes(hidden)
      setShowExpandButton(shouldShowExpand)
    })
  }, [containerWidth, themes, selectedArray])

  // Recalculate visible themes when container width or selection changes
  useEffect(() => {
    calculateVisibleThemes()
  }, [calculateVisibleThemes, containerWidth, selectedArray])

  const toggle = () => {
    if (expanded) {
      animation.value = withTiming(
        0,
        {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          runOnJS(setExpanded)(false)
        },
      )
    } else {
      setExpanded(true)
      animation.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    }
  }

  const handleSelect = useCallback(
    (theme: string) => {
      if (multiSelect) {
        const isSelected = selectedArray.includes(theme)
        const next = isSelected ? selectedArray.filter((t) => t !== theme) : [...selectedArray, theme]
        onChange(next)
      } else {
        onChange(theme)
        if (expanded) toggle()
      }
    },
    [multiSelect, selectedArray, onChange, expanded],
  )

  // Measure the container width
  const handleContainerLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setContainerWidth(width)
  }

  // Measure a chip's width - store in ref to avoid re-renders
  const measureChip = (theme: string, event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout

    const existingIndex = chipMeasurementsRef.current.findIndex((chip) => chip.theme === theme)
    if (existingIndex >= 0) {
      chipMeasurementsRef.current[existingIndex].width = width
      chipMeasurementsRef.current[existingIndex].measured = true
    } else {
      chipMeasurementsRef.current.push({ theme, width, measured: true })
    }

    // Don't call setState here to avoid re-renders
  }

  // Animated styles for expanded overlay card
  const overlayStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(animation.value, [0, 1], [0, EXPANDED_HEIGHT]),
      opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0.7, 1]),
      transform: [{ translateY: interpolate(animation.value, [0, 1], [-10, 0]) }],
    }
  })

  // Animated styles for backdrop
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animation.value, [0, 1], [0, 0.3]),
    }
  })

  // Render a theme chip
  const renderThemeChip = (theme: string, inOverlay = false) => (
    <Pressable
      key={`${theme}-${inOverlay ? "overlay" : "main"}`}
      onPress={() => handleSelect(theme)}
      onLayout={inOverlay ? undefined : (event) => measureChip(theme, event)}
      style={[
        styles.chip,
        selectedArray.includes(theme) ? styles.selectedChip : styles.unselectedChip,
        inOverlay ? {} : { maxWidth: containerWidth * MAX_CHIP_WIDTH_PERCENTAGE },
      ]}
    >
      <Text
        style={[styles.chipText, selectedArray.includes(theme) ? styles.selectedChipText : styles.unselectedChipText]}
        numberOfLines={1}
      >
        {theme}
      </Text>
    </Pressable>
  )

  if (!themes || themes.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      {/* Main horizontal row with visible chips */}
      <View style={styles.chipRow} onLayout={handleContainerLayout}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {visibleThemes.map((theme) => renderThemeChip(theme))}
        </ScrollView>

        {/* Only show expand button when there are hidden themes */}
        {showExpandButton && (
          <Pressable onPress={toggle} style={styles.expandButton}>
            <Ionicons name={expanded ? "remove" : "add"} size={20} color="black" />
          </Pressable>
        )}
      </View>

      {/* Backdrop when expanded */}
      {expanded && <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="none" />}

      {/* Expanded overlay card */}
      {expanded && (
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <View style={styles.overlayHeader}>
            <Text style={styles.overlayTitle}>All Categories</Text>
            <Pressable onPress={toggle} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#333" />
            </Pressable>
          </View>

          <ScrollView style={styles.overlayScroll}>
            <View style={styles.overlayChipContainer}>{themes.map((theme) => renderThemeChip(theme, true))}</View>
          </ScrollView>
        </Animated.View>
      )}

      {loading && (
        <View style={styles.loadingIcon}>
          <Ionicons name="reload-outline" size={20} color="#888" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,

  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 6,
  },
  selectedChip: {
    backgroundColor: "#000", // Changed to black per requirements
  },
  unselectedChip: {
    backgroundColor: "#f0f0f0",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedChipText: {
    color: "white",
  },
  unselectedChipText: {
    color: "#333",
  },
  expandButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 5,
  },
  overlay: {
    position: "absolute",
    top: 60,
    left: 8,
    right: 8,
    backgroundColor: "white",
    zIndex: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    overflow: "hidden",
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  overlayTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  overlayScroll: {
    flex: 1,
  },
  overlayChipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  loadingIcon: {
    position: "absolute",
    right: 56,
    top: 16,
  },
})
