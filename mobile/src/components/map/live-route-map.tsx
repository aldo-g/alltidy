import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { colors } from "@/lib/theme/tokens";
import type { LngLat } from "@/lib/types";

type Props = {
  points: LngLat[];
};

// Amsterdam center — used only as the initial camera before the first GPS
// point arrives; animateCamera takes over as soon as points land.
const FALLBACK_REGION = {
  latitude: 52.3676,
  longitude: 4.9041,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export function LiveRouteMap({ points }: Props) {
  const mapRef = useRef<MapView>(null);

  const coordinates = points.map(([longitude, latitude]) => ({ latitude, longitude }));

  useEffect(() => {
    if (coordinates.length === 0) return;
    const last = coordinates[coordinates.length - 1];
    mapRef.current?.animateCamera({ center: last, zoom: 16 }, { duration: 400 });
  }, [coordinates.length]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={
        coordinates[0]
          ? { ...coordinates[0], latitudeDelta: 0.006, longitudeDelta: 0.006 }
          : FALLBACK_REGION
      }
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      showsCompass={false}
    >
      {coordinates.length >= 2 && (
        <Polyline coordinates={coordinates} strokeColor={colors.accent} strokeWidth={5} lineCap="round" />
      )}
    </MapView>
  );
}
