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
    <div className="flex gap-8 rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/85 px-6 py-4 shadow-lg shadow-black/5 backdrop-blur-md">
      <Stat label="Duration" value={formatDuration(durationSeconds)} />
      <Stat label="Distance" value={formatDistance(distanceMeters)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums tracking-tight">
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
