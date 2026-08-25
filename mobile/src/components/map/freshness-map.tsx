import { forwardRef, useMemo, useRef } from "react";
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

// Greater Amsterdam, a bit wider than the seeded route data
// (lat 52.286–52.422, lng 4.775–5.071) so panning to the city's edges
// doesn't feel clipped. Keeps users from scrolling out to the rest of
// the Netherlands or the world — this is a single-city prototype.
const BOUNDS = {
  minLatitude: 52.25,
  maxLatitude: 52.46,
  minLongitude: 4.72,
  maxLongitude: 5.12,
};
const MIN_ZOOM_LEVEL = 10;

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
  const innerRef = useRef<MapView>(null);

  // react-native-maps has no native "max bounds" prop (unlike Mapbox GL),
  // so panning past the city is clamped by snapping the region back once
  // it drifts outside BOUNDS. minZoomLevel handles the zoom-out case.
  const handleRegionChangeComplete = (region: Region) => {
    const clamped = {
      latitude: clamp(region.latitude, BOUNDS.minLatitude, BOUNDS.maxLatitude),
      longitude: clamp(region.longitude, BOUNDS.minLongitude, BOUNDS.maxLongitude),
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    if (clamped.latitude !== region.latitude || clamped.longitude !== region.longitude) {
      innerRef.current?.animateToRegion(clamped, 250);
    }
  };

  return (
    <MapView
      ref={(instance) => {
        innerRef.current = instance;
        if (typeof ref === "function") ref(instance);
        else if (ref) ref.current = instance;
      }}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={initialRegion}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      minZoomLevel={MIN_ZOOM_LEVEL}
      onRegionChangeComplete={handleRegionChangeComplete}
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
