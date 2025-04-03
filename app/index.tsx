import { ThemedView } from "@/components/ThemedView";
import OnboardingScreen from "@/components/pages/onboarding/onboarding";
import { Button, ButtonText } from "@/components/ui/button";
import { View } from "react-native";
export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <OnboardingScreen />
    </ThemedView>
  );
}
