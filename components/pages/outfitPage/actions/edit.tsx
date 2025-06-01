import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import databaseService, { OutfitWithImage } from "@/services/database/db";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, Icon } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { err } from "react-native-svg";
import ToastGlue from "@/components/atoms/toast/toast";
import { Spinner } from "@/components/ui/spinner";
import { Colors } from "@/constants/Colors";
import { WaveIndicator, PacmanIndicator } from "react-native-indicators";

const OutfitScreen = ({ id }: { id: string }) => {
  const [name, setName] = useState<string>();
  const [material, setMaterial] = useState<string>("");
  const [image, setImage] = useState<string>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [outfit, setOutfit] = useState<OutfitWithImage>();
  const [loading, setLoading] = useState(true);
  // Adding size state to track outfit size
  const [size, setSize] = useState<string>("");
  
  // Define size options
  const SIZE_OPTIONS = useMemo(() => ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"], []);
  
  // Handle image upload
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("Permission to access media library denied");
      alert("Permission to access photos is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedImage = result.assets[0].uri;
      setAsset(result.assets[0]);
      setImageFile(result.assets[0].file || null);
      setImage(selectedImage);
      console.log("Image selected:", selectedImage);
    } else {
      console.log("Image selection canceled");
    }
  };

  const prepareNativeFile = async (file: ImagePicker.ImagePickerAsset) => {
    try {
      const url = new URL(file.uri);
      return {
        name: url.pathname.split("/").pop()!,
        size: file.fileSize!,
        uri: url.href,
        type: file.mimeType!,
      };
    } catch (error) {
      console.error(error);
      Promise.reject(error);
    }
  };

  // State for brand, attire theme, and garment type
  const [brand, setBrand] = useState<string>("");
  const [attireTheme, setAttireTheme] = useState<string>("");
  const [garmentType, setGarmentType] = useState<string>("Full"); // Default to "Full"
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Valid garment type options - using useMemo to prevent recreation on each render
  const GARMENT_TYPES = useMemo(() => ["Full", "Tops", "Bottoms", "Accessories"], []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      
      // Validate garmentType to ensure it's one of the allowed values
      if (!GARMENT_TYPES.includes(garmentType)) {
        alert(`Garment type must be one of: ${GARMENT_TYPES.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the outfit data object with required fields
      const outfitData: any = {
        outfitName: name || "",
        brand: brand || "",
        attireTheme: attireTheme || "",
        // Always use the selected garment type to ensure it's valid
        garmentType: garmentType,
        // Use the current values from state
        size: size || "",
        material: material || "" 
      };
      
      console.log("Updating outfit with data:", outfitData);
      
      if (asset) {
        // If there's a new image, prepare the file and include it
        const file = await prepareNativeFile(asset);
        if (file && outfit?.$id) {
          await databaseService.editOutfit(outfit.$id, {
            ...outfitData,
            fileID: outfit.fileID,
            file: file
          });
        }
      } else if (outfit?.$id) {
        // Update without changing the image
        await databaseService.editOutfit(outfit.$id, {
          ...outfitData,
          fileID: outfit.fileID,
          file: undefined as any // This is a workaround for the type checking
        });
      }
      
      // Navigate back after successful update
      alert("Outfit updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating outfit:", error);
      alert("Failed to update outfit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const data = await databaseService.getOutfit(id as string);
      console.log("Loaded outfit data:", data);
      setOutfit(data);

      // Set form fields from loaded data
      setName(data.outfitName || "");
      setImage(data.imageUrl || "");
      setBrand(data.brand || "");
      setAttireTheme(data.attireTheme || "");
      setMaterial(data.material || ""); // Load material into the material field
      setSize(data.size || "");
      
      // Set garment type, ensuring it's one of the allowed values
      if (data.garmentType && GARMENT_TYPES.includes(data.garmentType)) {
        setGarmentType(data.garmentType);
      } else {
        // Default to "Full" if invalid or missing
        setGarmentType("Full");
      }
    } catch (error) {
      console.error("Error fetching outfit: ", error);
    } finally {
      setLoading(false);
    }
  }, [id, GARMENT_TYPES]);

  useEffect(() => {
    console.log("fetching");
    setLoading(true);

    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <PacmanIndicator color={Colors.light.tint} size={60} />
      </View>
    );
  } else {
    return (
      <ScrollView>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            testID="back-button"
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </Pressable>
        </View>
        <View style={styles.scrollView}>
          {/* Image Upload Section */}
          <View style={styles.imageContainer}>
            <Pressable
              onPress={pickImage}
              style={styles.imageUpload}
              testID="image-upload"
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                  testID="profile-image"
                />
              ) : (
                <Icon
                  name="add-a-photo"
                  type="material"
                  color="#6b7280"
                  size={32}
                  testID="add-photo-icon"
                />
              )}
            </Pressable>
            <Text style={styles.imageHelperText}>
              Please fill in the details below to create and connect your
              outfit's profile.
            </Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder=""
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
              placeholder="Enter brand (optional)"
              value={brand}
              onChangeText={(text) => setBrand(text)}
              autoCapitalize="words"
              testID="brand-input"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Attire Theme</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter theme (e.g., Casual, Formal)"
              value={attireTheme}
              onChangeText={(text) => setAttireTheme(text)}
              autoCapitalize="words"
              testID="theme-input"
            />
          </View>

          {/* Size Selection */}
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Size</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                {SIZE_OPTIONS.map((sizeOption) => (
                  <Pressable
                    key={sizeOption}
                    style={[styles.chip, size === sizeOption && styles.selectedChip]}
                    onPress={() => setSize(sizeOption)}
                  >
                    <Text style={[styles.chipText, size === sizeOption && styles.selectedChipText]}>
                      {sizeOption}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Garment Type</Text>
            <View style={styles.pickerContainer}>
              {GARMENT_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={[styles.typeOption, garmentType === type && styles.selectedType]}
                  onPress={() => setGarmentType(type)}
                  testID={`garment-type-${type.toLowerCase()}`}
                >
                  <Text style={[styles.typeText, garmentType === type && styles.selectedTypeText]}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Material</Text>
            <TextInput
              style={styles.input}
              placeholder="Material (optional)"
              value={material}
              onChangeText={(text) => setMaterial(text)}
              testID="material-input"
            />
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Update Outfit"
              buttonStyle={styles.submitButton}
              titleStyle={styles.buttonText}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !name}
              testID="submit-button"
              loadingProps={{ color: "white" }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
};

// Styles moved to StyleSheet for better type safety
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  imageUpload: {
    width: "100%",
    height: "auto",
    borderRadius: 8,
    backgroundColor: "#D6E0FF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    aspectRatio: 9 / 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageHelperText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
    paddingHorizontal: 20,
  },
  formField: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  submitButton: {
    backgroundColor: "#000000",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
    marginBottom: 16,
    height: 60,
  },
  typeOption: {
    flex: 1,
    minWidth: "22%",
    marginHorizontal: 6,
    marginVertical: 4,
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  selectedType: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  typeText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  selectedTypeText: {
    color: "#fff",
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  selectedChip: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  chipText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedChipText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default OutfitScreen;
