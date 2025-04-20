import { Stack } from "expo-router";

export default function GenerationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="get" options={{ headerShown: false }} />
    </Stack>
  );
}
