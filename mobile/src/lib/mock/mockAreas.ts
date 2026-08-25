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
  "de-pijp": {
    id: "de-pijp",
    name: "De Pijp",
    subtitle: "Sarphatipark, Albert Cuyp, Diamantbuurt",
    center: { latitude: 52.3533, longitude: 4.8945 },
    personalKm: 1.8,
    neighbourhoodKm: 19.6,
    cleanedThisWeekPercent: 41,
    cleanedThisMonthPercent: 24,
    overduePercent: 35,
    needsAttention: [
      { id: "1", name: "Ferdinand Bolstraat", km: 1.3, lastCleanedDaysAgo: 26 },
      { id: "2", name: "Van Woustraat", km: 1.6, lastCleanedDaysAgo: 18 },
      { id: "3", name: "Gerard Doustraat", km: 0.8, lastCleanedDaysAgo: 9 },
    ],
  },
  "oud-west": {
    id: "oud-west",
    name: "Oud-West",
    subtitle: "Kinkerbuurt, Vondelpark, Overtoomse Sluis",
    center: { latitude: 52.3654, longitude: 4.8698 },
    personalKm: 0.9,
    neighbourhoodKm: 15.2,
    cleanedThisWeekPercent: 29,
    cleanedThisMonthPercent: 21,
    overduePercent: 44,
    needsAttention: [
      { id: "1", name: "Kinkerstraat", km: 1.4, lastCleanedDaysAgo: 33 },
      { id: "2", name: "Overtoom", km: 1.9, lastCleanedDaysAgo: 27 },
      { id: "3", name: "Bilderdijkstraat", km: 1.0, lastCleanedDaysAgo: 12 },
    ],
  },
  noord: {
    id: "noord",
    name: "Noord",
    subtitle: "NDSM, Buiksloterham, Overhoeks",
    center: { latitude: 52.3975, longitude: 4.9145 },
    personalKm: 3.4,
    neighbourhoodKm: 22.1,
    cleanedThisWeekPercent: 22,
    cleanedThisMonthPercent: 17,
    overduePercent: 52,
    needsAttention: [
      { id: "1", name: "Meteorenweg", km: 1.7, lastCleanedDaysAgo: 41 },
      { id: "2", name: "Distelweg", km: 1.2, lastCleanedDaysAgo: 29 },
      { id: "3", name: "Van der Pekstraat", km: 1.5, lastCleanedDaysAgo: 14 },
    ],
  },
};

export const DEFAULT_AREA_ID = "centrum-west";
