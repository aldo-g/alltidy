import type { LngLat } from "@/lib/types";
import { routesToFreshnessSegments } from "./geojson";
import { MOCK_ROUTES } from "@/lib/mock/mockRoutes";

const FRESH_THRESHOLD_DAYS = 1;

/**
 * Rough count of "new" streets a route touches, for the recording screen's
 * live "N new streets on the map" badge — a street counts as new if the
 * point lands in a freshness grid cell that isn't already fresh from an
 * existing mock cleanup. Approximates cell membership by sampling every
 * few points rather than re-running the full grid algorithm on every tick.
 */
export function countNewStreets(points: LngLat[]): number {
  if (points.length < 2) return 0;

  const existing = routesToFreshnessSegments(MOCK_ROUTES);
  const freshKeys = new Set<string>();
  for (const feature of existing.features) {
    const daysAgo = (feature.properties?.daysAgo as number) ?? Infinity;
    if (daysAgo <= FRESH_THRESHOLD_DAYS) {
      freshKeys.add(roundedKey(feature.geometry.coordinates[0] as LngLat));
    }
  }

  const touched = new Set<string>();
  for (let i = 0; i < points.length; i += 3) {
    const key = roundedKey(points[i]);
    if (!freshKeys.has(key)) touched.add(key);
  }

  return touched.size;
}

function roundedKey([lng, lat]: LngLat): string {
  return `${lng.toFixed(4)}:${lat.toFixed(4)}`;
}
