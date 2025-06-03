import React, { useEffect, useState } from "react";
import { View, TextInput, Button, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import OPTIN, { grabUserStatus, updateUserStatus } from "@/services/config/user-optin";
import { account } from "@/services/config/appwrite";
import SafeAreaView from "@/components/atoms/safeview/safeview";

export default function NewUser() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [optinLoading, setOptinLoading] = useState(false);
  const [finishedSignIn, setFinishedSignIn] = useState<string | null>(null);
  const router = useRouter();

  // Check user meta on mount and after optin
  const checkUserMeta = async () => {
    setLoading(true);
    
    try {
      const userMeta = await grabUserStatus();
      if (userMeta.documents && userMeta.documents[0]) {
        const status = userMeta.documents[0]["finished-sign-in"];
        setFinishedSignIn(status);
        
        if (status === "done") {
            await account.updateName(username); // Update username in Appwrite account
          router.replace("/(app)/(auth)/(tabs)/home"); // fallback to main app page if (tabs) route is not valid
        }
      }
    } catch (e) {
      setFinishedSignIn(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserMeta();
  }, []);

  const handleOptin = async () => {
    setOptinLoading(true);
    try {
      await OPTIN();
      await checkUserMeta();
    } catch (e) {
      // handle error
    } finally {
      setOptinLoading(false);
    }
  };
  const handleOptinEmpty = async () => {
    setOptinLoading(true);
    try {
      await updateUserStatus(false);
      await checkUserMeta();
    } catch (e) {
      // handle error
    } finally {
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
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f8f8f8" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12, color: "#111" }}>Welcome!</Text>
      <Text style={{ fontSize: 18, color: "#555", marginBottom: 32, textAlign: "center", maxWidth: 320 }}>
        Please set your username to get started. You can opt in to aggregate your account with outfits.
      </Text>
      <View style={{ width: "100%", maxWidth: 340, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, color: "#222", marginBottom: 8 }}>Username</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            padding: 14,
            fontSize: 18,
            backgroundColor: "#fff",
            marginBottom: 8,
          }}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: username ? "#111" : "#bbb",
          paddingVertical: 16,
          borderRadius: 10,
          width: "100%",
          maxWidth: 340,
          alignItems: "center",
          marginBottom: 16,
          opacity: optinLoading ? 0.7 : 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={handleOptin}
        disabled={optinLoading || !username}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Opt In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#111",
          paddingVertical: 16,
          borderRadius: 10,
          width: "100%",
          maxWidth: 340,
          alignItems: "center",
          marginBottom: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
        disabled={optinLoading}
        onPress={handleOptinEmpty}
      >
        <Text style={{ color: "#111", fontSize: 18, fontWeight: "bold" }}>Continue Without Opt In</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}
