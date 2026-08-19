import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPanel } from "@/components/ui/glass-panel";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export function FreshnessLegendChip() {
  return (
    <GlassPanel radius={radii.cardSm}>
      <View style={styles.wrap}>
        <Text style={typography.label}>Last cleaned</Text>
        <View style={styles.row}>
          <LinearGradient
            colors={["#56633f", "#8fa073", "#d67f48"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
          <Text style={styles.label}>today</Text>
          <Text style={styles.label}>30d+</Text>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  gradient: {
    width: 26,
    height: 5,
    borderRadius: 999,
  },
  label: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 11,
    color: colors.inkMuted,
  },
});
