import type { LngLat } from "@/lib/types";

const MAPBOX_MATCHING_URL = "https://api.mapbox.com/matching/v5/mapbox/walking";
// Mapbox's Map Matching API accepts at most 100 coordinates per request.
const MAX_COORDINATES_PER_REQUEST = 100;

interface MapMatchingResponse {
  code: string;
  matchings?: { geometry: { coordinates: LngLat[] } }[];
}

/**
 * Snaps a sequence of raw GPS points onto the real road/path network via
 * Mapbox's Map Matching API, so recorded routes visually follow streets
 * instead of cutting straight lines through blocks. Falls back to the
 * original points on any failure (unmatched route, API error, network
 * issue) — matching is a visual refinement, not something recording
 * should ever be blocked on.
 */
export async function snapToRoads(points: LngLat[]): Promise<LngLat[]> {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  if (!token || points.length < 2) return points;

  try {
    // Chunks overlap by one point so consecutive matched segments share an
    // endpoint instead of leaving a visible gap/jump at the seam.
    const chunks = chunkPoints(points, MAX_COORDINATES_PER_REQUEST);
    const snappedChunks = await Promise.all(chunks.map((chunk) => matchChunk(chunk, token)));

    if (snappedChunks.some((chunk) => chunk === null)) return points;

    const snapped: LngLat[] = [];
    for (const chunk of snappedChunks as LngLat[][]) {
      if (snapped.length > 0) chunk.shift();
      snapped.push(...chunk);
    }
    return snapped;
  } catch {
    return points;
  }
}

async function matchChunk(points: LngLat[], token: string): Promise<LngLat[] | null> {
  if (points.length < 2) return points;

  const coordinates = points.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `${MAPBOX_MATCHING_URL}/${coordinates}?geometries=geojson&access_token=${token}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as MapMatchingResponse;
  if (data.code !== "Ok" || !data.matchings?.length) return null;

  return data.matchings[0].geometry.coordinates;
}

function chunkPoints(points: LngLat[], size: number): LngLat[][] {
  if (points.length <= size) return [points];

  const chunks: LngLat[][] = [];
  const step = size - 1; // overlap by one point at each boundary
  for (let i = 0; i < points.length; i += step) {
    const chunk = points.slice(i, i + size);
    chunks.push(chunk);
    if (i + size >= points.length) break;
  }
  return chunks;
}
