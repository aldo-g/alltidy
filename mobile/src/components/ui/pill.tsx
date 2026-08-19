import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  tone?: "olive" | "terracotta" | "neutral";
}>;

export function Pill({ children, style, tone = "neutral" }: Props) {
  return <View style={[styles.base, toneStyles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    alignSelf: "flex-start",
  },
});

const toneStyles: Record<NonNullable<Props["tone"]>, ViewStyle> = {
  olive: { backgroundColor: colors.olive },
  terracotta: { backgroundColor: colors.accentSoft },
  neutral: { backgroundColor: colors.surface },
};
