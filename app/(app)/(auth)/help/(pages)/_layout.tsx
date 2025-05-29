import { Stack } from "expo-router";

export default function HelpPagesLayout() {
    return (
        <Stack>
            <Stack.Screen name="help1" options={{ title: "Generation Kickstart" }} />
            <Stack.Screen name="help2" options={{ title: "Prompting" }} />
            <Stack.Screen name="help3" options={{ title: "Actors and Outfits" }} />
            <Stack.Screen name="help4" options={{ title: "Image Generation" }} />
            <Stack.Screen name="help5" options={{ title: "Video generation" }} />
        </Stack>
    );
}