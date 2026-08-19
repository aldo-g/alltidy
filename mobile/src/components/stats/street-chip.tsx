import { StyleSheet, Text } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";

export function StreetChip({ label }: { label: string }) {
  return <Text style={styles.chip}>{label}</Text>;
}

const styles = StyleSheet.create({
  chip: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12,
    color: colors.olive,
    backgroundColor: colors.oliveSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    overflow: "hidden",
  },
});
