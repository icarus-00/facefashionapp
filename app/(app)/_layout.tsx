// app/(app)/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import { useUser } from "@/context/authcontext";
import { useEffect } from "react";

export default function AppLayout() {
  const { isLoading, current } = useUser();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log(current);
    console.log(segments);
    const authgroup = segments[1] == "(auth)";
    const appgroup = segments[0] == "(app)";
    const isLoggedIn = current !== null;

    if (isLoading) {
      return;
    }
    if (!authgroup && isLoggedIn) {
      router.replace("/(app)/(auth)/(tabs)");
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
