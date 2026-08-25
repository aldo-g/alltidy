export const colors = {
  background: "#f5ead8",
  surface: "#f9f4ed",
  surfaceGlass: "rgba(249,244,237,0.9)",
  card: "#ebddc5",

  ink: "#201e1d",
  inkMuted: "#645c50",
  inkFaint: "#82796a",
  border: "rgba(32,30,29,0.08)",

  accent: "#c67139",
  accentHover: "#b2622d",
  accentActive: "#8c491a",
  accentSoft: "#ffe1d0",

  olive: "#3d472b",
  oliveLight: "#56633f",
  oliveSoft: "#e1eecc",
  oliveSofter: "#ccdbb2",
  oliveText: "#f0fae1",

  overdue: "#f6a06b",

  white: "#ffffff",
} as const;

// Route freshness gradient: exact RGB triples from the map-drawing script
// in the mockup — olive-green right after a cleanup, fading to terracotta
// as it ages toward `fadeDays`.
export const freshness = {
  fresh: [0x56, 0x63, 0x3f] as [number, number, number],
  faded: [0xd6, 0x7f, 0x48] as [number, number, number],
  fadeDays: 7,
};

export function mixFreshnessColor(daysAgo: number): string {
  const t = Math.min(1, Math.max(0, daysAgo / freshness.fadeDays));
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const [r, g, b] = freshness.fresh.map(
    (start, i) => start + (freshness.faded[i] - start) * t
  );
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const radii = {
  pill: 999,
  card: 28,
  cardSm: 20,
  sm: 8,
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const shadow = {
  card: {
    shadowColor: "#2e2b25",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  floating: {
    shadowColor: "#2e2b25",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;
