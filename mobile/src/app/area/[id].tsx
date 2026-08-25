import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { ProgressBar } from "@/components/stats/progress-bar";
import { MOCK_AREAS, DEFAULT_AREA_ID } from "@/lib/mock/mockAreas";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export default function AreaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const area = MOCK_AREAS[id ?? DEFAULT_AREA_ID] ?? MOCK_AREAS[DEFAULT_AREA_ID];

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.mapHeader}>
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: area.center.latitude,
              longitude: area.center.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            showsCompass={false}
          />
          <SafeAreaView edges={["top"]} style={styles.backWrap}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <View style={styles.backChevron} />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={typography.h2}>{area.name}</Text>
          <Text style={styles.subtitle}>{area.subtitle}</Text>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={typography.label}>Cleaned last 7 days</Text>
              <Text style={[typography.statSmall, { color: colors.oliveLight }]}>
                {area.cleanedThisWeekPercent}%
              </Text>
            </View>
            <ProgressBar
              segments={[
                { key: "week", percent: area.cleanedThisWeekPercent, color: colors.oliveLight },
                { key: "month", percent: area.cleanedThisMonthPercent, color: colors.oliveSofter },
                { key: "overdue", percent: area.overduePercent, color: colors.overdue },
              ]}
            />
            <View style={styles.legendRow}>
              <LegendDot color={colors.oliveLight} label="This week" />
              <LegendDot color={colors.oliveSofter} label="This month" />
              <LegendDot color={colors.overdue} label="Overdue" />
            </View>
          </View>

          <Text style={styles.sectionLabel}>Needs attention</Text>
          <View style={{ gap: spacing.sm + 2 }}>
            {area.needsAttention.map((street) => (
              <View key={street.id} style={styles.streetRow}>
                <View
                  style={[
                    styles.streetBar,
                    { backgroundColor: street.lastCleanedDaysAgo > 20 ? colors.overdue : colors.oliveSofter },
                  ]}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={typography.bodyStrong}>{street.name}</Text>
                  <Text style={styles.streetMeta}>
                    {street.km.toFixed(1)} km · last cleaned {street.lastCleanedDaysAgo} days ago
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapHeader: { height: 270 },
  backWrap: { position: "absolute", left: 0, right: 0, top: 0 },
  backButton: {
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(249,244,237,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.ink,
    transform: [{ rotate: "45deg" }],
    marginLeft: 3,
  },
  body: {
    marginTop: -28,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingBottom: 60,
    gap: spacing.xs,
  },
  subtitle: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 13.5,
    color: colors.inkFaint,
    marginBottom: spacing.lg,
  },
  progressCard: {
    padding: spacing.xl,
    borderRadius: radii.card,
    backgroundColor: colors.card,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  legendRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  legendDot: { width: 9, height: 9, borderRadius: 999 },
  legendLabel: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 11.5,
    color: colors.inkMuted,
  },
  sectionLabel: {
    ...typography.label,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  streetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.cardSm,
    backgroundColor: colors.surface,
  },
  streetBar: { width: 10, height: 38, borderRadius: 999 },
  streetMeta: {
    fontFamily: "Figtree_500Medium",
    fontSize: 12,
    color: colors.inkFaint,
  },
});
