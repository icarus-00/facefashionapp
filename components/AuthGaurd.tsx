// components/AuthGuard.tsx
import { useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "@/context/authcontext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { current, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Skip when loading
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(app)" && segments[1] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    if (!current && inAuthGroup) {
      // If user is not logged in and trying to access auth group, redirect to login
      router.replace("/(app)/login");
    } else if (current && inAppGroup) {
      // If user is logged in and in app group (but not viewing profile), redirect to auth home
      router.replace("/(app)/(auth)/(tabs)");
    }
  }, [current, segments, isLoading]);

  return <>{children}</>;
}
