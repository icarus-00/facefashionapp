// app/(app)/_layout.tsx
import { Stack } from "expo-router";
import { useUser } from "@/context/authcontext";

export default function AppLayout() {
  const { isLoading } = useUser();

  // You can show a loading state if needed
  if (isLoading) {
    return null; // Or return a loading component
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* Add any other screens for unauthenticated users */}
    </Stack>
  );
}
