import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { device_id } = (await req.json()) as { device_id?: string };
  if (!device_id) {
    return Response.json({ error: "Missing device_id." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const { error, count } = await supabase
    .from("activities")
    .update({ user_id: user.id }, { count: "exact" })
    .eq("device_id", device_id)
    .is("user_id", null);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ claimed: count ?? 0 });
}
