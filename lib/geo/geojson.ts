import type { Feature, FeatureCollection, LineString } from "geojson";
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
// Cell size for the freshness grid — coarser than the sample spacing so
// points from the same street reliably land in the same cell even with
// GPS/matching jitter, but fine enough to distinguish separate streets.
const GRID_CELL_SIZE_M = 12;
const METERS_PER_DEGREE_LAT = 111_320;

/**
 * For each patch of street, finds the most recent cleanup that covered it
 * and emits a short line segment carrying "days since that cleanup" —
 * freshly-cleaned spots read as 0 (vivid green), fading back toward the
 * uncleaned baseline as the days climb. Older cleanups on the same spot
 * don't matter once a newer one exists: the map always shows how recently
 * a street was cleaned, not how many times it's been cleaned historically.
 *
 * Segments (not points) so the freshness color renders as a continuous
 * line at any zoom — sampled points left visible gaps between circle
 * markers once zoomed in far enough that the marker radius no longer
 * bridged the sample spacing.
 */
export function routesToFreshnessSegments(
  activities: Pick<Activity, "route_points" | "created_at">[],
  now: number = Date.now()
): FeatureCollection<LineString> {
  const cellMostRecentMs = new Map<string, number>();
  const cellSegment = new Map<string, [LngLat, LngLat]>();

  for (const activity of activities) {
    const activityMs = new Date(activity.created_at).getTime();
    const densified = densifyLine(activity.route_points, SAMPLE_SPACING_M);

    for (let i = 1; i < densified.length; i++) {
      const segment: [LngLat, LngLat] = [densified[i - 1], densified[i]];
      const key = cellKey(densified[i]);
      const existing = cellMostRecentMs.get(key);
      if (existing === undefined || activityMs > existing) {
        cellMostRecentMs.set(key, activityMs);
        cellSegment.set(key, segment);
      }
    }
  }

  const features: Feature<LineString>[] = [];
  for (const [key, mostRecentMs] of cellMostRecentMs) {
    const segment = cellSegment.get(key)!;
    const daysAgo = Math.max(0, (now - mostRecentMs) / (24 * 60 * 60 * 1000));
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: segment },
      properties: { daysAgo },
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
