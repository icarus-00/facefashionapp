import { ThemedView } from "@/components/ThemedView";
import OnboardingScreen from "@/components/pages/onboarding/onboarding";
import { Button, ButtonText } from "@/components/ui/button";
import { View, Platform } from "react-native";
import SafeAreaView from "@/components/atoms/safeview/safeview";

export default function HomeScreen() {
  console.log(Platform.OS)
  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <OnboardingScreen path={"/login"} />
      </ThemedView>
    </SafeAreaView>
  );
}
