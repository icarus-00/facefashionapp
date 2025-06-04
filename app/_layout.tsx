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
  const { isLoading, current } = useUser();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && !isLoading) {
      // If fonts are loaded and user data is ready, hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded,isLoading]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <UserProvider>
      <ToastProvider>
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
      </ToastProvider>
    </UserProvider>
  );
}
