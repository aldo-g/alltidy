import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";

export const FEED_FILTERS = ["Nearby", "Following", "Events"] as const;
export type FeedFilter = (typeof FEED_FILTERS)[number];

type Props = {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
};

export function FilterChips({ active, onChange }: Props) {
  return (
    <View style={styles.row}>
      {FEED_FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
          >
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 1,
    borderRadius: radii.pill,
  },
  chipActive: { backgroundColor: colors.ink },
  chipInactive: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(32,30,29,0.16)",
  },
  label: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12.5,
  },
  labelActive: { color: colors.background },
  labelInactive: { color: colors.inkMuted },
});
