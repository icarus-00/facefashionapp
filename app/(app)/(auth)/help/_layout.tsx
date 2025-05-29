import { Stack } from "expo-router";

export default function HelpLayout() {
    return (
        <Stack>
            <Stack.Screen name="help" options={{ title: "Help" }} />
            <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        </Stack>
    );
}