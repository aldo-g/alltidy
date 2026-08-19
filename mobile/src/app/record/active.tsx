import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LiveRouteMap } from "@/components/map/live-route-map";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useRecordSession } from "@/lib/hooks/record-session-context";
import { countNewStreets } from "@/lib/geo/newStreets";
import { colors, radii, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

export default function RecordActiveScreen() {
  const session = useRecordSession();

  useEffect(() => {
    if (session.status === "idle") session.start();
  }, [session]);

  const newStreets = useMemo(() => countNewStreets(session.points), [session.points]);

  const handleFinish = () => {
    session.stop();
    router.replace("/record/summary");
  };

  const minutes = Math.floor(session.elapsedSeconds / 60);
  const seconds = session.elapsedSeconds % 60;
  const durationLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const distanceLabel =
    session.distanceMeters < 1000
      ? `${Math.round(session.distanceMeters)}m`
      : `${(session.distanceMeters / 1000).toFixed(2)}km`;

  return (
    <View style={styles.container}>
      <LiveRouteMap points={session.points} />

      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        <GlassPanel radius={radii.card} style={styles.statsPanel}>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <View style={styles.statLabelRow}>
                <View style={styles.dot} />
                <Text style={typography.label}>Duration</Text>
              </View>
              <Text style={styles.statValue}>{durationLabel}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statCol}>
              <Text style={typography.label}>Distance</Text>
              <Text style={styles.statValue}>{distanceLabel}</Text>
            </View>
          </View>
        </GlassPanel>

        {newStreets > 0 && (
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{newStreets} new streets on the map</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Button onPress={handleFinish}>Finish cleanup</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  overlay: { ...StyleSheet.absoluteFill, justifyContent: "space-between" },
  statsPanel: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    padding: spacing.xl,
  },
  statCol: { flex: 1, gap: spacing.xxs },
  statLabelRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.accent },
  statValue: {
    fontFamily: "Caprasimo_400Regular",
    fontSize: 32,
    color: colors.ink,
  },
  divider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  badge: {
    position: "absolute",
    top: 176,
    left: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.olive,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.oliveSofter },
  badgeText: {
    fontFamily: "Figtree_700Bold",
    fontSize: 11.5,
    color: colors.oliveText,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
});
