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

  if (status === "unsupported" || status === "denied") {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <StatusMessage>{errorMessage}</StatusMessage>
      </div>
    );
  }

  if (status === "idle" || status === "requesting-permission") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-[var(--surface-muted)] p-6">
        <button
          onClick={start}
          disabled={status === "requesting-permission"}
          className="flex h-40 w-40 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-semibold text-white shadow-xl shadow-emerald-900/25 transition-all hover:bg-[var(--accent-hover)] hover:scale-[1.03] disabled:scale-100 disabled:opacity-60"
        >
          {status === "requesting-permission" ? "Locating…" : "Start Cleanup"}
        </button>
        <p className="text-sm text-[var(--muted)]">
          {status === "requesting-permission"
            ? "Waiting for location access…"
            : "We'll track your route as you clean"}
        </p>
        {errorMessage && <StatusMessage>{errorMessage}</StatusMessage>}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex-1">
        <LiveTrackMap points={points} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-center px-4">
        <ActivityStats points={points} startedAt={startedAt} isRecording={isRecording} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 p-6">
        {saveError && (
          <div className="w-full max-w-sm">
            <StatusMessage>{saveError}</StatusMessage>
          </div>
        )}
        <div className="flex items-center gap-4 rounded-full border border-[var(--border)]/60 bg-[var(--surface)]/85 p-2 shadow-xl shadow-black/10 backdrop-blur-md">
          {isRecording ? (
            <button
              onClick={stop}
              className="flex items-center gap-2 rounded-full bg-[var(--danger)] px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--danger-hover)]"
            >
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
              Stop
            </button>
          ) : (
            <>
              <button
                onClick={reset}
                disabled={saving}
                className="rounded-full px-6 py-3.5 text-base font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] disabled:opacity-60"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving || points.length < 2}
                className="rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Cleanup"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-sm rounded-xl border border-[var(--border)]/60 bg-[var(--warn-bg)] px-4 py-3 text-center text-sm text-[var(--warn-fg)] shadow-lg shadow-black/5">
      {children}
    </p>
  );
}
