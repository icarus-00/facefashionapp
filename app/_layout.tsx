// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Children, useEffect } from "react";
import "react-native-reanimated";
import UserProvider, { useUser } from "@/context/authcontext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ToastInitializer, ToastProvider } from "@/context/toastContext";
import { Stack, useSegments, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { current, isLoading } = useUser();
  useEffect(() => {
    const authgroup = segments[0] == "(auth)";
    const appgroup = segments[0] == "(app)";
    const isLoggedIn = current !== null;

    if (isLoading) {
      return;
    }
    if (!authgroup && isLoggedIn) {
      router.replace("/(auth)/(tabs)");
    } else if (authgroup && !isLoggedIn) {
      router.replace("/(app)");
    }
  }, [current]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ToastProvider>
      <UserProvider>
        <GestureHandlerRootView>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GluestackUIProvider mode="light">
              <AppLayout />

              <ToastInitializer />
              <StatusBar />
            </GluestackUIProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </UserProvider>
    </ToastProvider>
  );
}
