import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppFonts } from "@/lib/theme/fonts";
import { colors } from "@/lib/theme/tokens";

SplashScreen.preventAutoHideAsync();

const ONBOARDED_KEY = "alltidy_onboarded";

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      if (!value) router.replace("/onboarding");
      setOnboardingChecked(true);
    });
  }, []);

  const ready = fontsLoaded && onboardingChecked;

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} onLayout={onLayout}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="area/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="record" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="challenges/index" options={{ presentation: "card" }} />
      </Stack>
    </View>
  );
}
