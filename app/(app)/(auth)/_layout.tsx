import { Stack, useSegments, useRouter } from "expo-router";
import { View } from "react-native";
import SafeAreaView from "@/components/atoms/safeview/safeview";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AuthLayout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="actor" options={{ headerShown: false }} />
        <Stack.Screen
          name="outfit"
          options={{ headerShown: false, presentation: "transparentModal" }}
        />
        <Stack.Screen name="generations" options={{ headerShown: false }} />
        <Stack.Screen name="help" options={{headerShown:false}}/>
        <Stack.Screen name="newUserPage" options={{headerShown:false}}/>
      </Stack>
    </GestureHandlerRootView>
  );
}
