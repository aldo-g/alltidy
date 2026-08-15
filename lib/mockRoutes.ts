import type { LngLat } from "@/lib/types";

// Sample routes near Amsterdam Centrum, used when Supabase has no data yet
// (e.g. local dev before the DB is seeded). Generated via the Mapbox
// Directions API so they follow real streets, matching the road-snapped
// shape that real recorded activities get at save time. mock-1, mock-1b,
// and mock-1c deliberately share street segments so the community map's
// overlap-intensity effect (more cleanups = brighter line) is visible
// without needing real data.
export const MOCK_ROUTES: { id: string; route_points: LngLat[] }[] = [
  {
    id: "mock-1",
    route_points: [
      [4.895459, 52.370118],
      [4.896783, 52.371533],
      [4.896982, 52.371463],
      [4.898701, 52.37306],
      [4.899111, 52.372922],
      [4.899655, 52.372813],
      [4.8997, 52.372916],
    ],
  },
  {
    id: "mock-1b",
    route_points: [
      [4.893007, 52.368891],
      [4.894594, 52.368897],
      [4.894609, 52.369091],
      [4.894723, 52.369133],
      [4.894907, 52.369132],
      [4.894961, 52.369239],
      [4.896982, 52.371463],
      [4.898701, 52.37306],
      [4.899111, 52.372922],
      [4.899655, 52.372813],
      [4.8997, 52.372916],
    ],
  },
  {
    id: "mock-1c",
    route_points: [
      [4.895459, 52.370118],
      [4.896783, 52.371533],
      [4.900072, 52.374533],
      [4.901915, 52.373923],
    ],
  },
  {
    id: "mock-2",
    route_points: [
      [4.891139, 52.36765],
      [4.891489, 52.367314],
      [4.891244, 52.367179],
      [4.891635, 52.367123],
      [4.892609, 52.367102],
      [4.892915, 52.367211],
      [4.893124, 52.367204],
      [4.893384, 52.367438],
      [4.893447, 52.367149],
      [4.893668, 52.367141],
      [4.893186, 52.366625],
      [4.893069, 52.366166],
      [4.893111, 52.366087],
      [4.892774, 52.365028],
      [4.895709, 52.364621],
      [4.895717, 52.364498],
    ],
  },
  {
    id: "mock-3",
    route_points: [
      [4.901121, 52.374516],
      [4.902267, 52.376608],
      [4.902789, 52.376145],
      [4.903169, 52.376212],
      [4.90327, 52.376263],
      [4.903846, 52.376859],
      [4.905132, 52.376404],
      [4.906092, 52.376121],
      [4.906168, 52.375943],
      [4.905223, 52.376225],
    ],
  },
];
