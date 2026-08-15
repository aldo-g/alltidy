"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString } from "geojson";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

interface MapProps {
  routes: FeatureCollection<LineString>;
}

export default function Map({ routes }: MapProps) {
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
        center: AMSTERDAM_CENTER,
        zoom: 13,
        attributionControl: false,
      });
    } catch {
      queueMicrotask(() => setUnsupported(true));
      return;
    }
    mapRef.current = map;

    map.on("error", () => setUnsupported(true));

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", () => {
      map.addSource("community-routes", {
        type: "geojson",
        data: routes,
      });

      // Soft glow underlay so routes read clearly against the muted basemap.
      map.addLayer({
        id: "community-routes-glow",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#10b981",
          "line-width": 10,
          "line-opacity": 0.18,
          "line-blur": 2,
        },
      });

      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#059669",
          "line-width": 3.5,
          "line-opacity": 0.95,
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

    const source = map.getSource("community-routes") as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(routes);
    }
  }, [routes]);

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
        Your browser doesn&apos;t support the map view (WebGL is required).
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
