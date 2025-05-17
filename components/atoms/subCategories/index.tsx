"use client"

import { useState, useCallback, useMemo, memo } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

// Default categories that should always appear first
const DEFAULT_CATEGORIES = ["Casual", "Formal", "Sports", "Seasonal"]
const { width: screenWidth } = Dimensions.get("window")

interface SubCategoriesExbandableFilterProps {
  themes: string[]
  selected?: string
  onChange: (selected: string | string[]) => void
  multiSelect?: boolean
  loading?: boolean
}

const SubCategoriesExbandableFilter = memo(
  ({ themes = [], selected, onChange, multiSelect = false, loading = false }: SubCategoriesExbandableFilterProps) => {
    const [modalVisible, setModalVisible] = useState(false)

    // Process themes to ensure default categories appear first and remove duplicates
    const processedThemes = useMemo(() => {
      if (!themes || themes.length === 0) return DEFAULT_CATEGORIES

      // Create a set of all themes (case-insensitive)
      const themeSet = new Set(themes.map((theme) => theme?.toLowerCase()).filter(Boolean))

      // Add default categories if they don't exist
      DEFAULT_CATEGORIES.forEach((cat) => themeSet.add(cat.toLowerCase()))

      // Convert back to array and sort
      const allThemes = Array.from(themeSet)

      // Sort to ensure default categories appear first
      return allThemes.sort((a, b) => {
        const aIsDefault = DEFAULT_CATEGORIES.some((cat) => cat.toLowerCase() === a)
        const bIsDefault = DEFAULT_CATEGORIES.some((cat) => cat.toLowerCase() === b)

        if (aIsDefault && !bIsDefault) return -1
        if (!aIsDefault && bIsDefault) return 1
        return a.localeCompare(b)
      })
    }, [themes])

    const toggleModal = useCallback(() => {
      setModalVisible((prev) => !prev)
    }, [])

    const handleSelect = useCallback(
      (theme: string) => {
        if (multiSelect) {
          // Handle multi-select logic
          const currentSelected = Array.isArray(selected) ? selected : selected ? [selected] : []
          const isAlreadySelected = currentSelected.includes(theme)

          if (isAlreadySelected) {
            onChange(currentSelected.filter((t) => t !== theme))
          } else {
            onChange([...currentSelected, theme])
          }
        } else {
          // Single select
          onChange(theme === selected ? "" : theme)
          // Close modal after selection in single select mode
          if (!multiSelect) {
            setModalVisible(false)
          }
        }
      },
      [selected, onChange, multiSelect],
    )

    const isSelected = useCallback(
      (theme: string) => {
        if (Array.isArray(selected)) {
          return selected.includes(theme)
        }
        return theme === selected
      },
      [selected],
    )

    const isDefaultCategory = useCallback((theme: string) => {
      return DEFAULT_CATEGORIES.some((cat) => cat.toLowerCase() === theme.toLowerCase())
    }, [])

    const renderItem = useCallback(
      ({ item }: { item: string }) => {
        const isItemSelected = isSelected(item)
        const isDefault = isDefaultCategory(item)

        return (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={[styles.categoryItem, isItemSelected && styles.selectedItem, isDefault && styles.defaultItem]}
          >
            <Text style={[styles.categoryText, isItemSelected && styles.selectedText]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )
      },
      [handleSelect, isSelected, isDefaultCategory],
    )

    if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.skeletonRow}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} style={styles.skeletonItem} />
            ))}
          </View>
        </View>
      )
    }

    // Display only the first few items in the horizontal list
    const displayedThemes = processedThemes.slice(0, 4)

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Categories</Text>
          {processedThemes.length > 4 && (
            <TouchableOpacity onPress={toggleModal} style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontal scrolling list for main view */}
        <FlatList
          data={displayedThemes}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        {/* Modal for expanded view */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>All Categories</Text>
                <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Grid layout for categories in modal */}
              <FlatList
                data={processedThemes}
                renderItem={renderItem}
                keyExtractor={(item, index) => `modal-${item}-${index}`}
                numColumns={3}
                contentContainerStyle={styles.modalListContainer}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedItem: {
    backgroundColor: "#333",
    borderColor: "#222",
  },
  defaultItem: {
    borderColor: "#d0d0d0",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "white",
    fontWeight: "500",
  },
  skeletonRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  skeletonItem: {
    width: 80,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: screenWidth * 0.9,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 2,
  },
  modalListContainer: {
    paddingBottom: 16,
  },
})

SubCategoriesExbandableFilter.displayName = "SubCategoriesExbandableFilter"

export default SubCategoriesExbandableFilter
