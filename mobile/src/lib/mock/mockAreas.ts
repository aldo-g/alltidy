export type NeedsAttentionStreet = {
  id: string;
  name: string;
  km: number;
  lastCleanedDaysAgo: number;
};

export type Area = {
  id: string;
  name: string;
  subtitle: string;
  center: { latitude: number; longitude: number };
  personalKm: number;
  neighbourhoodKm: number;
  cleanedThisWeekPercent: number;
  cleanedThisMonthPercent: number;
  overduePercent: number;
  needsAttention: NeedsAttentionStreet[];
};

export const MOCK_AREAS: Record<string, Area> = {
  "centrum-west": {
    id: "centrum-west",
    name: "Centrum-West",
    subtitle: "Jordaan, Haarlemmerbuurt, Westelijke Eilanden",
    center: { latitude: 52.3762, longitude: 4.883 },
    personalKm: 4.2,
    neighbourhoodKm: 27.4,
    cleanedThisWeekPercent: 34,
    cleanedThisMonthPercent: 28,
    overduePercent: 38,
    needsAttention: [
      { id: "1", name: "Lijnbaansgracht", km: 1.1, lastCleanedDaysAgo: 31 },
      { id: "2", name: "Haarlemmerdijk", km: 0.7, lastCleanedDaysAgo: 22 },
      { id: "3", name: "Elandsgracht", km: 0.9, lastCleanedDaysAgo: 5 },
    ],
  },
};

export const DEFAULT_AREA_ID = "centrum-west";
