import { useMemo, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { Button } from "@/components/ui/button";
import { StatGrid } from "@/components/stats/stat-grid";
import { StreetChip } from "@/components/stats/street-chip";
import { useRecordSession } from "@/lib/hooks/record-session-context";
import { addPostedActivity } from "@/lib/hooks/usePostedActivities";
import { countNewStreets } from "@/lib/geo/newStreets";
import { colors, spacing } from "@/lib/theme/tokens";
import { typography } from "@/lib/theme/typography";

const SAMPLE_NEW_STREET_NAMES = [
  "Tweede Egelantiersdwarsstraat",
  "Nieuwe Leliestraat",
  "Bloemgracht",
];

export default function RecordSummaryScreen() {
  const session = useRecordSession();
  const mapRef = useRef<MapView>(null);

  const coordinates = session.points.map(([longitude, latitude]) => ({ latitude, longitude }));
  const newStreets = useMemo(() => countNewStreets(session.points), [session.points]);

  const minutes = Math.floor(session.elapsedSeconds / 60);
  const seconds = session.elapsedSeconds % 60;
  const durationLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const distanceLabel =
    session.distanceMeters < 1000
      ? `${Math.round(session.distanceMeters)}m`
      : `${(session.distanceMeters / 1000).toFixed(2)}km`;

  const handleDiscard = () => {
    session.reset();
    router.replace("/(tabs)");
  };

  const handlePost = () => {
    addPostedActivity({
      id: `local-${Date.now()}`,
      route_points: session.points,
      created_at: session.startedAt ?? new Date().toISOString(),
      distance_meters: session.distanceMeters,
    });
    session.reset();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        <View style={styles.mapHeader}>
          {coordinates.length > 1 && (
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              provider={PROVIDER_DEFAULT}
              initialRegion={{
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              showsCompass={false}
              onMapReady={() => {
                mapRef.current?.fitToCoordinates(coordinates, {
                  edgePadding: { top: 46, bottom: 46, left: 46, right: 46 },
                });
              }}
            >
              <Polyline coordinates={coordinates} strokeColor={colors.accent} strokeWidth={5} lineCap="round" />
            </MapView>
          )}
          <SafeAreaView edges={["top"]} style={styles.completeBadgeWrap}>
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>Cleanup complete</Text>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <Text style={typography.h2}>Nice work.{"\n"}The street is greener.</Text>
          <Text style={styles.timestamp}>{new Date().toLocaleString()}</Text>

          <StatGrid
            tiles={[
              { key: "distance", value: distanceLabel, label: "Distance" },
              { key: "duration", value: durationLabel, label: "Duration" },
              { key: "streets", value: String(newStreets), label: "Streets refreshed", tone: "olive" },
              { key: "streak", value: "6", label: "Week streak", tone: "terracotta" },
            ]}
          />

          <View style={styles.card}>
            <Text style={typography.label}>First cleaned in 30 days</Text>
            <View style={styles.chipRow}>
              {SAMPLE_NEW_STREET_NAMES.slice(0, Math.max(1, newStreets)).map((name) => (
                <StreetChip key={name} label={name} />
              ))}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button variant="ghost" onPress={handleDiscard} style={{ flex: 0 }}>
              Discard
            </Button>
            <Button onPress={handlePost} style={{ flex: 1 }}>
              Post to the map
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mapHeader: { height: 300, backgroundColor: colors.card },
  completeBadgeWrap: { position: "absolute", left: 0, top: 0 },
  completeBadge: {
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.olive,
  },
  completeBadgeText: {
    fontFamily: "Figtree_700Bold",
    fontSize: 11.5,
    color: colors.oliveText,
  },
  body: {
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingBottom: 60,
    gap: spacing.lg,
  },
  timestamp: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 13.5,
    color: colors.inkFaint,
    marginTop: -spacing.sm,
  },
  card: {
    padding: spacing.xl,
    borderRadius: 28,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
});
