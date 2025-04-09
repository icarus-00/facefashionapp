import { Stack, useSegments, useRouter } from "expo-router";
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="actor" options={{ headerShown: false }} />
      <Stack.Screen name="outfit" options={{ headerShown: false }} />
    </Stack>
  );
}
