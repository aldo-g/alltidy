import { useCallback, useEffect, useState } from "react";
import { fetchActivities } from "@/lib/supabase/activities";
import type { Activity } from "@/lib/types";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setActivities(await fetchActivities());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cleanups.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount, guarded against setting state after unmount —
  // not routed through `reload` so this effect only runs once regardless
  // of `reload`'s identity.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchActivities();
        if (!cancelled) setActivities(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load cleanups.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { activities, loading, error, reload };
}
