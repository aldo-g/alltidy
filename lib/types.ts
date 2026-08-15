export type LngLat = [number, number];

export interface Activity {
  id: string;
  created_at: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  route_points: LngLat[];
  distance_meters: number;
  user_id: string | null;
  device_id: string | null;
  notes: string | null;
  photo_url: string | null;
  is_hidden: boolean;
}

export interface NewActivity {
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  route_points: LngLat[];
  distance_meters: number;
  device_id: string;
  notes?: string;
}
