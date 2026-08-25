import { StyleSheet, Text, View } from "react-native";
import type { FeedItem } from "@/lib/mock/mockFeed";
import { colors, radii, shadow, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export function CleanupListItem({ item }: { item: FeedItem }) {
  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>{item.initial}</Text>
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={typography.bodyStrong}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.when} · {item.area}
          </Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <Stat value={item.dist} label="Distance" />
        <Stat value={item.time} label="Duration" />
        <Stat value={item.streets} label="Streets" tone="olive" />
      </View>
    </View>
  );
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: "olive" }) {
  return (
    <View style={{ gap: 1 }}>
      <Text style={[typography.statSmall, tone === "olive" && { color: colors.oliveLight }]}>
        {value}
      </Text>
      <Text style={typography.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.oliveSofter,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 16,
    color: colors.olive,
  },
  meta: {
    fontFamily: "Figtree_500Medium",
    fontSize: 11.5,
    color: colors.inkFaint,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xxl,
  },
});
