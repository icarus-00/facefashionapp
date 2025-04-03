import { ThemedView } from "@/components/ThemedView";
import OnboardingScreen from "@/components/pages/onboarding/onboarding";
import { Button, ButtonText } from "@/components/ui/button";
import { View } from "react-native";
export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <OnboardingScreen />
      <View className="p-5 items-center justify-center">
        <Button className="bg-blue-500 w-full h-20 " variant="solid" size="xl">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </ThemedView>
  );
}

{
  /*
  <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          className="absolute bottom-0 left-0 h-[178px] w-[290px]"
        />
      }
    >
      <ThemedView className="flex-row items-center gap-2">
        <Card size="md" className="flex-1 " variant="filled">
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </Card>

      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to weam more about what's included in this starter
          app.
        </ThemedText>
      </ThemedView>
      <ThemedView className="gap-2 mb-2">
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>*/
}
