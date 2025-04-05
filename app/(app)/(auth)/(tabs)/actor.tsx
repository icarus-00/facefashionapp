import { ThemedView } from "@/components/ThemedView";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";


export default function Actor() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ThemedView className="flex-1">
        <View className="p-5 items-center justify-center">
          <Text>Outfit</Text>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
