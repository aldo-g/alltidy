import { forwardRef, useMemo } from "react";
import { StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT, type Region } from "react-native-maps";
import { routesToFreshnessRoutes } from "@/lib/geo/geojson";
import { mixFreshnessColor } from "@/lib/theme/tokens";
import type { Activity } from "@/lib/types";

const AMSTERDAM_REGION: Region = {
  latitude: 52.3688,
  longitude: 4.889,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

type Props = {
  activities: Pick<Activity, "route_points" | "created_at">[];
  initialRegion?: Region;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  children?: React.ReactNode;
};

export const FreshnessMap = forwardRef<MapView, Props>(function FreshnessMap(
  { activities, initialRegion = AMSTERDAM_REGION, scrollEnabled = true, zoomEnabled = true, children },
  ref
) {
  const routes = useMemo(() => routesToFreshnessRoutes(activities), [activities]);

  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      pitchEnabled={false}
      rotateEnabled={false}
      showsCompass={false}
      showsPointsOfInterests={false}
    >
      {routes.features.map((feature) => {
        const coordinates = (feature.geometry.coordinates as [number, number][]).map(
          ([lng, lat]) => ({ latitude: lat, longitude: lng })
        );
        const daysAgo = (feature.properties?.daysAgo as number) ?? 0;
        return (
          <Polyline
            key={feature.id}
            coordinates={coordinates}
            strokeColor={mixFreshnessColor(daysAgo)}
            strokeWidth={3}
            lineCap="round"
          />
        );
      })}
      {children}
    </MapView>
  );
});
