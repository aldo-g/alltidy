import { StyleSheet, Text, View } from "react-native";
import { GlassPanel } from "@/components/ui/glass-panel";
import { colors, radii, spacing } from "@/lib/theme/tokens";

type Props = {
  areaName: string;
  streetsTracked: number;
};

export function AreaPill({ areaName, streetsTracked }: Props) {
  return (
    <GlassPanel radius={radii.pill} style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.pin} />
        <View>
          <Text style={styles.title}>{areaName}</Text>
          <Text style={styles.subtitle}>{streetsTracked} streets tracked</Text>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  pin: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  title: {
    fontFamily: "Figtree_700Bold",
    fontSize: 14.5,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: "Figtree_500Medium",
    fontSize: 11.5,
    color: colors.inkFaint,
  },
});
