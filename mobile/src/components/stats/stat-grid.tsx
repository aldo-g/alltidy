import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export type StatTile = {
  key: string;
  value: string;
  label: string;
  tone?: "default" | "olive" | "terracotta";
};

const toneTextColor: Record<NonNullable<StatTile["tone"]>, string> = {
  default: colors.ink,
  olive: colors.white,
  terracotta: colors.white,
};

const toneLabelColor: Record<NonNullable<StatTile["tone"]>, string> = {
  default: colors.inkFaint,
  olive: colors.oliveSofter,
  terracotta: colors.accentSoft,
};

type Props = {
  tiles: StatTile[];
  columns?: 2 | 3;
};

export function StatGrid({ tiles, columns = 2 }: Props) {
  return (
    <View style={styles.grid}>
      {tiles.map((tile) => (
        <View
          key={tile.key}
          style={[
            styles.tile,
            { width: columns === 2 ? "48.5%" : "31.5%" },
            toneStyles[tile.tone ?? "default"],
          ]}
        >
          <Text style={[typography.statMedium, { color: toneTextColor[tile.tone ?? "default"] }]}>
            {tile.value}
          </Text>
          <Text style={[typography.label, { color: toneLabelColor[tile.tone ?? "default"] }]}>
            {tile.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  tile: {
    borderRadius: radii.card,
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.xxs,
  },
});

const toneStyles: Record<NonNullable<StatTile["tone"]>, ViewStyle> = {
  default: {},
  olive: { backgroundColor: colors.olive },
  terracotta: { backgroundColor: colors.accent },
};
