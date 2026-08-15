"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString, Point } from "geojson";
import { applyMonochromeStyle } from "@/lib/mapStyle";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

interface MapProps {
  routes: FeatureCollection<LineString>;
  heatPoints: FeatureCollection<Point>;
}

export default function Map({ routes, heatPoints }: MapProps) {
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

      map.addSource("community-heat", {
        type: "geojson",
        data: heatPoints,
      });

      // Thin base line so every cleaned street is visible as a line even
      // where cleanup density is too low for the heatmap to show much.
      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#c2410c",
          "line-width": 2,
          "line-opacity": 0.5,
        },
      });

      // Density heatmap over the same points — a street cleaned by many
      // overlapping activities accumulates more points in the same place,
      // which the color ramp reads as rising intensity: dim red/orange for
      // light coverage, through amber, up to a vivid saturated green for
      // the most-cleaned streets.
      map.addLayer({
        id: "community-heat-layer",
        type: "heatmap",
        source: "community-heat",
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 12, 1, 17, 3],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 12, 8, 17, 22],
          "heatmap-opacity": 0.85,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(194, 65, 12, 0)",
            0.15, "rgba(194, 65, 12, 0.65)",
            0.35, "rgba(217, 119, 6, 0.75)",
            0.55, "rgba(202, 138, 4, 0.8)",
            0.72, "rgba(101, 163, 13, 0.85)",
            0.86, "rgba(22, 163, 74, 0.9)",
            1, "rgba(4, 120, 87, 0.95)",
          ],
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

    const routesSource = map.getSource("community-routes") as mapboxgl.GeoJSONSource | undefined;
    routesSource?.setData(routes);

    const heatSource = map.getSource("community-heat") as mapboxgl.GeoJSONSource | undefined;
    heatSource?.setData(heatPoints);
  }, [routes, heatPoints]);

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
        Your browser doesn&apos;t support the map view (WebGL is required).
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
