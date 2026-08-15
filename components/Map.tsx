"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString } from "geojson";
import { applyMonochromeStyle } from "@/lib/mapStyle";

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
      applyMonochromeStyle(map);

      map.addSource("community-routes", {
        type: "geojson",
        data: routes,
      });

      // Wide, low-opacity outer glow — mostly invisible on a single pass,
      // but builds into a real halo where several cleanups overlap.
      map.addLayer({
        id: "community-routes-glow-outer",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#00e08f",
          "line-width": 20,
          "line-opacity": 0.12,
          "line-blur": 4,
        },
      });

      // Tighter glow, same overlap-accumulation idea at a smaller radius.
      map.addLayer({
        id: "community-routes-glow-inner",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#00c37a",
          "line-width": 9,
          "line-opacity": 0.35,
          "line-blur": 1.5,
        },
      });

      // Core line: translucent, so a single cleanup reads clearly but
      // streets cleaned repeatedly stack into a visibly brighter, more
      // saturated line as multiple routes overlap the same segment.
      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#047857",
          "line-width": 3.5,
          "line-opacity": 0.55,
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
