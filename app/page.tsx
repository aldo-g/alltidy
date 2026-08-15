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
    <div className="flex h-screen w-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black">
        <h1 className="text-lg font-semibold">AllTidy</h1>
        <Link
          href="/record"
          className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Start a cleanup
        </Link>
      </header>
      <main className="flex-1">
        <Map routes={routeCollection} />
      </main>
    </div>
  );
}
