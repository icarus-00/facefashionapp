import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import databaseService from "@/services/database/db";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  FadeIn,
  ZoomIn,
  SlideInRight,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ActorScreen = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.95);
  const buttonScale = useSharedValue(0.95);
  
  React.useEffect(() => {
    // Entrance animations
    headerOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    imageScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 90 }));
    buttonScale.value = withDelay(400, withSpring(1, { damping: 12 }));
  }, []);
  
  // Header animation
  const headerAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }]
    };
  });
  
  // Image animation
  const imageAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
      opacity: interpolate(imageScale.value, [0.95, 1], [0.5, 1])
    };
  });
  
  // Button animation
  const buttonAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
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
    // Animation for button press
    buttonScale.value = withSequence(
      withTiming(0.92, { duration: 100 }),
      withSpring(1, { damping: 4, stiffness: 300 })
    );
    
    try {
      if (asset) {
        const file = await prepareNativeFile(asset!)!;
        console.log("uploading");
        await databaseService.addActor(name, file);
        router.back();
      } else {
        alert("Please select an image for your actor");
      }
    } catch (error) {
      console.error("Error adding actor:", error);
      alert("Failed to add actor. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <AnimatedView 
        style={[styles.header, headerAnimStyle]}
        entering={FadeIn.duration(500)}
      >
        <HStack className="justify-between items-center w-full">
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            testID="back-button"
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Create Actor</Text>
          
          {/* Empty view for spacing */}
          <View style={{ width: 40 }} />
        </HStack>
      </AnimatedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Upload Section */}
        <Animated.View 
          style={[styles.imageContainer, imageAnimStyle]}
          entering={FadeIn.delay(300).duration(500)}
        >
          <Pressable
            onPress={pickImage}
            style={styles.imageUpload}
            testID="image-upload"
          >
            {image ? (
              <>
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                  testID="profile-image"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.tapToChangeText}>Tap to change</Text>
                </LinearGradient>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialIcons name="add-a-photo" size={40} color="#6b7280" />
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.imageHelperText}>
            Please upload a photo and fill in the details to create your actor's profile.
          </Text>
        </Animated.View>

        {/* Form Inputs - with animations */}
        <Animated.View entering={SlideInRight.delay(400).duration(500)}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter actor's name"
              value={name}
              onChangeText={(text) => setName(text)}
              autoCapitalize="words"
              testID="name-input"
            />
          </View>
        </Animated.View>

        <Animated.View entering={SlideInRight.delay(500).duration(500)}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              value={age}
              onChangeText={(text) => setAge(text)}
              keyboardType="numeric"
              testID="age-input"
            />
          </View>
        </Animated.View>
        
        <Animated.View entering={SlideInRight.delay(600).duration(500)}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Weight & Height</Text>
            <View style={styles.rowContainer}>
              <TextInput
                style={styles.halfInput}
                placeholder="Weight (kg)"
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
                testID="weight-input"
              />
              <TextInput
                style={styles.halfInput}
                placeholder="Height (cm)"
                value={height}
                onChangeText={(text) => setHeight(text)}
                keyboardType="numeric"
                testID="height-input"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={SlideInRight.delay(700).duration(500)}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Additional Information</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add any additional details about this actor"
              value={additionalInfo}
              onChangeText={(text) => setAdditionalInfo(text)}
              multiline
              textAlignVertical="top"
              testID="additional-info-input"
            />
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View 
          style={[styles.buttonContainer, buttonAnimStyle]}
          entering={ZoomIn.delay(800).duration(300)}
        >
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            testID="submit-button"
          >
            <Text style={styles.buttonText}>Dress Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// Styles moved to StyleSheet for better type safety
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 16,
    marginBottom: 24,
  },
  imageUpload: {
    width: "100%",
    height: "auto",
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    aspectRatio: 9 / 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tapToChangeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#6b7280",
    marginTop: 8,
    fontSize: 16,
  },
  imageHelperText: {
    textAlign: "center",
    marginTop: 12,
    color: "#4B5563",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 14,
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    alignItems: "center",
    // marginVertical: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#121212",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ActorScreen;
