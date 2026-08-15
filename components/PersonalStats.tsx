interface PersonalStatsProps {
  personalMeters: number;
  communityMeters: number;
}

export default function PersonalStats({ personalMeters, communityMeters }: PersonalStatsProps) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10">
      <div className="pointer-events-auto flex gap-5 rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/85 px-5 py-3 shadow-lg shadow-black/5 backdrop-blur-md">
        <Stat label="You've cleaned" value={formatDistance(personalMeters)} />
        <div className="w-px self-stretch bg-[var(--border)]/60" />
        <Stat label="Community total" value={formatDistance(communityMeters)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums tracking-tight">{value}</span>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
