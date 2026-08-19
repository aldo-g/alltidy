import { useSyncExternalStore } from "react";
import type { LngLat } from "@/lib/types";

export type PostedActivity = {
  id: string;
  route_points: LngLat[];
  created_at: string;
  distance_meters: number;
};

// Phase-1 in-memory store standing in for a real Supabase insert — lets the
// Map tab reflect a freshly "posted" cleanup without any backend, satisfying
// the Record -> Summary -> Post -> Map demo loop end to end.
let activities: PostedActivity[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function addPostedActivity(activity: PostedActivity) {
  activities = [activity, ...activities];
  emit();
}

export function usePostedActivities(): PostedActivity[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => activities
  );
}
