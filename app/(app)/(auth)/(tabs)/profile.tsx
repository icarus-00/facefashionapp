import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { useUser } from "@/context/authcontext";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";

export default function Profile() {
  const { logout } = useUser();
  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logout();
      console.log("Logout successful");
      router.replace("/(app)");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1">
        <View className="p-5 items-center justify-center">
          <Text>Outfit</Text>
          <Button onPress={handleLogout}>
            <ButtonText>logout</ButtonText>
          </Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
