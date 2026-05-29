import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useStore } from "@/store/useStore";
import { InstallPrompt } from "@/components/InstallPrompt";

export default function RootLayout() {
  const hydrate = useStore((s) => s.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#E6EDF7",
          contentStyle: { backgroundColor: "#0B1220" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan/camera" options={{ title: "Scan" }} />
        <Stack.Screen name="scan/result" options={{ title: "Result" }} />
      </Stack>
      <InstallPrompt />
    </GestureHandlerRootView>
  );
}
