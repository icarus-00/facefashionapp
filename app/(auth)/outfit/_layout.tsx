import { Stack } from "expo-router";

export default function ActorLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="[get]" options={{ headerShown: false }} />
    </Stack>
  );
}
