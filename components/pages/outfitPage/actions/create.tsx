"use client"

import { useState, useCallback } from "react"
import {
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import databaseService from "@/services/database/db"
import { Text } from "@/components/ui/text"
import { Button, Icon } from "@rneui/themed"
import * as ImagePicker from "expo-image-picker"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import useAttireStore from "@/store/cayegoryStore"
import { Button as GLbutton, ButtonText, ButtonSpinner } from "@/components/ui/button"
const { width: screenWidth } = Dimensions.get("window")

// Define garment type options
const GARMENT_TYPES = ["Full", "Tops", "Bottoms", "Accessories"]

// Define size options
const SIZE_OPTIONS = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]

// Common material suggestions
const MATERIAL_SUGGESTIONS = ["Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather", "Suede", "Nylon"]

const OutfitScreen = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [brand, setBrand] = useState("")
  const [size, setSize] = useState("")
  const [material, setMaterial] = useState("")
  const [attireTheme, setAttireTheme] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGarmentType, setSelectedGarmentType] = useState<string>("")
  const [fullScreenVisible, setFullScreenVisible] = useState(false)
  const [showMaterialSuggestions, setShowMaterialSuggestions] = useState(false)
  const [showThemeSuggestions, setShowThemeSuggestions] = useState(false)

  // Get themes from store
  const themes = useAttireStore((state) => state.themes)

  // Toggle full screen image view
  const toggleFullScreen = useCallback(() => {
    setFullScreenVisible((prev) => !prev)
  }, [])

  // Dismiss all dropdowns
  const dismissDropdowns = useCallback(() => {
    setShowMaterialSuggestions(false)
    setShowThemeSuggestions(false)
    Keyboard.dismiss()
  }, [])

  // Handle image upload
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      console.log("Permission to access media library denied")
      alert("Permission to access photos is required!")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    })

    if (!result.canceled && result.assets) {
      const selectedImage = result.assets[0].uri
      setAsset(result.assets[0])
      setImageFile(result.assets[0].file || null)
      setImage(selectedImage)
      console.log("Image selected:", selectedImage)
    } else {
      console.log("Image selection canceled")
    }
  }

  const prepareNativeFile = async (file: ImagePicker.ImagePickerAsset) => {
    try {
      const url = new URL(file.uri)
      return {
        name: url.pathname.split("/").pop()!,
        size: file.fileSize!,
        uri: url.href,
        type: file.mimeType!,
      }
    } catch (error) {
      console.error(error)
      Promise.reject(error)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!asset || !name || !selectedGarmentType) {
      alert("Please provide an image, outfit name, and garment type")
      console.log("Missing required fields")
      console.log("Name:", name)
      console.log("Selected Garment Type:", selectedGarmentType)
      console.log("Image:", asset)
      return
    }

    setIsSubmitting(true)
    try {
      const file = await prepareNativeFile(asset!)
      if (file) {
        await databaseService.addOutfit({
          outfitName: name,
          file: file,
          brand: brand,
          size: size,
          attireTheme: attireTheme,
          material: material,
          garmentType: selectedGarmentType,
        })
        router.back()
      }
    } catch (error) {
      console.error("Error submitting outfit:", error)
      alert("Failed to save outfit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle material suggestion selection
  const selectMaterialSuggestion = (suggestion: string) => {
    setMaterial(suggestion)
    setShowMaterialSuggestions(false)
  }

  // Handle theme suggestion selection
  const selectThemeSuggestion = (suggestion: string) => {
    setAttireTheme(suggestion)
    setShowThemeSuggestions(false)
  }

  // Handle garment type selection
  const selectGarmentType = (type: string) => {
    setSelectedGarmentType(type)
  }

  // Handle size selection
  const selectSize = (selectedSize: string) => {
    setSize(selectedSize)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissDropdowns}>
        <View style={styles.innerContainer}>
          {/* Header with back button */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton} testID="back-button">
              <MaterialIcons name="arrow-back" size={24} color="#333" />
            </Pressable>
            <Text style={styles.headerTitle}>New Outfit</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {/* Image Upload Section - Full width with 3:4 aspect ratio */}
              <Pressable onPress={pickImage} style={styles.imageUpload} testID="image-upload">
                {image ? (
                  <>
                    <Image source={{ uri: image }} style={styles.image} resizeMode="cover" testID="profile-image" />
                    <View style={styles.imageOverlay}>
                      <TouchableOpacity style={styles.imageActionButton} onPress={toggleFullScreen}>
                        <Ionicons name="expand" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={styles.addImageContainer}>
                    <Icon name="add-a-photo" type="material" color="#6b7280" size={32} testID="add-photo-icon" />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </View>
                )}
              </Pressable>

              {/* Form Inputs */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Outfit Name*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  autoCapitalize="words"
                  testID="name-input"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Brand</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Brand (optional)"
                  value={brand}
                  onChangeText={(text) => setBrand(text)}
                  autoCapitalize="words"
                />
              </View>

              {/* Size Selection */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Size</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {SIZE_OPTIONS.map((sizeOption) => (
                      <TouchableOpacity
                        key={sizeOption}
                        style={[styles.chip, size === sizeOption && styles.selectedChip]}
                        onPress={() => selectSize(sizeOption)}
                      >
                        <Text style={[styles.chipText, size === sizeOption && styles.selectedChipText]}>
                          {sizeOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Material Input with Suggestions */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Material</Text>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Material (optional)"
                    value={material}
                    onChangeText={(text) => setMaterial(text)}
                    onFocus={() => {
                      setShowMaterialSuggestions(true)
                      setShowThemeSuggestions(false)
                    }}
                  />
                  {showMaterialSuggestions && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled={true}>
                        {MATERIAL_SUGGESTIONS.map((suggestion) => (
                          <TouchableOpacity
                            key={suggestion}
                            style={styles.suggestionItem}
                            onPress={() => selectMaterialSuggestion(suggestion)}
                          >
                            <Text style={styles.suggestionText}>{suggestion}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={styles.closeSuggestions}
                        onPress={() => setShowMaterialSuggestions(false)}
                      >
                        <Text style={styles.closeSuggestionsText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Attire Theme with Suggestions */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Attire Theme</Text>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Theme (e.g., Casual, Formal)"
                    value={attireTheme}
                    onChangeText={(text) => setAttireTheme(text)}
                    onFocus={() => {
                      setShowThemeSuggestions(true)
                      setShowMaterialSuggestions(false)
                    }}
                  />
                  {showThemeSuggestions && (
                    <View style={styles.suggestionsContainer}>
                      <ScrollView style={styles.suggestionsScroll} nestedScrollEnabled={true}>
                        {themes.map((theme) => (
                          <TouchableOpacity
                            key={theme}
                            style={styles.suggestionItem}
                            onPress={() => selectThemeSuggestion(theme)}
                          >
                            <Text style={styles.suggestionText}>{theme}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity style={styles.closeSuggestions} onPress={() => setShowThemeSuggestions(false)}>
                        <Text style={styles.closeSuggestionsText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Garment Type Selection */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Garment Type*</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipContainer}>
                    {GARMENT_TYPES.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.chip, selectedGarmentType === type && styles.selectedChip]}
                        onPress={() => selectGarmentType(type)}
                      >
                        <Text style={[styles.chipText, selectedGarmentType === type && styles.selectedChipText]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>



              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Dress Up"
                  buttonStyle={styles.submitButton}
                  titleStyle={styles.buttonText}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting || !name || !image || !selectedGarmentType}
                  testID="submit-button"
                  loadingProps={{ color: "white", animating: true }}
                  loadingStyle={{
                    marginHorizontal: "auto"
                  }}
                />
              </View>

              {/* Extra padding at the bottom to ensure content is visible above keyboard */}

            </View>
          </ScrollView>

          {/* Full Screen Image Modal */}
          <Modal visible={fullScreenVisible} transparent={true} animationType="fade" onRequestClose={toggleFullScreen}>
            <View style={styles.fullScreenContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={toggleFullScreen}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Image source={{ uri: image || "" }} style={styles.fullScreenImage} resizeMode="contain" />
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

// Styles moved to StyleSheet for better type safety
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
  },
  imageUpload: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
  },
  imageActionButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  addImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontWeight: "500",
    marginBottom: 4,
    color: "#374151",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 64,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: "#333333",
    borderColor: "#333333",
  },
  chipText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  suggestionsContainer: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    zIndex: 10,
    maxHeight: 200,
  },
  suggestionsScroll: {
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  suggestionText: {
    fontSize: 14,
    color: "#374151",
  },
  closeSuggestions: {
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#f9f9f9",
  },
  closeSuggestionsText: {
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  submitButton: {
    backgroundColor: "#333333",
    borderRadius: 100,
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: "auto"
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenWidth * (16 / 9),
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  bottomPadding: {
    height: 100, // Extra padding at the bottom to ensure content is visible above keyboard
  },
})

export default OutfitScreen
