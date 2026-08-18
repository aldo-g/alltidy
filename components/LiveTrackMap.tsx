"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeToFeature } from "@/lib/geo/geojson";
import { applyMonochromeStyle } from "@/lib/mapStyle";
import type { LngLat } from "@/lib/types";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

interface LiveTrackMapProps {
  points: LngLat[];
}

export default function LiveTrackMap({ points }: LiveTrackMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [unsupported, setUnsupported] = useState(() => !mapboxgl.supported());

  useEffect(() => {
    if (!containerRef.current || mapRef.current || unsupported) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: points[0] ?? AMSTERDAM_CENTER,
        zoom: 16,
        attributionControl: false,
      });
    } catch {
      queueMicrotask(() => setUnsupported(true));
      return;
    }
    mapRef.current = map;

    map.on("error", () => setUnsupported(true));

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      applyMonochromeStyle(map);

      map.addSource("live-route", {
        type: "geojson",
        data: routeToFeature(points),
      });

      map.addLayer({
        id: "live-route-glow",
        type: "line",
        source: "live-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#2563eb",
          "line-width": 14,
          "line-opacity": 0.25,
          "line-blur": 3,
        },
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

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
        Your browser doesn&apos;t support the map view (WebGL is required). You can still record — your route is being tracked.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
