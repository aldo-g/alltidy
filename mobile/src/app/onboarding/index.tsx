import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { colors, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

const ONBOARDED_KEY = "alltidy_onboarded";

export default function OnboardingScreen() {
  const complete = async () => {
    await AsyncStorage.setItem(ONBOARDED_KEY, "1");
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />
      <View style={styles.blobThree} />

      <SafeAreaView style={styles.content} edges={["bottom"]}>
        <Pill tone="olive">
          <Text style={styles.pillLabel}>Amsterdam</Text>
        </Pill>

        <Text style={styles.hero}>Every street you clean stays on the map.</Text>

        <Text style={styles.body}>
          Walk with a bag and a grabber. AllTidy records your route and paints it green for the
          neighbourhood to see. It fades over a month — so the map always shows what needs you
          next.
        </Text>

        <View style={styles.actions}>
          <Button onPress={complete}>Start with my street</Button>
          <Button variant="ghost" onPress={complete}>
            Look at the map first
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.olive,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  blobOne: {
    position: "absolute",
    top: -90,
    right: -110,
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: colors.oliveLight,
  },
  blobTwo: {
    position: "absolute",
    top: 150,
    left: -90,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "rgba(198,113,57,0.55)",
  },
  blobThree: {
    position: "absolute",
    top: 96,
    right: 52,
    width: 118,
    height: 118,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  pillLabel: {
    fontFamily: "Figtree_700Bold",
    fontSize: 11.5,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.oliveSoft,
  },
  hero: {
    ...typography.heroDisplay,
    color: colors.oliveText,
  },
  body: {
    fontFamily: "Figtree_500Medium",
    fontSize: 16,
    lineHeight: 25,
    color: colors.oliveSofter,
    maxWidth: 300,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
