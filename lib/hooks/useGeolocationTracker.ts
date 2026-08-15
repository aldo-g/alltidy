"use client";

import { useCallback, useRef, useState } from "react";
import type { LngLat } from "@/lib/types";

export type TrackerStatus =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopped"
  | "denied"
  | "unsupported"
  | "error";

export function useGeolocationTracker() {
  const [status, setStatus] = useState<TrackerStatus>("idle");
  const [points, setPoints] = useState<LngLat[]>([]);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      setErrorMessage("Your browser doesn't support location tracking.");
      return;
    }

    setStatus("requesting-permission");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("recording");
        setStartedAt(new Date().toISOString());
        setPoints([[position.coords.longitude, position.coords.latitude]]);

        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            setPoints((prev) => [...prev, [pos.coords.longitude, pos.coords.latitude]]);
          },
          (err) => {
            setStatus("error");
            setErrorMessage(describeError(err));
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setErrorMessage(
            "Location permission denied — enable it in your browser settings to record a cleanup."
          );
        } else {
          setStatus("error");
          setErrorMessage(describeError(err));
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, []);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setStatus("stopped");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setPoints([]);
    setStartedAt(null);
    setErrorMessage(null);
  }, []);

  return { status, points, startedAt, errorMessage, start, stop, reset };
}

function describeError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.POSITION_UNAVAILABLE:
      return "Couldn't get your location — try again outside or check your device's location settings.";
    case err.TIMEOUT:
      return "Location is taking a while — check your GPS signal and try again.";
    default:
      return "Something went wrong while tracking your location.";
  }
}
