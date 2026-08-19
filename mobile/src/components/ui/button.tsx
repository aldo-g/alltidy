import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

type Variant = "primary" | "secondary" | "ghost";

type Props = PropsWithChildren<{
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  haptic?: boolean;
}>;

export function Button({
  children,
  onPress,
  variant = "primary",
  style,
  disabled,
  haptic = true,
}: Props) {
  const handlePress = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[typography.button, variant !== "primary" && textVariantStyles[variant]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.card },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(32,30,29,0.16)",
  },
};

const textVariantStyles = {
  secondary: { color: colors.ink },
  ghost: { color: colors.inkMuted },
} as const;
