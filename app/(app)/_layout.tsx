// app/(app)/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import { useUser } from "@/context/authcontext";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function AppLayout() {
  const { isLoading, current, enableTestMode, testMode } = useUser();

  const router = useRouter();
  const segments = useSegments();

  // Enable test mode for offline testing


  useEffect(() => {
    
    console.log(current);
    console.log(segments);
    const authgroup = segments[1] == "(auth)";
    const appgroup = segments[0] == "(app)";
    console.log(current)

    // Check if user is logged in, accounting for test mode
    const isLoggedIn = (current !== undefined && current !== null) || (testMode.enabled && testMode.mockUserId);

    console.log("authgroup", authgroup);
    console.log("appgroup", appgroup);
    console.log("isLoggedIn", isLoggedIn);

    if (isLoading) {
      return;
    }
    if (!authgroup && isLoggedIn) {
      router.replace("/(app)/(auth)/(tabs)/home");
    } else if (authgroup && !isLoggedIn) {
      router.replace("/(app)");
    }
  }, [current]);

  // You can show a loading state if needed
  if (isLoading) {
    return null; // Or return a loading component
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Add any other screens for unauthenticated users */}
    </Stack>
  );
}
