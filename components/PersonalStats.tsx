interface PersonalStatsProps {
  personalMeters: number;
  communityMeters: number;
}

export default function PersonalStats({ personalMeters, communityMeters }: PersonalStatsProps) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10">
      <div className="glass-panel pointer-events-auto flex gap-5 rounded-2xl px-5 py-3.5">
        <Stat label="You've cleaned" value={formatDistance(personalMeters)} />
        <div className="w-px self-stretch bg-[var(--border)]" />
        <Stat label="Community total" value={formatDistance(communityMeters)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <span className="font-display text-xl font-semibold tabular-nums tracking-tight">
        {value}
      </span>
    </div>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
