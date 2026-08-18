import Link from "next/link";
import Map from "@/components/Map";
import AuthButton from "@/components/AuthButton";
import PersonalStats from "@/components/PersonalStats";
import { createClient } from "@/lib/supabase/server";
import { routesToFeatureCollection, routesToFreshnessSegments } from "@/lib/geo/geojson";
import { MOCK_ROUTES } from "@/lib/mockRoutes";

export default async function Home() {
  const supabase = await createClient();
  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase
      .from("activities")
      .select("id, route_points, distance_meters, created_at, user_id")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const routes = error || !data || data.length === 0 ? MOCK_ROUTES : data;
  const routeCollection = routesToFeatureCollection(routes);
  const freshnessSegments = routesToFreshnessSegments(routes);
  const weeklyMeters = sumMetersSinceLastWeek(data ?? []);

  const user = userData.user;
  const communityMeters = (data ?? []).reduce(
    (sum, activity) => sum + (activity.distance_meters ?? 0),
    0
  );
  const personalMeters = user
    ? (data ?? [])
        .filter((activity) => activity.user_id === user.id)
        .reduce((sum, activity) => sum + (activity.distance_meters ?? 0), 0)
    : 0;

  return (
    <div className="relative h-screen w-screen">
      <Map routes={routeCollection} freshnessSegments={freshnessSegments} />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="glass-panel pointer-events-auto flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            A
          </span>
          <h1 className="font-display text-[16px] font-semibold tracking-tight">AllTidy</h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/record"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--accent)]/35 active:scale-[0.97]"
          >
            Start a cleanup
          </Link>
          <AuthButton />
        </div>
      </header>

      {user && <PersonalStats personalMeters={personalMeters} communityMeters={communityMeters} />}

      {weeklyMeters > 0 && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-10">
          <div className="glass-panel pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            <span className="font-display tabular-nums font-semibold">
              {formatDistance(weeklyMeters)}
            </span>
            <span className="text-[var(--muted)]">cleaned this week</span>
          </div>
        </div>
      )}
    </div>
  );
}

function sumMetersSinceLastWeek(
  activities: { created_at: string; distance_meters: number }[]
): number {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return activities
    .filter((activity) => new Date(activity.created_at).getTime() >= weekAgo)
    .reduce((sum, activity) => sum + (activity.distance_meters ?? 0), 0);
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
