import { supabase } from "@/lib/supabase/client";
import type { Activity, NewActivity } from "@/lib/types";

export async function fetchActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("id, route_points, distance_meters, created_at, user_id")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function insertActivity(activity: NewActivity): Promise<Activity> {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data as Activity;
}
