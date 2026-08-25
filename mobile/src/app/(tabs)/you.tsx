import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatGrid } from "@/components/stats/stat-grid";
import { BarChart14Week } from "@/components/stats/bar-chart-14-week";
import { MOCK_PROFILE } from "@/lib/mock/mockProfile";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export default function YouScreen() {
  const p = MOCK_PROFILE;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{p.initial}</Text>
          </View>
          <View style={{ gap: 3 }}>
            <Text style={typography.h3}>{p.name}</Text>
            <Text style={styles.meta}>
              {p.area} · joined {p.joined}
            </Text>
          </View>
        </View>

        <StatGrid
          columns={3}
          tiles={[
            { key: "cleanups", value: String(p.cleanups), label: "Cleanups" },
            { key: "total", value: `${p.totalKm}km`, label: "Total" },
            { key: "streak", value: String(p.streakWeeks), label: "Streak", tone: "olive" },
          ]}
        />

        <View style={styles.card}>
          <Text style={typography.label}>Streets you keep alive</Text>
          <Text style={styles.copy}>
            {p.streetsKept} streets in {p.streetsKeptArea} have you as their most recent cleaner.
          </Text>
          <BarChart14Week heights={p.weeklyBars} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[typography.label, { color: colors.inkMuted }]}>Badges</Text>
          <View style={styles.badgeRow}>
            {p.badges.map((badge) => (
              <Text key={badge} style={styles.badge}>
                {badge}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 140, gap: spacing.lg },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 28,
    color: colors.white,
  },
  meta: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 12.5,
    color: colors.inkFaint,
  },
  card: {
    padding: spacing.xl,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  copy: {
    fontFamily: "Figtree_500Medium",
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.inkMuted,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  badge: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12.5,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 1,
    overflow: "hidden",
  },
});
