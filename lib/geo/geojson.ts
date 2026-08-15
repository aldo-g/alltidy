import type { Feature, FeatureCollection, LineString } from "geojson";
import type { Activity, LngLat } from "@/lib/types";

export function routeToFeature(
  points: LngLat[],
  properties: Record<string, unknown> = {}
): Feature<LineString> {
  return {
    type: "Feature",
    geometry: { type: "LineString", coordinates: points },
    properties,
  };
}

export function routesToFeatureCollection(
  activities: Pick<Activity, "id" | "route_points">[]
): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: activities.map((a) => routeToFeature(a.route_points, { id: a.id })),
  };
}
