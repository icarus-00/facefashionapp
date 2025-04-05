import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Redirect, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import UserProvider, { useUser } from "@/context/authcontext"; // Ensure correct import
import { useColorScheme } from "@/hooks/useColorScheme";
import { ToastInitializer, ToastProvider } from "@/context/toastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const AuthStack = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: true, headerTitle: "auth Stack" }}
      />
    </Stack>
  );
};

const GuestStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
};
function RootLayout() {
  return (
    <ToastProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ToastProvider>
  );
}

function AppContent() {
  const { current } = useUser();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  console.log(current);
  {
    /*useEffect(() => {
    if (current === null) {
      router.push("/");
    } else {
      router.push("/(tabs)");
    }
  }, [current]);*/
  }
  useEffect(() => {
    console.log(current);
  }, [current]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GluestackUIProvider mode="light">
        {current === null ? <GuestStack /> : <AuthStack />}
        <ToastInitializer />
        <StatusBar />
      </GluestackUIProvider>
    </ThemeProvider>
  );
}

const AppLayout = () => {
  const { current } = useUser();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
};
export default AppLayout;
