import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { ThemedView } from "@/components/ThemedView"
import { View, Dimensions, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native"
import { FlashList } from "@shopify/flash-list"
import databaseService from "@/services/database/db"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { AddIcon, CloseIcon } from "@/components/ui/icon"
import { useRouter } from "expo-router"
import SubCategoriesExbandableFilter from "@/components/atoms/subCategories"
import useAttireStore from "@/store/cayegoryStore"
import type { OutfitWithImage } from "@/interfaces/outfitDB"
import ModalComponent from "./atoms/outfitModal"
import OutfitCard from "./atoms/outfitCard"
import useStore from "@/store/lumaGeneration/useStore"

// Define types for our data
const { width: screenWidth } = Dimensions.get("screen")
const numColumns = 2
const spacing = 4
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns
const itemHeight = itemWidth * 1.6

// Define constants - removed animation constants
const TAB_BAR_HEIGHT = 56   // Height of tab bar
const SUB_CAT_HEIGHT = 60   // Estimated height of subcategories
const HEADER_HEIGHT = TAB_BAR_HEIGHT + SUB_CAT_HEIGHT

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

  // Selection state
  const [isSelecting, setIsSelecting] = useState<boolean>(selecting)

  // Get store methods
  const { outfitItems, addOutfitItem, removeOutfitItem, clearOutfitItems } = useStore()

  const router = useRouter()

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
    }

    return (
      <View style={styles.tabBar}>
        <FlatList
          data={["All", "Popular", "Top Rated", "Upcoming", "Now Playing"]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Button
              style={[styles.tabButton, selectedTab === item ? styles.selectedTab : styles.unselectedTab]}
              onPress={() => handleTabPress(item)}
            >
              <ButtonText style={selectedTab === item ? styles.selectedTabText : styles.unselectedTabText}>
                {item}
              </ButtonText>
            </Button>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tabBarContent}
        />
        <Button
          size="md"
          variant="outline"
          style={styles.actionButton}
          onPress={() => {
            if (isSelecting) {
              setIsSelecting(false)
              clearOutfitItems()
            } else {
              router.push("/(app)/(auth)/outfit/add")
            }
          }}
        >
          {isSelecting ? (
            <ButtonIcon style={styles.actionButtonIcon} size="md" as={CloseIcon} />
          ) : (
            <ButtonIcon style={styles.actionButtonIcon} size="md" as={AddIcon} />
          )}
        </Button>
      </View>
    )
  }

  // SubCategories filter - now without animations
  const SubCategoriesFilter = () => (
    <View style={styles.subCategoriesContainer}>
      <SubCategoriesExbandableFilter
        loading={loading}
        themes={attireTheme}
        selected={selectedSubFilter}
        multiSelect={false}
        onChange={(themes) => setSelectedSubFilter(Array.isArray(themes) ? themes[0] : themes)}
      />
    </View>
  )

  // Generate placeholder data with proper typing
  const getPlaceholderData = (): OutfitItem[] => {
    return Array.from({ length: 6 }, (_, index) => ({
      id: index,
      isPlaceholder: true,
    }))
  }

  const displayData: OutfitItem[] = loading ? getPlaceholderData() : outfits

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
    [isSelecting, toggleOutfitSelection],
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
      {/* Fixed position Tab Bar */}
      <TabBar />

      {/* Fixed position SubCategories filter */}
      <SubCategoriesFilter />

      {/* Spacer view with fixed height to push content down */}


      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlashList
          extraData={[outfitItems, isSelecting]} // Make sure list re-renders when selection changes
          data={displayData}
          estimatedItemSize={itemHeight + 60} // Account for info section height
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            if ("isPlaceholder" in item) {
              return `placeholder-${item.id}`
            }
            return item.$id || `item-${index}`
          }}
          numColumns={numColumns}
          contentContainerStyle={
            bottomSheetVisible
              ? { ...styles.listContent, paddingBottom: 100 }
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No outfits found</Text>
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
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingHorizontal: 16,
    paddingVertical: 12,


  },
  subCategoriesContainer: {

    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,

  },
  tabBarContent: {
    paddingRight: 8,
  },
  tabButton: {
    marginHorizontal: 4,
    borderRadius: 6,
  },
  selectedTab: {
    backgroundColor: "#000",
  },
  unselectedTab: {
    backgroundColor: "#f0f0f0",
  },
  selectedTabText: {
    color: "white",
  },
  unselectedTabText: {
    color: "#333",
  },
  actionButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: "#ddd",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonIcon: {
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 20,

  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})