import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ThemedView } from "@/components/ThemedView"
import { View, Dimensions, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from "react-native"
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
} from "react-native-reanimated"

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = 7 // Match with the spacing in outfitCard
const itemWidth = (screenWidth - spacing * (numColumns + 3)) / numColumns
const itemHeight = itemWidth * 1.5

// Define constants

type OutfitItem = OutfitWithImage | { id: number; isPlaceholder: true }

export default function OutFitPageComp({
  selecting = false,
}: {
  selecting?: boolean
}): React.JSX.Element {
  const [outfits, setOutfits] = useState<OutfitWithImage[]>([])
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
  const { outfitItems, addOutfitItem, removeOutfitItem, clearOutfitItems } = useStore()

  const router = useRouter()

  // Animation values
  const headerOpacity = useSharedValue(0)
  const cardScale = useSharedValue(0.95)

  useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }))
    cardScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }))
  }, [headerOpacity, cardScale])

  // Header animation
  const headerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }]
    }
  })

  // Initialize selection mode from props
  useEffect(() => {
    setIsSelecting(selecting)
  }, [selecting])

  // Update bottom sheet visibility when modal is shown/hidden
  useEffect(() => {
    setBottomSheetVisible(modalProps.visible)
  }, [modalProps.visible])

  // Use useCallback to prevent recreation of this function on every render
  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true)
    setAttireTheme([])
    try {
      const data = await databaseService.ListOutfits()
      const themes = useAttireStore.getState().themes
      setAttireTheme(themes || [])
      setOutfits(data || [])
    } catch (error) {
      console.error("Error fetching outfits: ", error)
      setOutfits([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Only call fetchData on initial mount and manual refreshes
  useEffect(() => {
    fetchData()
  }, [fetchData])

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

  // Toggle outfit selection
  const toggleOutfitSelection = useCallback(
    (outfit: OutfitWithImage) => {
      if (isOutfitSelected(outfit.$id)) {
        // Remove from selection
        removeOutfitItem("full") // Assuming all outfits are "full" category
      } else {
        // Add to selection
        addOutfitItem(outfit.$id, "full", outfit.imageUrl)
      }
    },
    [isOutfitSelected, addOutfitItem, removeOutfitItem],
  )

  const TabBar = (): React.JSX.Element => {
    const [selectedTab, setSelectedTab] = useState<string>("All")

    const handleTabPress = (tab: string): void => {
      setSelectedTab(tab)
      setActiveFilter(tab.toLowerCase())
    }

    return (
      <Animated.View
        style={[headerAnimStyle]}
        className="py-3 px-4 bg-white"
      >
        <HStack className="justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-800">Outfits Gallery</Text>

          {/* Add/Close button */}
          <Animated.View entering={ZoomIn.delay(600).duration(300)}>
            <TouchableOpacity
              className="h-10 w-10 bg-primary-500 rounded-full justify-center items-center"
              onPress={() => {
                if (isSelecting) {
                  setIsSelecting(false)
                  clearOutfitItems()
                } else {
                  router.push("/(app)/(auth)/outfit/add")
                }
              }}
            >
              <Text className="text-white mb-1 font-medium text-2xl">
                {isSelecting ? "×" : "+"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </HStack>

        <HStack space="md" className="overflow-visible">
          <FlatList
            data={["All", "Casual", "Formal", "Sports", "Seasonal"]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }: { item: string }) => (
              <TouchableOpacity
                onPress={() => handleTabPress(item)}
                className={`py-2 px-4 mr-2 rounded-full ${selectedTab === item ? "bg-primary-500" : "bg-gray-100"
                  }`}
              >
                <Text
                  className={`font-medium ${selectedTab === item ? "text-white" : "text-gray-700"
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
  }

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): OutfitItem[] => {
    return Array.from({ length: 6 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }))
  }

  const filterOutfits = useCallback((data: OutfitWithImage[]) => {
    if (activeFilter === "all") return data
    
    // In a real app, you would implement actual filtering logic here
    return data
  }, [activeFilter])

  const displayData: OutfitItem[] = loading ? getPlaceholderData() : filterOutfits(outfits)

  const handleCardPress = useCallback(
    (item: OutfitItem) => {
      if ("isPlaceholder" in item) return

      {
        // Open modal with item details
        setModalProps({
          id: item.$id || "",
          visible: true,
        })
      }
    },
    [],
  )

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
        <TabBar />
        
        {/* SubCategories filter */}
        <View style={styles.subCategoriesContainer}>
          <SubCategoriesExbandableFilter
            loading={loading}
            themes={attireTheme}
            selected={selectedSubFilter}
            multiSelect={false}
            onChange={(themes) => setSelectedSubFilter(Array.isArray(themes) ? themes[0] : themes)}
          />
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlashList
            extraData={[outfitItems, isSelecting]} // Make sure list re-renders when selection changes
            data={displayData}
            estimatedItemSize={itemHeight} 
            numColumns={numColumns}
            contentContainerStyle={{
              paddingHorizontal: spacing / 2,
              paddingBottom: bottomSheetVisible ? 100 : 20
            }}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeIn.delay(index * 100).duration(300)}
                style={{ margin: spacing }}
                className="flex justify-center items-center"
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
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-lg">No outfits found</Text>
                <Button
                  className="mt-4 bg-primary-500 rounded-full"
                  onPress={() => router.push("/(app)/(auth)/outfit/add")}
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
        <ModalComponent
          id={modalProps.id}
          visible={modalProps.visible}
          onPress={() => setModalProps({ id: "", visible: false })}
        />
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
})