import { Redirect, Stack } from "expo-router";
import { useUser } from "@/context/authcontext";
export default function AppLayout() {
  const { current } = useUser();
  if (current === null) {
    <Redirect href="/(app)" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
