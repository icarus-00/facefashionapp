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
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
  Extrapolate,
  withSequence,
  runOnJS,
} from "react-native-reanimated"

// Constants
const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = Platform.OS === "android" ? 10 : 7
const SCROLL_THRESHOLD = 10
const ANIMATION_DURATION = 250
const CATEGORIES = ["All", "Full", "Tops", "Bottoms", "Accessories"]

type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true }

export default function OutFitPageComp({ selecting = false }: { selecting?: boolean }): React.JSX.Element {
  // State management
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([])
  const [filteredOutfits, setFilteredOutfits] = useState<OutfitWithImage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [attireTheme, setAttireTheme] = useState<string[]>([])
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>()
  const [modalProps, setModalProps] = useState<{ id: string; visible: boolean }>({ id: "", visible: false })
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isSelecting, setIsSelecting] = useState<boolean>(selecting)

  // Refs
  const scrollRef = useRef<FlashList<OutfitItem>>(null)
  const lastScrollY = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<NodeJS.Timeout | number | undefined>(undefined)

  // Store
  const { outfitItems, addOutfitItem, removeOutfitItem, actorItems } = useStore()
  const router = useRouter()

  // Animated values
  const filterVisible = useSharedValue(1)
  const headerOpacity = useSharedValue(1)

  // Animations
  const filterAnimStyle = useAnimatedStyle(() => ({
    opacity: filterVisible.value,
    transform: [
      {
        translateY: interpolate(
          filterVisible.value,
          [0, 1],
          [-50, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
    height: interpolate(
      filterVisible.value,
      [0, 1],
      [0, 50],
      Extrapolate.CLAMP
    ),
  }))

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(
          headerOpacity.value,
          [0, 1],
          [-20, 0],
          Extrapolate.CLAMP
        ),
      },
    ],
  }))

  // Optimized scroll handling
  const handleScroll = useCallback(
    (event: any) => {
      const currentY = event.nativeEvent?.contentOffset?.y || 0
      const delta = currentY - lastScrollY.current

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set scrolling flag
      isScrolling.current = true

      // Update scroll position
      lastScrollY.current = currentY

      // Only trigger animation if scroll delta exceeds threshold
      if (Math.abs(delta) > SCROLL_THRESHOLD) {
        const shouldHide = delta > 0
        filterVisible.value = withTiming(
          shouldHide ? 0 : 1,
          { duration: ANIMATION_DURATION }
        )
      }

      // Reset scrolling flag after delay
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    },
    [filterVisible]
  )

  // Data fetching
  const fetchData = useCallback(async () => {
    // Remove the guard that blocks initial fetch
    setLoading(true)
    try {
      const data = await databaseService.ListOutfits()
      const themes = useAttireStore.getState().themes

      setAttireTheme(themes || [])
      setOutfits(data || [])
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

  // Filter logic
  const applyFilters = useCallback((data: OutfitWithImage[], category: string, subCategory?: string) => {
    let result = [...data]

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
            return garmentType.includes("accessory") || garmentType.includes("accessories")
          default:
            return true
        }
      })
    }

    if (subCategory) {
      result = result.filter((outfit) =>
        (outfit.attireTheme || "").toLowerCase() === subCategory.toLowerCase()
      )
    }

    setFilteredOutfits(result)
  }, [])

  // Effects
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (outfits.length > 0) {
      applyFilters(outfits, activeFilter, selectedSubFilter)
    }
  }, [activeFilter, selectedSubFilter, outfits, applyFilters])

  useEffect(() => {
    setBottomSheetVisible(outfitItems.length > 0)
    if (outfitItems.length > 0 && !isSelecting) {
      setIsSelecting(true)
    }
  }, [outfitItems, isSelecting])

  // Handlers
  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  const isOutfitSelected = useCallback(
    (outfitId: string) => outfitItems.some((item) => item.imageID === outfitId),
    [outfitItems]
  )

  const getOutfitCategory = useCallback((garmentType: string): "full" | "top" | "bottom" | "accessory" => {
    const typeLower = (garmentType || "").toLowerCase()

    if (typeLower.includes('full') || typeLower.includes('dress')) return 'full'
    if (typeLower.includes('top') || typeLower.includes('shirt')) return 'top'
    if (typeLower.includes('bottom') || typeLower.includes('pant')) return 'bottom'
    if (typeLower.includes('accessory')) return 'accessory'

    return 'full'
  }, [])

  const toggleOutfitSelection = useCallback(
    (outfit: OutfitWithImage) => {
      const category = getOutfitCategory(outfit.garmentType)

      if (isOutfitSelected(outfit.$id)) {
        removeOutfitItem(category)
      } else {
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
    [isOutfitSelected, addOutfitItem, removeOutfitItem, getOutfitCategory]
  )

  // Memoized components
  const TabBar = useMemo(() => (
    <Animated.View style={[headerAnimStyle]} className="py-3 px-4 bg-white">
      <HStack className="justify-between items-center mb-3">
        <Text className="text-2xl font-bold text-gray-800">Outfits Gallery</Text>
        <Animated.View entering={ZoomIn.duration(300)}>
          <TouchableOpacity
            className="h-10 w-10 bg-primary-500 rounded-full justify-center items-center"
            onPress={() => router.push({ pathname: "/(app)/(auth)/outfit/create" })}
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
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item.toLowerCase())}
              className={`py-2 px-4 mr-2 rounded-full ${activeFilter.toLowerCase() === item.toLowerCase()
                  ? "bg-primary-500"
                  : "bg-gray-100"
                }`}
            >
              <Text
                className={`font-medium ${activeFilter.toLowerCase() === item.toLowerCase()
                    ? "text-white"
                    : "text-gray-700"
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
  ), [headerAnimStyle, activeFilter, router])

  const renderItem = useCallback(
    ({ item, index }: { item: OutfitItem; index: number }) => (
      <Animated.View
        entering={FadeIn.delay(index * 50).duration(200)}
        style={[styles.cardContainer]}
      >
        <OutfitCard
          selected={!("isPlaceholder" in item) && isOutfitSelected(item.$id || "")}
          item={item}
          loading={loading}
          index={index}
          onLongPress={() => {
            if (!("isPlaceholder" in item)) {
              toggleOutfitSelection(item)
            }
          }}
          onPress={() => {
            if (!("isPlaceholder" in item)) {
              setModalProps({ id: item.$id, visible: true })
            }
          }}
          selecting={isSelecting}
          actorSelected={!!actorItems && !!actorItems.imageID}
        />
      </Animated.View>
    ),
    [loading, isSelecting, isOutfitSelected, toggleOutfitSelection, actorItems]
  )

  return (
    <ThemedView style={styles.container}>
      <VStack className="flex-1">
        {TabBar}

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
            ref={scrollRef}
            estimatedItemSize={200}
            data={filteredOutfits}
            numColumns={numColumns}
            renderItem={renderItem}
            keyExtractor={(item) =>
              "isPlaceholder" in item ? `placeholder-${item.id}` : item.$id
            }
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={handleRefresh}
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

        {modalProps.visible && (
          <View className="absolute inset-0 justify-center items-center">
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
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing,
    paddingBottom: 100,
  },
})