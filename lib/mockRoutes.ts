import type { LngLat } from "@/lib/types";

// Sample routes near Amsterdam Centrum, used when Supabase has no data yet
// (e.g. local dev before the DB is seeded).
export const MOCK_ROUTES: { id: string; route_points: LngLat[] }[] = [
  {
    id: "mock-1",
    route_points: [
      [4.8952, 52.3702],
      [4.8967, 52.3711],
      [4.8981, 52.372],
      [4.8998, 52.3729],
    ],
  },
  {
    id: "mock-2",
    route_points: [
      [4.891, 52.3676],
      [4.8925, 52.3665],
      [4.894, 52.3655],
      [4.8958, 52.3645],
    ],
  },
  {
    id: "mock-3",
    route_points: [
      [4.9012, 52.3745],
      [4.9033, 52.3752],
      [4.9051, 52.3761],
    ],
  },
];
