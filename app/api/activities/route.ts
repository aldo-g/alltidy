import { createClient } from "@/lib/supabase/server";
import { totalRouteDistance } from "@/lib/geo/distance";
import type { NewActivity } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as NewActivity;

  if (!Array.isArray(body.route_points) || body.route_points.length < 2) {
    return Response.json({ error: "A route needs at least two points." }, { status: 400 });
  }
  if (!body.duration_seconds || body.duration_seconds <= 0) {
    return Response.json({ error: "Invalid duration." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .insert({
      started_at: body.started_at,
      ended_at: body.ended_at,
      duration_seconds: body.duration_seconds,
      route_points: body.route_points,
      distance_meters: totalRouteDistance(body.route_points),
      device_id: body.device_id,
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ activity: data }, { status: 201 });
}
