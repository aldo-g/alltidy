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

const SAMPLE_SPACING_M = 8;
// Cell size for the overlap grid — coarser than the sample spacing so
// points from the same street reliably land in the same cell even with
// GPS/matching jitter, but fine enough to distinguish separate streets.
const GRID_CELL_SIZE_M = 12;
const METERS_PER_DEGREE_LAT = 111_320;

/**
 * Counts how many distinct activities actually cover each patch of street,
 * and emits one point per (cell, activity) pair carrying that cell's total
 * count. Mapbox's `heatmap` layer normalizes density relative to whatever
 * is densest on screen, so a single lightly-cleaned route ends up looking
 * just as "maxed out" as a heavily-cleaned one — there's no true zero.
 * Emitting an explicit count lets the map color by an absolute scale
 * instead: a street cleaned once is reliably dimmer than one cleaned five
 * times, regardless of what else is on screen.
 */
export function routesToOverlapPoints(
  activities: Pick<Activity, "id" | "route_points">[]
): FeatureCollection<Point> {
  const cellActivityIds = new Map<string, Set<string>>();
  const cellCoordinate = new Map<string, LngLat>();

  for (const activity of activities) {
    const cellsTouched = new Set<string>();

    for (const point of densifyLine(activity.route_points, SAMPLE_SPACING_M)) {
      const key = cellKey(point);
      cellsTouched.add(key);
      if (!cellCoordinate.has(key)) cellCoordinate.set(key, point);
    }

    for (const key of cellsTouched) {
      const ids = cellActivityIds.get(key) ?? new Set<string>();
      ids.add(activity.id);
      cellActivityIds.set(key, ids);
    }
  }

  const features: Feature<Point>[] = [];
  for (const [key, ids] of cellActivityIds) {
    const coordinate = cellCoordinate.get(key)!;
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: coordinate },
      properties: { count: ids.size },
    });
  }

  return { type: "FeatureCollection", features };
}

function cellKey([lng, lat]: LngLat): string {
  const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180);
  const col = Math.round((lng * metersPerDegreeLng) / GRID_CELL_SIZE_M);
  const row = Math.round((lat * METERS_PER_DEGREE_LAT) / GRID_CELL_SIZE_M);
  return `${col}:${row}`;
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
