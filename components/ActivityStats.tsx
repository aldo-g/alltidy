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
    <div className="flex gap-6 rounded-lg bg-white/90 px-4 py-3 shadow dark:bg-black/90">
      <Stat label="Duration" value={formatDuration(durationSeconds)} />
      <Stat label="Distance" value={formatDistance(distanceMeters)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
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
