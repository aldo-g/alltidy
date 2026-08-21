import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FreshnessMap } from "@/components/map/freshness-map";
import { AreaPill } from "@/components/map/area-pill";
import { FreshnessLegendChip } from "@/components/map/freshness-legend-chip";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { MOCK_ROUTES } from "@/lib/mock/mockRoutes";
import { MOCK_AREAS, DEFAULT_AREA_ID } from "@/lib/mock/mockAreas";
import { useActivities } from "@/lib/hooks/useActivities";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

// Tab bar content height set in (tabs)/_layout.tsx (paddingTop 14 +
// paddingBottom 14 + icon/label ~52 + the CleanButton stack) — the
// navigator itself sits below the safe area, so its true on-screen height
// is this plus the device's bottom inset, added via useSafeAreaInsets below.
const TAB_BAR_HEIGHT = 94;

export default function MapScreen() {
  const area = MOCK_AREAS[DEFAULT_AREA_ID];
  const insets = useSafeAreaInsets();
  const { activities: posted } = useActivities();
  // Falls back to MOCK_ROUTES when Supabase has no real cleanups yet, same
  // as the web app's app/page.tsx — keeps the map busy during local dev
  // and early testing instead of showing an empty canvas.
  const activities = useMemo(
    () => (posted.length > 0 ? posted : MOCK_ROUTES),
    [posted]
  );

  return (
    <View style={styles.container}>
      <FreshnessMap activities={activities} />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none" edges={["top"]}>
        <View style={styles.topRow}>
          <AreaPill areaName="Amsterdam" streetsTracked={activities.length} />
          <FreshnessLegendChip />
        </View>

        <View style={[styles.sheetWrap, { bottom: TAB_BAR_HEIGHT + insets.bottom + spacing.sm }]}>
          <GlassPanel radius={radii.card} style={styles.sheet}>
            <View style={styles.sheetInner}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={{ gap: 2 }}>
                  <Text style={typography.h3}>{area.name}</Text>
                  <Text style={styles.sheetSubtitle}>Your patch this week</Text>
                </View>
                <Button
                  variant="secondary"
                  style={styles.openAreaButton}
                  onPress={() => router.push(`/area/${area.id}`)}
                >
                  <Text style={styles.openAreaLabel}>Open area</Text>
                </Button>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={[typography.statSmall, { color: colors.oliveLight }]}>
                    {area.personalKm}
                    <Text style={styles.statUnit}>km</Text>
                  </Text>
                  <Text style={typography.label}>You</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={typography.statSmall}>
                    {area.neighbourhoodKm}
                    <Text style={styles.statUnit}>km</Text>
                  </Text>
                  <Text style={typography.label}>Neighbourhood</Text>
                </View>
              </View>
            </View>
          </GlassPanel>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  overlay: { ...StyleSheet.absoluteFill },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sheetWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
  },
  sheet: {},
  sheetInner: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sheetSubtitle: {
    ...typography.body,
    fontFamily: "Figtree_500Medium",
    color: colors.inkFaint,
  },
  openAreaButton: {
    paddingVertical: spacing.sm + 1,
    paddingHorizontal: spacing.lg,
  },
  openAreaLabel: {
    fontFamily: "Figtree_700Bold",
    fontSize: 12.5,
    color: colors.white,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.xxl,
  },
  stat: { gap: 2 },
  statUnit: { fontSize: 15 },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
});
