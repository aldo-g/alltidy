import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme/tokens";

export function BarChart14Week({ heights }: { heights: number[] }) {
  const max = Math.max(...heights, 1);
  return (
    <View>
      <View style={styles.bars}>
        {heights.map((h, i) => (
          <View
            key={i}
            style={[styles.bar, { height: `${(h / max) * 100}%` }]}
          />
        ))}
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>14 weeks ago</Text>
        <Text style={styles.label}>This week</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bars: {
    flexDirection: "row",
    gap: 3,
    height: 56,
    alignItems: "flex-end",
  },
  bar: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.oliveLight,
    minHeight: 4,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  label: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 10.5,
    color: colors.inkFaint,
  },
});
