import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing } from "@/lib/theme/tokens";

const FILTERS = ["Nearby", "Following", "Events"] as const;

export function FilterChips() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("Nearby");

  return (
    <View style={styles.row}>
      {FILTERS.map((filter) => {
        const isActive = filter === active;
        return (
          <Pressable
            key={filter}
            onPress={() => setActive(filter)}
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
