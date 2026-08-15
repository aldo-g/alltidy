"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeToFeature } from "@/lib/geo/geojson";
import type { LngLat } from "@/lib/types";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

interface LiveTrackMapProps {
  points: LngLat[];
}

export default function LiveTrackMap({ points }: LiveTrackMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: points[0] ?? AMSTERDAM_CENTER,
      zoom: 16,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("live-route", {
        type: "geojson",
        data: routeToFeature(points),
      });

      map.addLayer({
        id: "live-route-line",
        type: "line",
        source: "live-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#2563eb",
          "line-width": 5,
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("live-route") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(routeToFeature(points));
    }

    const latest = points[points.length - 1];
    if (latest) {
      map.easeTo({ center: latest, duration: 500 });
    }
  }, [points]);

  return <div ref={containerRef} className="h-full w-full" />;
}
