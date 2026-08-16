import type { LngLat } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY_MS).toISOString();

// Sample routes across several Amsterdam neighborhoods, used when Supabase
// has no data yet (e.g. local dev before the DB is seeded). Generated via
// the Mapbox Directions API so they follow real streets, matching the
// road-snapped shape that real recorded activities get at save time.
//
// created_at is staggered to exercise the freshness fade end to end:
// mock-depijp-1 (0 days) is vivid green; the De Pijp routes it overlaps
// with are all older, showing "most recent cleanup wins" — the shared
// stretch should read as freshly green, not faded, because of today's
// pass. Centrum and Jordaan sit mid-fade, and Oost/West/Noord are past
// the 7-day window, fully faded back to the base color.
export const MOCK_ROUTES: { id: string; route_points: LngLat[]; created_at: string }[] = [
  // De Pijp — cleaned again today, overlapping older passes underneath
  {
    id: "mock-depijp-1",
    created_at: daysAgo(0),
    route_points: [
      [4.892607, 52.355385],
      [4.895995, 52.356115],
      [4.898809, 52.35694],
      [4.898459, 52.357548],
      [4.899142, 52.357692],
      [4.899017, 52.357878],
      [4.899151, 52.358002],
      [4.898639, 52.359313],
      [4.89837, 52.359379],
      [4.89844, 52.359549],
      [4.897596, 52.35942],
      [4.89735, 52.359976],
    ],
  },
  {
    id: "mock-depijp-2",
    created_at: daysAgo(9),
    route_points: [
      [4.892015, 52.356101],
      [4.892546, 52.356071],
      [4.892547, 52.355863],
      [4.89548, 52.356473],
      [4.898455, 52.357344],
      [4.898498, 52.357386],
      [4.898459, 52.357548],
      [4.899083, 52.357678],
      [4.899142, 52.357692],
      [4.899017, 52.357878],
      [4.899151, 52.358002],
      [4.899115, 52.358152],
      [4.898639, 52.359313],
      [4.898416, 52.359326],
      [4.89837, 52.359379],
      [4.89844, 52.359549],
      [4.898007, 52.359483],
    ],
  },
  {
    id: "mock-depijp-3",
    created_at: daysAgo(20),
    route_points: [
      [4.893021, 52.356652],
      [4.895046, 52.356547],
      [4.895192, 52.356414],
      [4.898455, 52.357344],
      [4.898498, 52.357386],
      [4.898459, 52.357548],
      [4.899142, 52.357692],
      [4.899017, 52.357878],
      [4.899151, 52.358002],
      [4.899081, 52.358272],
      [4.898157, 52.358134],
      [4.897317, 52.358158],
      [4.897317, 52.359],
    ],
  },

  // Centrum / Red Light District — cleaned a couple of days ago, mid-fade
  {
    id: "mock-centrum-1",
    created_at: daysAgo(2),
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
    id: "mock-centrum-2",
    created_at: daysAgo(3),
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

  // Jordaan — cleaned 5 days ago, further into the fade
  {
    id: "mock-jordaan-1",
    created_at: daysAgo(5),
    route_points: [
      [4.879403, 52.374495],
      [4.879207, 52.37445],
      [4.878686, 52.375297],
      [4.877663, 52.375071],
      [4.880523, 52.379586],
      [4.883716, 52.380013],
    ],
  },
  {
    id: "mock-jordaan-2",
    created_at: daysAgo(6),
    route_points: [
      [4.879943, 52.375094],
      [4.88272, 52.375711],
      [4.881305, 52.37809],
      [4.883247, 52.378443],
      [4.882998, 52.378882],
      [4.884523, 52.379151],
    ],
  },

  // Oost, West, Noord — cleaned well over a week ago, fully faded to the
  // base "needs cleaning again" color
  {
    id: "mock-oost-1",
    created_at: daysAgo(14),
    route_points: [
      [4.924544, 52.360519],
      [4.923675, 52.361046],
      [4.923484, 52.361365],
      [4.92372, 52.361555],
      [4.923966, 52.361629],
      [4.923854, 52.361946],
      [4.930525, 52.363318],
      [4.930416, 52.364112],
      [4.929995, 52.364445],
      [4.930462, 52.364547],
      [4.930543, 52.365079],
    ],
  },
  {
    id: "mock-west-1",
    created_at: daysAgo(18),
    route_points: [
      [4.872323, 52.386876],
      [4.872358, 52.386909],
      [4.872553, 52.386893],
      [4.873169, 52.386948],
      [4.87372, 52.387139],
      [4.874856, 52.387279],
      [4.875494, 52.387299],
      [4.875633, 52.387267],
      [4.876908, 52.387319],
      [4.877649, 52.387242],
      [4.878226, 52.387128],
      [4.878776, 52.387715],
      [4.880378, 52.388211],
      [4.878963, 52.389989],
    ],
  },
  {
    id: "mock-noord-1",
    created_at: daysAgo(25),
    route_points: [
      [4.900936, 52.385108],
      [4.903273, 52.385613],
      [4.90315, 52.385833],
      [4.906051, 52.386343],
      [4.904895, 52.388695],
      [4.907487, 52.389178],
      [4.90782, 52.38963],
      [4.90805, 52.389639],
      [4.908303, 52.390036],
      [4.90807, 52.390098],
    ],
  },
];
