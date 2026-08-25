import { useCallback, useRef, useState } from "react";
import type { LngLat } from "@/lib/types";
import { totalRouteDistance } from "@/lib/geo/distance";
import seedRoutes from "@/lib/mock/mockSeedRoutes.json";

export type RecordingStatus =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopped"
  | "denied"
  | "unsupported"
  | "error";

const TICK_MS = 700;
const PROGRESS_PER_TICK = 0.035;

// Picks a plausible-length seed route to fake-walk along, deterministically
// varied per session so repeated recordings don't all look identical.
function pickFakeRoute(): LngLat[] {
  const routes = seedRoutes as { id: string; points: LngLat[] }[];
  const candidates = routes.filter((r) => r.points.length >= 8);
  const pool = candidates.length > 0 ? candidates : routes;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick.points;
}

/**
 * Fake-data stand-in for a real GPS tracker: walks along a mock seed route
 * on a timer, fabricating duration/distance/points. Matches the external
 * shape (`status`, `points`, `startedAt`, `start()`, `stop()`, `reset()`)
 * that a real `expo-location`-backed hook will have in phase 2, so screens
 * built against this hook won't need to change when it's swapped in.
 */
export function useRecordingSession() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [points, setPoints] = useState<LngLat[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullRouteRef = useRef<LngLat[]>([]);
  const progressRef = useRef(0);

  const start = useCallback(() => {
    fullRouteRef.current = pickFakeRoute();
    progressRef.current = 0;
    setStatus("recording");
    setStartedAt(new Date().toISOString());
    setElapsedSeconds(0);
    setPoints(fullRouteRef.current.slice(0, 1));

    timerRef.current = setInterval(() => {
      progressRef.current = Math.min(1, progressRef.current + PROGRESS_PER_TICK);
      const n = Math.max(2, Math.round(fullRouteRef.current.length * progressRef.current));
      setPoints(fullRouteRef.current.slice(0, n));
      setElapsedSeconds((s) => s + Math.round(TICK_MS / 1000));
    }, TICK_MS);
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("stopped");
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("idle");
    setPoints([]);
    setStartedAt(null);
    setElapsedSeconds(0);
    progressRef.current = 0;
  }, []);

  const distanceMeters = totalRouteDistance(points);

  return { status, points, startedAt, elapsedSeconds, distanceMeters, start, stop, reset };
}
