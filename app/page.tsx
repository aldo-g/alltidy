import Link from "next/link";
import Map from "@/components/Map";
import { createClient } from "@/lib/supabase/server";
import { routesToFeatureCollection } from "@/lib/geo/geojson";
import { MOCK_ROUTES } from "@/lib/mockRoutes";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("id, route_points")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  const routes = error || !data || data.length === 0 ? MOCK_ROUTES : data;
  const routeCollection = routesToFeatureCollection(routes);

  return (
    <div className="relative h-screen w-screen">
      <Map routes={routeCollection} />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--border)]/60 bg-[var(--surface)]/80 py-2 pl-3 pr-4 shadow-lg shadow-black/5 backdrop-blur-md">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            A
          </span>
          <h1 className="text-[15px] font-semibold tracking-tight">AllTidy</h1>
        </div>
        <Link
          href="/record"
          className="pointer-events-auto rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-colors hover:bg-[var(--accent-hover)]"
        >
          Start a cleanup
        </Link>
      </header>
    </div>
  );
}
