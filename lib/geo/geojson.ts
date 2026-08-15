import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { Activity, LngLat } from "@/lib/types";
import { haversineDistance } from "@/lib/geo/distance";

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

const HEATMAP_SAMPLE_SPACING_M = 8;

/**
 * Densifies every route into evenly-spaced points along its line, for use
 * as input to Mapbox's `heatmap` layer type (which buckets point density,
 * not line overlap). Streets cleaned by multiple activities accumulate
 * more points in the same place, so the heatmap's color ramp reads that
 * as higher intensity without any per-segment tracking in the backend.
 */
export function routesToHeatmapPoints(
  activities: Pick<Activity, "route_points">[]
): FeatureCollection<Point> {
  const features: Feature<Point>[] = [];

  for (const activity of activities) {
    for (const point of densifyLine(activity.route_points, HEATMAP_SAMPLE_SPACING_M)) {
      features.push({ type: "Feature", geometry: { type: "Point", coordinates: point }, properties: {} });
    }
  }

  return { type: "FeatureCollection", features };
}

function densifyLine(points: LngLat[], spacingMeters: number): LngLat[] {
  if (points.length === 0) return [];
  if (points.length === 1) return points;

  const result: LngLat[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const [prevLng, prevLat] = points[i - 1];
    const [lng, lat] = points[i];
    const segmentLength = haversineDistance(points[i - 1], points[i]);
    const steps = Math.floor(segmentLength / spacingMeters);

    for (let step = 1; step <= steps; step++) {
      const t = (step * spacingMeters) / segmentLength;
      result.push([prevLng + (lng - prevLng) * t, prevLat + (lat - prevLat) * t]);
    }

    result.push([lng, lat]);
  }

  return result;
}
