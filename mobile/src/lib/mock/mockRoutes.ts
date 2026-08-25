import type { LngLat } from "@/lib/types";
import seedRoutes from "@/lib/mock/mockSeedRoutes.json";
import waterFlaggedIds from "@/lib/mock/mockWaterFlaggedIds.json";
import { haversineDistance } from "@/lib/geo/distance";

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();

// ~900 real, road-snapped walking routes spread across greater Amsterdam,
// fetched once from the Mapbox Directions API (see
// scratchpad/gen-seed-routes.mjs). Kept as a static JSON asset rather than
// a literal here so the module stays cheap to parse — the expansion into
// thousands of mock activities below happens procedurally at import time.
//
// Scaling this up favors more distinct real streets over more repeat
// passes on the same street: repeat passes on identical geometry collapse
// into the same freshness grid cells (see routesToFreshnessSegments) and
// don't add visual coverage, they just inflate the point count the map has
// to render.
// A handful of seed routes touch a canal, the IJ, or another water body at
// some point along their real Directions API geometry — Amsterdam is laced
// with waterways, so a walking route near a quay or bridge can legitimately
// sample a point right at the water's edge. Verified against Mapbox's real
// water/waterway tile layer (see scratchpad/check-water.mjs, not a distance
// heuristic) and excluded so nothing draws across open water on the map.
const WATER_FLAGGED_IDS = new Set(waterFlaggedIds as string[]);

const SEED_ROUTES = (seedRoutes as { id: string; points: LngLat[] }[]).filter(
  (seed) => !WATER_FLAGGED_IDS.has(seed.id)
);

// How many separate "cleanup pass" segments to carve out of each seed
// street. Each segment is a contiguous slice of the real route (so it still
// hugs the road) with its own random timestamp, simulating that stretch
// having been cleaned a few times over the past month by different people.
const PASSES_PER_SEED_MIN = 1;
const PASSES_PER_SEED_MAX = 3;

function mulberry32(seed: number) {
  let t = seed;
  return function random() {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic across renders/reloads so the map doesn't visibly reshuffle
// on every request while iterating on styling.
const rng = mulberry32(20260816);

// Cleanup passes now run 1-3 per seed (favoring more distinct real streets
// over repeat coverage of the same one, see SEED_ROUTES above), so a slice
// is usually most or all of the street rather than a short fragment — pick
// a distance-based sub-walk long enough to look like a real pass instead of
// a token clip, but still occasionally shorter for variety.
const MIN_SLICE_METERS = 150;

function randomSlice(points: LngLat[], random: () => number): LngLat[] {
  if (points.length < 3) return points;

  const totalMeters = haversineDistance(points[0], points[points.length - 1]);
  if (totalMeters <= MIN_SLICE_METERS) return points;

  const targetMeters = MIN_SLICE_METERS + random() * (totalMeters - MIN_SLICE_METERS);
  const startFraction = random() * (1 - targetMeters / totalMeters);

  const startIndex = Math.floor(startFraction * points.length);
  let endIndex = startIndex + 2;
  let coveredMeters = 0;
  while (endIndex < points.length && coveredMeters < targetMeters) {
    coveredMeters += haversineDistance(points[endIndex - 1], points[endIndex]);
    endIndex++;
  }

  return points.slice(startIndex, Math.min(endIndex, points.length));
}

// The Directions API omits intermediate vertices on long straight stretches,
// which is fine for the real road shape but means two consecutive points can
// be hundreds of meters apart — enough for the straight chord drawn between
// them to visibly cut across a block if that stretch has any curve at all.
// Interpolating extra points along each chord keeps the drawn line hugging
// the original geometry instead of shortcutting it.
const MAX_CHORD_METERS = 40;

function densify(points: LngLat[]): LngLat[] {
  if (points.length < 2) return points;

  const result: LngLat[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [prevLng, prevLat] = points[i - 1];
    const [lng, lat] = points[i];
    const segmentLength = haversineDistance(points[i - 1], points[i]);
    const steps = Math.floor(segmentLength / MAX_CHORD_METERS);

    for (let step = 1; step <= steps; step++) {
      const t = (step * MAX_CHORD_METERS) / segmentLength;
      result.push([prevLng + (lng - prevLng) * t, prevLat + (lat - prevLat) * t]);
    }
    result.push([lng, lat]);
  }
  return result;
}

// Freshness buckets, weighted toward a mix so the map shows the full
// amber-to-green fade range at once rather than clustering at one end.
function randomDaysAgo(random: () => number): number {
  const bucket = random();
  if (bucket < 0.3) return Math.round(random() * 1); // fresh: today/yesterday
  if (bucket < 0.65) return 2 + Math.round(random() * 5); // mid-fade
  return 8 + Math.round(random() * 25); // faded baseline
}

function buildMockRoutes(): { id: string; route_points: LngLat[]; created_at: string }[] {
  const routes: { id: string; route_points: LngLat[]; created_at: string }[] = [];

  for (const seed of SEED_ROUTES) {
    const densePoints = densify(seed.points);
    const passCount =
      PASSES_PER_SEED_MIN + Math.floor(rng() * (PASSES_PER_SEED_MAX - PASSES_PER_SEED_MIN + 1));

    for (let pass = 0; pass < passCount; pass++) {
      const slice = randomSlice(densePoints, rng);
      if (slice.length < 2) continue;

      routes.push({
        id: `${seed.id}-pass-${pass + 1}`,
        created_at: daysAgo(randomDaysAgo(rng)),
        route_points: slice,
      });
    }
  }

  return routes;
}

// Used when Supabase has no data yet (e.g. local dev before the DB is
// seeded), so the map preview shows a busy, citywide cleanup history
// instead of an empty canvas.
export const MOCK_ROUTES = buildMockRoutes();
