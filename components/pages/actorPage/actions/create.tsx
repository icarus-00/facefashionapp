import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import databaseService from "@/services/database/db";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, Icon } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { err } from "react-native-svg";

const ActorScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
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

  // Handle form submission
  const handleSubmit = async () => {
    const file = await prepareNativeFile(asset!)!;
    console.log("pressed");
    console.log(file);
    if (file) {
      console.log("uploading");
      await databaseService.addActor(name, file);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
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
            Please fill in the details below to create and connect your actor's
            profile.
          </Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Full Name</Text>
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
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
            testID="age-input"
          />
        </View>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Weight & Height</Text>
          <View style={styles.rowContainer}>
            <TextInput
              style={styles.halfInput}
              placeholder="W"
              value={weight}
              onChangeText={(text) => setWeight(text)}
              keyboardType="numeric"
              testID="weight-input"
            />
            <TextInput
              style={styles.halfInput}
              placeholder="H"
              value={height}
              onChangeText={(text) => setHeight(text)}
              keyboardType="numeric"
              testID="height-input"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Additional Information</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Optional"
            value={additionalInfo}
            onChangeText={(text) => setAdditionalInfo(text)}
            multiline
            textAlignVertical="top"
            testID="additional-info-input"
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Dress Up"
            buttonStyle={styles.submitButton}
            titleStyle={styles.buttonText}
            onPress={handleSubmit}
            testID="submit-button"
          />
        </View>
      </ScrollView>
    </View>
  );
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
    color: "#4B5563",
    paddingHorizontal: 16,
    fontSize: 14,
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
  rowContainer: {
    flexDirection: "row",
    gap: 16,
  },
  halfInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  submitButton: {
    backgroundColor: "#6D28D9",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ActorScreen;
