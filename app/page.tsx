import Link from "next/link";
import Map from "@/components/Map";
import AuthButton from "@/components/AuthButton";
import PersonalStats from "@/components/PersonalStats";
import { createClient } from "@/lib/supabase/server";
import { routesToFeatureCollection, routesToFreshnessPoints } from "@/lib/geo/geojson";
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
  const freshnessPoints = routesToFreshnessPoints(routes);
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
      <Map routes={routeCollection} freshnessPoints={freshnessPoints} />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--border)]/60 bg-[var(--surface)]/80 py-2 pl-3 pr-4 shadow-lg shadow-black/5 backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            A
          </span>
          <h1 className="text-[15px] font-semibold tracking-tight">AllTidy</h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/record"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-[var(--accent-hover)]"
          >
            Start a cleanup
          </Link>
          <AuthButton />
        </div>
      </header>

      {user && <PersonalStats personalMeters={personalMeters} communityMeters={communityMeters} />}

      {weeklyMeters > 0 && (
        <div className="pointer-events-none absolute bottom-24 right-4 z-10">
          <div className="pointer-events-auto rounded-full border border-[var(--border)]/60 bg-[var(--surface)]/80 px-4 py-2 text-sm font-medium shadow-lg shadow-black/5 backdrop-blur-md">
            <span className="tabular-nums">{formatDistance(weeklyMeters)}</span> of streets
            cleaned this week
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
