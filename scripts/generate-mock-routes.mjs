// One-off generator for lib/mockRoutes.ts.
//
// Pulls real Amsterdam street geometry from OpenStreetMap's Overpass API,
// then snaps a "cleanup route" per street to the road network via the
// Mapbox Directions API (matching the road-snapped shape real recorded
// activities get at save time — see lib/geo/mapMatching.ts). Staggers
// created_at timestamps across the freshness fade window so local dev
// previews the full amber-to-moss gradient.
//
// Run: NEXT_PUBLIC_MAPBOX_TOKEN=pk... node scripts/generate-mock-routes.mjs

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error("NEXT_PUBLIC_MAPBOX_TOKEN is required (read from .env.local).");
  process.exit(1);
}

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
// Amsterdam ring-road bounding box (south, west, north, east).
const BBOX = "52.34,4.83,52.40,4.97";
const TARGET_STREETS = Number(process.env.MOCK_TARGET_STREETS) || 912;
const ROUTES_PER_STREET_MIN = 1;
const ROUTES_PER_STREET_MAX = 3;
const FADE_DAYS = 7;

const OVERPASS_CACHE = new URL("../.overpass-cache.json", import.meta.url);

function fetchStreets() {
  if (existsSync(OVERPASS_CACHE)) {
    console.log("  using cached Overpass response (.overpass-cache.json)");
    return JSON.parse(readFileSync(OVERPASS_CACHE, "utf8"));
  }

  const query = `[out:json][timeout:90];way["highway"~"^(primary|secondary|tertiary|residential|living_street|unclassified)$"]["name"](${BBOX});out geom;`;

  // Node's undici fetch gets a 406 from Overpass's Apache config for
  // reasons that don't reproduce with curl, so shell out instead. The
  // public instance is a shared free resource and occasionally times out
  // under load, so retry with backoff.
  let json;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const raw = execFileSync(
      "curl",
      ["-s", "-X", "POST", OVERPASS_URL, "--data-urlencode", `data=${query}`],
      { maxBuffer: 1024 * 1024 * 200 }
    ).toString();

    try {
      json = JSON.parse(raw);
      break;
    } catch {
      console.log(`  Overpass attempt ${attempt} failed (server busy), retrying...`);
      if (attempt === 4) throw new Error("Overpass request failed after 4 attempts");
      execFileSync("sleep", [String(attempt * 5)]);
    }
  }

  const elements = json.elements
    .filter((el) => el.geometry && el.geometry.length >= 2)
    .map((el) => ({
      id: el.id,
      name: el.tags?.name ?? `way-${el.id}`,
      coords: el.geometry.map((pt) => [pt.lon, pt.lat]),
    }));

  writeFileSync(OVERPASS_CACHE, JSON.stringify(elements));
  return elements;
}

function pickSubsegment(coords) {
  if (coords.length <= 2) return coords;
  // Occasionally clip to a sub-segment so not every route is a full street.
  if (Math.random() > 0.6) return coords;
  const start = Math.floor(Math.random() * (coords.length - 2));
  const end = start + 2 + Math.floor(Math.random() * (coords.length - start - 2));
  return coords.slice(start, end + 1);
}

async function snapToRoads(coords) {
  // Mapbox Directions supports up to 25 waypoints per request; thin long
  // streets down before snapping.
  const waypoints =
    coords.length <= 25
      ? coords
      : coords.filter((_, i) => i % Math.ceil(coords.length / 25) === 0);

  const coordStr = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordStr}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url);

    if (res.status === 429) {
      // Mapbox Directions free tier caps at 300 req/min; back off and retry.
      await sleep(attempt * 1000);
      continue;
    }

    if (!res.ok) {
      if (process.env.DEBUG_SNAP) console.error(`  snap failed: HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) {
      if (process.env.DEBUG_SNAP) console.error(`  snap failed: ${json.code} ${json.message ?? ""}`);
      return null;
    }
    return route.geometry.coordinates;
  }

  if (process.env.DEBUG_SNAP) console.error("  snap failed: exhausted 429 retries");
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomCreatedAt() {
  // Weighted across the fade window plus a long tail of fully-faded
  // history, so the map shows the full amber-to-moss gradient.
  const roll = Math.random();
  const daysAgo =
    roll < 0.15
      ? Math.random() * 1 // vivid moss, cleaned very recently
      : roll < 0.55
        ? Math.random() * FADE_DAYS // mid-fade
        : FADE_DAYS + Math.random() * 60; // fully faded baseline
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

async function main() {
  console.log("Fetching Amsterdam street geometry from Overpass...");
  const allStreets = fetchStreets();
  console.log(`Fetched ${allStreets.length} streets.`);

  const streets = allStreets
    .sort(() => Math.random() - 0.5)
    .slice(0, TARGET_STREETS);
  console.log(`Using ${streets.length} streets, snapping routes via Mapbox Directions...`);

  const routes = [];
  let processed = 0;

  // Mapbox Directions rate limit is generous but batch with a small
  // concurrency cap to stay well under it.
  const CONCURRENCY = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < streets.length) {
      const street = streets[cursor++];
      const routesForStreet =
        ROUTES_PER_STREET_MIN +
        Math.floor(Math.random() * (ROUTES_PER_STREET_MAX - ROUTES_PER_STREET_MIN + 1));

      for (let i = 0; i < routesForStreet; i++) {
        const segment = pickSubsegment(street.coords);
        const snapped = await snapToRoads(segment);
        if (snapped && snapped.length >= 2) {
          routes.push({
            id: `mock-${street.id}-${i}`,
            created_at: randomCreatedAt(),
            route_points: snapped,
          });
        }
      }

      processed++;
      if (processed % 50 === 0) {
        console.log(`  ${processed}/${streets.length} streets processed, ${routes.length} routes so far`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // created_at descending isn't required, but keep freshest first for
  // readability when skimming the generated file.
  routes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(`Generated ${routes.length} routes. Writing lib/mockRoutes.ts...`);

  const body = `import type { LngLat } from "@/lib/types";

// Dense mock dataset for local dev: routes across real Amsterdam streets,
// road-snapped via the Mapbox Directions API (mapbox/walking profile),
// matching the shape real recorded activities get at save time (see
// lib/geo/mapMatching.ts). Used when Supabase has no data yet.
//
// Generated by scripts/generate-mock-routes.mjs — created_at is randomized
// across the freshness fade window (see components/Map.tsx FADE_DAYS) so
// local dev previews the full amber-to-moss gradient: a vivid-moss recent
// slice, a mid-fade band, and a long amber-baseline tail.
export const MOCK_ROUTES: { id: string; route_points: LngLat[]; created_at: string }[] = ${JSON.stringify(routes, null, 2)};
`;

  writeFileSync(new URL("../lib/mockRoutes.ts", import.meta.url), body);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
