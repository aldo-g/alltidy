"use client";

import { useEffect, useState } from "react";
import { totalRouteDistance } from "@/lib/geo/distance";
import type { LngLat } from "@/lib/types";

interface ActivityStatsProps {
  points: LngLat[];
  startedAt: string | null;
  isRecording: boolean;
}

export default function ActivityStats({ points, startedAt, isRecording }: ActivityStatsProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const distanceMeters = totalRouteDistance(points);
  const durationSeconds = startedAt
    ? Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000))
    : 0;

  return (
    <div className="glass-panel flex gap-8 rounded-2xl px-6 py-4">
      <Stat label="Duration" value={formatDuration(durationSeconds)} live={isRecording} />
      <Stat label="Distance" value={formatDistance(distanceMeters)} />
    </div>
  );
}

function Stat({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--danger)]" />}
        {label}
      </span>
      <span className="font-display text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </span>
    </div>
  );
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}
