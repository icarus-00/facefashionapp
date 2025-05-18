"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { ThemedView } from "@/components/ThemedView"
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native"
import { FlashList } from "@shopify/flash-list"
import databaseService from "@/services/database/db"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { AddIcon } from "@/components/ui/icon"
import { useRouter } from "expo-router"
import SubCategoriesExbandableFilter from "@/components/atoms/subCategories"
import useAttireStore from "@/store/cayegoryStore"
import type { OutfitWithImage } from "@/interfaces/outfitDB"
import ModalComponent from "./atoms/outfitModal"
import OutfitCard from "./atoms/outfitCard"
import useStore from "@/store/lumaGeneration/useStore"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withDelay,
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
  cancelAnimation,
  Extrapolate,
} from "react-native-reanimated"

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = Platform.OS === "android" ? 10 : 7 // Increased spacing for Android
const itemWidth = (screenWidth - spacing * (numColumns + 3)) / numColumns
const itemHeight = itemWidth * 1.5

// Define constants
const CATEGORIES = ["All", "Full", "Tops", "Bottoms", "Accessories"]

type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true }

export default function OutFitPageComp({
  selecting = false,
}: {
  selecting?: boolean
}): React.JSX.Element {
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([])
  const [filteredOutfits, setFilteredOutfits] = useState<OutfitWithImage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [attireTheme, setAttireTheme] = useState<string[]>([])
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>()
  const [modalProps, setModalProps] = useState<{
    id: string
    visible: boolean
  }>({ id: "", visible: false })
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Selection state
  const [isSelecting, setIsSelecting] = useState<boolean>(selecting)

  // Get store methods
  const { outfitItems, addOutfitItem, removeOutfitItem } = useStore()

  // Animation refs to track if animations have run
  const animationsRun = useRef(false)
  const isInitialMount = useRef(true)

  const router = useRouter()

  // Animation values
  const headerOpacity = useSharedValue(0)
  const cardScale = useSharedValue(0.95)
  
  // Scroll position tracking for filter visibility
  const scrollY = useSharedValue(0)
  const lastScrollY = useSharedValue(0)
  const filterVisible = useSharedValue(1) // 1 = visible, 0 = hidden

  // Run entrance animations only once on initial mount
  useEffect(() => {
    if (isInitialMount.current && !animationsRun.current) {
      // Set animations as run
      animationsRun.current = true

      // Run entrance animations
      headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }))
      cardScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }))

      // Mark initial mount as complete
      isInitialMount.current = false
    }

    // Cleanup animations on unmount
    return () => {
      cancelAnimation(headerOpacity)
      cancelAnimation(cardScale)
    }
  }, [headerOpacity, cardScale])

  // Header animation
  const headerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }],
    }
  }, [])
  
  // Filter visibility animation
  const filterAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: filterVisible.value,
      transform: [
        { translateY: interpolate(filterVisible.value, [0, 1], [-50, 0], Extrapolate.CLAMP) }
      ],
      // Remove height interpolation to allow natural height
      maxHeight: interpolate(filterVisible.value, [0, 1], [0, 100], Extrapolate.CLAMP),
      overflow: 'hidden',
      marginBottom: interpolate(filterVisible.value, [0, 1], [0, 10], Extrapolate.CLAMP)
    }
  }, [])
  
  // Manual scroll handler function to avoid compatibility issues
  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent?.contentOffset?.y || 0
    
    // Determine scroll direction
    if (currentScrollY > lastScrollY.value + 10) {
      // Scrolling down - hide filter
      filterVisible.value = withTiming(0, { duration: 300 })
    } else if (currentScrollY < lastScrollY.value - 10) {
      // Scrolling up - show filter
      filterVisible.value = withTiming(1, { duration: 300 })
    }
    
    // Update scroll position
    scrollY.value = currentScrollY
    lastScrollY.value = currentScrollY
  }, [filterVisible, scrollY, lastScrollY])

  // Initialize selection mode from props
  useEffect(() => {
    setIsSelecting(selecting)
  }, [selecting])

  // Update bottom sheet visibility and selection mode when modal is shown/hidden
  useEffect(() => {
    setBottomSheetVisible(outfitItems.length > 0)
    
    // Enable selection mode if there are items in the cart
    if (outfitItems.length > 0 && !isSelecting) {
      setIsSelecting(true)
    }
  }, [outfitItems, isSelecting])

  // Use useCallback to prevent recreation of this function on every render
  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await databaseService.ListOutfits()
      const themes = useAttireStore.getState().themes

      // Only update attireTheme if it has changed
      if (JSON.stringify(themes) !== JSON.stringify(attireTheme)) {
        setAttireTheme(themes || [])
      }

      setOutfits(data || [])
      // Apply initial filtering
      applyFilters(data || [], activeFilter, selectedSubFilter)
    } catch (error) {
      console.error("Error fetching outfits: ", error)
      setOutfits([])
      setFilteredOutfits([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeFilter, selectedSubFilter])

  // Apply filters based on category and subcategory
  const applyFilters = useCallback((data: OutfitWithImage[], category: string, subCategory?: string) => {
    let result = [...data]

    // Filter by category (case-insensitive)
    if (category && category.toLowerCase() !== "all") {
      result = result.filter((outfit) => {
        const garmentType = (outfit.garmentType || "").toLowerCase()
        const categoryLower = category.toLowerCase()

        switch (categoryLower) {
          case "full":
            return garmentType.includes("full") || garmentType.includes("dress") || garmentType.includes("suit")
          case "tops":
            return garmentType.includes("top") || garmentType.includes("shirt") || garmentType.includes("blouse")
          case "bottoms":
            return garmentType.includes("bottom") || garmentType.includes("pant") || garmentType.includes("skirt")
          case "accessories":
            return garmentType.includes("accessory") || garmentType.includes("accessories") || garmentType.includes("hat") || garmentType.includes("jewelry")
          default:
            return true
        }
      })
    }

    // Filter by subcategory if selected
    if (subCategory) {
      result = result.filter((outfit) => (outfit.attireTheme || "").toLowerCase() === subCategory.toLowerCase())
    }

    setFilteredOutfits(result)
  }, [])

  // Only call fetchData on initial mount and manual refreshes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply filters when activeFilter or selectedSubFilter changes
  useEffect(() => {
    if (outfits.length > 0) {
      applyFilters(outfits, activeFilter, selectedSubFilter)
    }
  }, [activeFilter, selectedSubFilter, outfits, applyFilters])

  // Handle refresh separately without retriggering the useEffect
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  // Check if an outfit is selected
  const isOutfitSelected = useCallback(
    (outfitId: string) => {
      return outfitItems.some((item) => item.imageID === outfitId)
    },
    [outfitItems],
  )

  // Determine the appropriate outfit category based on garment type
  const getOutfitCategory = useCallback((garmentType: string): "full" | "top" | "bottom" | "accessory" => {
    const typeLower = (garmentType || "").toLowerCase();
    
    if (typeLower.includes('full') || typeLower.includes('dress') || typeLower.includes('suit')) {
      return 'full';
    } else if (typeLower.includes('top') || typeLower.includes('shirt') || typeLower.includes('blouse')) {
      return 'top';
    } else if (typeLower.includes('bottom') || typeLower.includes('pant') || typeLower.includes('skirt')) {
      return 'bottom';
    } else if (typeLower.includes('accessory') || typeLower.includes('accessories') || typeLower.includes('hat') || typeLower.includes('jewelry')) {
      return 'accessory';
    }
    
    // Default case - if we can't determine, use the filtered category
    if (activeFilter.toLowerCase() === 'full') return 'full';
    if (activeFilter.toLowerCase() === 'tops') return 'top';
    if (activeFilter.toLowerCase() === 'bottoms') return 'bottom';
    if (activeFilter.toLowerCase() === 'accessories') return 'accessory';
    
    // Fallback to full if we still can't determine
    return 'full';
  }, [activeFilter]);

  // Toggle outfit selection
  const toggleOutfitSelection = useCallback(
    (outfit: OutfitWithImage) => {
      // Determine the proper category based on garment type
      const category = getOutfitCategory(outfit.garmentType);
      
      if (isOutfitSelected(outfit.$id)) {
        // Remove from selection
        removeOutfitItem(category) 
      } else {
        // Add to selection with the correct category
        addOutfitItem(
          outfit.fileID, 
          category, 
          outfit.imageUrl, 
          outfit.outfitName, 
          outfit.brand, 
          outfit.size, 
          outfit.material, 
          outfit.garmentType, 
          outfit.attireTheme
        )
      }
    },
    [isOutfitSelected, addOutfitItem, removeOutfitItem, getOutfitCategory],
  )

  // Memoize the TabBar component to prevent unnecessary re-renders
  const TabBar = useMemo(() => {
    const handleTabPress = (tab: string): void => {
      setActiveFilter(tab.toLowerCase())
    }

    return (
      <Animated.View style={[headerAnimStyle]} className="py-3 px-4 bg-white">
        <HStack className="justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-800">Outfits Gallery</Text>

          {/* Add button */}
          <Animated.View entering={ZoomIn.delay(600).duration(300)}>
            <TouchableOpacity
              className="h-10 w-10 bg-primary-500 rounded-full justify-center items-center"
              onPress={() => {
                router.push({ pathname: "/(app)/(auth)/outfit/create" })
              }}
            >
              <Text className="text-white mb-1 font-medium text-2xl">+</Text>
            </TouchableOpacity>
          </Animated.View>
        </HStack>

        <HStack space="md" className="overflow-visible">
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity
                onPress={() => handleTabPress(item)}
                className={`py-2 px-4 mr-2 rounded-full ${activeFilter.toLowerCase() === item.toLowerCase() ? "bg-primary-500" : "bg-gray-100"
                  }`}
              >
                <Text
                  className={`font-medium ${activeFilter.toLowerCase() === item.toLowerCase() ? "text-white" : "text-gray-700"
                    }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </HStack>
      </Animated.View>
    )
  }, [headerAnimStyle, activeFilter, router])

  // Generate placeholder data with proper typing
  const getPlaceholderData = useCallback((): OutfitItem[] => {
    return Array.from({ length: 6 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }))
  }, [])

  const displayData: OutfitItem[] = useMemo(() => {
    return loading ? getPlaceholderData() : filteredOutfits
  }, [loading, filteredOutfits, getPlaceholderData])

  const handleCardPress = useCallback((item: OutfitItem) => {
    if ("isPlaceholder" in item) return

    // Open modal with item details
    setModalProps({
      id: item.$id || "",
      visible: true,
    })
  }, [])

  const handleCardLongPress = useCallback(
    (item: OutfitItem) => {
      if ("isPlaceholder" in item) return

      if (isSelecting) {
        toggleOutfitSelection(item as OutfitWithImage)
      }
    },
    [isSelecting, toggleOutfitSelection],
  )

  // Render item function to ensure proper pressability
  const renderItem = useCallback(
    ({ item, index }: { item: OutfitItem; index: number }) => (
      <OutfitCard
        selected={!("isPlaceholder" in item) && isOutfitSelected(item.$id || "")}
        item={item}
        loading={loading}
        index={index}
        onLongPress={() => handleCardLongPress(item)}
        onPress={() => handleCardPress(item)}
        selecting={isSelecting}
      />
    ),
    [loading, isSelecting, isOutfitSelected, handleCardPress, handleCardLongPress],
  )

  return (
    <ThemedView style={styles.container}>
      <VStack className="flex-1">
        {/* Header with tabs */}
        {TabBar}

        {/* SubCategories filter with animated visibility */}
        <Animated.View style={[styles.subCategoriesContainer, filterAnimStyle]}>
          <SubCategoriesExbandableFilter
            loading={loading}
            themes={attireTheme}
            selected={selectedSubFilter}
            multiSelect={false}
            onChange={(themes) => setSelectedSubFilter(Array.isArray(themes) ? themes[0] : themes)}
          />
        </Animated.View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlashList
            extraData={[outfitItems, isSelecting]} // Make sure list re-renders when selection changes
            data={displayData}
            estimatedItemSize={254} // Set recommended value to avoid warning
            numColumns={numColumns}
            contentContainerStyle={{
              paddingHorizontal: spacing,
              paddingBottom: selecting ? 100 : 20,
            }}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeIn.delay(index * 50).duration(300)}
                style={[styles.cardContainer, Platform.OS === "android" && styles.androidCardContainer]}
              >
                {renderItem({ item, index })}
              </Animated.View>
            )}
            keyExtractor={(item, index) => {
              if ("isPlaceholder" in item) {
                return `placeholder-${item.id}`
              }
              return item.$id || `item-${index}`
            }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onScroll={handleScroll}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-lg">No outfits found</Text>
                <Button
                  className="mt-4 bg-primary-500 rounded-full"
                  onPress={() => router.push("/(app)/(auth)/outfit/create")}
                >
                  <ButtonText>Add New Outfit</ButtonText>
                  <ButtonIcon className="ml-2" as={AddIcon} />
                </Button>
              </View>
            }
            ListFooterComponent={<View style={{ height: 80 }} />}
          />
        )}

        {/* Modal for outfit details */}
        {modalProps.visible && (
          <View className="absolute bottom-0 top-0 right-0 left-0 w-full h-full justify-center items-center">
            <ModalComponent
              id={modalProps.id}
              visible={modalProps.visible}
              onPress={() => setModalProps({ id: "", visible: false })}
            />
          </View>
        )}
      </VStack>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subCategoriesContainer: {
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    margin: spacing,
    justifyContent: "center",
    alignItems: "center",
  },
  androidCardContainer: {
    // Android-specific adjustments
    marginVertical: spacing * 1.2,
  },
})
