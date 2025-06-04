import React, { useEffect, useState } from "react";
import { View, TextInput, ActivityIndicator, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import OPTIN, { grabUserStatus, updateUserStatus, createAvatar } from "@/services/config/user-optin";
import { account } from "@/services/config/appwrite";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { Button, ButtonText } from "@/components/ui/button";
import { MaterialIcons } from "@expo/vector-icons";
import { PacmanIndicator } from "react-native-indicators";

export default function NewUser() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [optinLoading, setOptinLoading] = useState(false);
  const [finishedSignIn, setFinishedSignIn] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const checkUserMeta = async () => {
    setLoading(true);
    try {
      const userMeta = await grabUserStatus();
      if (userMeta.documents && userMeta.documents[0]) {
        const status = userMeta.documents[0]["finished-sign-in"];
        setFinishedSignIn(status);
        if (status === "done") {
          router.replace("/(app)/(auth)/(tabs)/home");
          setOptinLoading(false);
          setLoading(false);
          return;
        }
      }
    } catch (e: any) {
      setFinishedSignIn(null);
      setErrorMessage(e?.message || "An error occurred. Please try again.");
      setErrorModalVisible(true);
    }
    setOptinLoading(false);
    setLoading(false);
  };

  useEffect(() => {
    checkUserMeta();
  }, []);
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
      aspect: [1, 1],
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

  const handleOptin = async () => {
    setOptinLoading(true);
    try {
      await account.updateName(username);
      if (asset) {
        const nativeFile = await prepareNativeFile(asset);
        if (nativeFile) {
          await createAvatar(nativeFile);
        }
      }
      await OPTIN();
      await checkUserMeta();
    } catch (e :any) {
      setErrorMessage(e?.message  || "An error occurred. Please try again.");
      setErrorModalVisible(true);
      setOptinLoading(false);
    }
  };
  const handleOptinEmpty = async () => {
    setOptinLoading(true);
    try {
      await account.updateName(username);
      if (asset) {
        const nativeFile = await prepareNativeFile(asset);
        if (nativeFile) {
          await createAvatar(nativeFile);
        }
      }
      await updateUserStatus(false);
      await checkUserMeta();
    } catch (e:any) {
      setErrorMessage(e?.message || "An error occurred. Please try again.");
      setErrorModalVisible(true);
      setOptinLoading(false);
    }
  };

  if (loading || finishedSignIn === "done") {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f8f8" }}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={60}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f8f8f8" }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 24, color: "#111", textAlign: "center" }}>
          Please finish sign in
        </Text>
        <View style={{ width: "100%", padding: 16, marginBottom: 24, alignItems: "center" }}>
          {/* Avatar picker as a circle */}
          <TouchableOpacity
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#eee",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              borderWidth: 2,
              borderColor: image ? "#111" : "#ccc",
              overflow: "hidden",
            }}
            onPress={pickImage}
            disabled={optinLoading}
            activeOpacity={0.7}
          >
            {image ? (
              <Image source={{ uri: image }} style={{ width: 96, height: 96, borderRadius: 48 }} />
            ) : (
              <MaterialIcons name="person" size={48} color="#bbb" />
            )}
          </TouchableOpacity>
          {/* Username input */}
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#bbb",
              borderRadius: 14,
              padding: 16,
              fontSize: 18,
              backgroundColor: "#fff",
              marginBottom: 8,
              width: "100%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity
          onPress={handleOptin}
          
          
          style={{
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 32,
    width: "70%",
    alignItems: 'center',
    justifyContent: 'center',
  }}
        >

          <Text className="text-white text-lg font-semibold">
            Opt In
          </Text>
          
        </TouchableOpacity>
        <Button
          //style={{ width: "100%", maxWidth: 340, alignItems: "center", marginBottom: 8 }}
          disabled={optinLoading}
          variant="link"
          onPress={handleOptinEmpty}
        >
          <ButtonText style={{ color: "#111", fontSize: 18, fontWeight: "light" , marginTop:8 , textDecorationLine:"underline" }}>Continue Without Opt In</ButtonText>
        </Button>
        <Modal isVisible={errorModalVisible} onBackdropPress={() => setErrorModalVisible(false)}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#d00' }}>Error</Text>
            <Text style={{ fontSize: 16, color: '#333', marginBottom: 16, textAlign: 'center' }}>{errorMessage}</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#d00', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Loading Modal for opt-in process */}
        <Modal isVisible={optinLoading} backdropOpacity={0.4} animationIn="fadeIn" animationOut="fadeOut">
          <View style={{ backgroundColor: '#fff', padding: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
            <PacmanIndicator size={60} color="#111" />
            <Text style={{ marginTop: 18, fontSize: 18, fontWeight: '600', color: '#111' }}>Processing...</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
