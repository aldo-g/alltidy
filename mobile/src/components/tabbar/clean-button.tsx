import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { colors, shadow, spacing } from "@/lib/theme/tokens";

const SIZE = 74;

export function CleanButton() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/record/active");
  };

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, shadow.floating, pressed && styles.pressed]}
      >
        <View style={styles.icon} />
        <Text style={styles.label}>CLEAN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.xl,
    alignItems: "center",
    zIndex: 20,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 5,
    borderColor: colors.background,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  pressed: {
    backgroundColor: colors.accentActive,
  },
  icon: {
    width: 20,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: colors.white,
  },
  label: {
    fontFamily: "Figtree_800ExtraBold",
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.white,
  },
});
