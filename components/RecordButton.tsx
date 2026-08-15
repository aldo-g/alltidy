"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGeolocationTracker } from "@/lib/hooks/useGeolocationTracker";
import { totalRouteDistance } from "@/lib/geo/distance";
import { getDeviceId } from "@/lib/deviceId";
import LiveTrackMap from "@/components/LiveTrackMap";
import ActivityStats from "@/components/ActivityStats";

export default function RecordButton() {
  const router = useRouter();
  const { status, points, startedAt, errorMessage, start, stop, reset } =
    useGeolocationTracker();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isRecording = status === "recording";

  async function handleSave() {
    if (!startedAt || points.length < 2) return;
    setSaving(true);
    setSaveError(null);

    const endedAt = new Date().toISOString();
    const durationSeconds = Math.max(
      1,
      Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)
    );

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          started_at: startedAt,
          ended_at: endedAt,
          duration_seconds: durationSeconds,
          route_points: points,
          distance_meters: totalRouteDistance(points),
          device_id: getDeviceId(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to save your cleanup.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save your cleanup.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "unsupported") {
    return <StatusMessage>{errorMessage}</StatusMessage>;
  }

  if (status === "denied") {
    return <StatusMessage>{errorMessage}</StatusMessage>;
  }

  if (status === "idle" || status === "requesting-permission") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <button
          onClick={start}
          disabled={status === "requesting-permission"}
          className="rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {status === "requesting-permission" ? "Requesting location…" : "Start Cleanup"}
        </button>
        {errorMessage && <StatusMessage>{errorMessage}</StatusMessage>}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex-1">
        <LiveTrackMap points={points} />
      </div>
      <div className="absolute left-1/2 top-4 -translate-x-1/2">
        <ActivityStats points={points} startedAt={startedAt} isRecording={isRecording} />
      </div>
      <div className="flex items-center justify-center gap-4 border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        {isRecording ? (
          <button
            onClick={stop}
            className="rounded-full bg-red-600 px-8 py-3 text-lg font-semibold text-white hover:bg-red-700"
          >
            Stop
          </button>
        ) : (
          <>
            <button
              onClick={reset}
              disabled={saving}
              className="rounded-full border border-zinc-300 px-6 py-3 font-medium hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving || points.length < 2}
              className="rounded-full bg-green-600 px-8 py-3 text-lg font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Cleanup"}
            </button>
          </>
        )}
      </div>
      {saveError && (
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <StatusMessage>{saveError}</StatusMessage>
        </div>
      )}
    </div>
  );
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-sm rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
      {children}
    </p>
  );
}
