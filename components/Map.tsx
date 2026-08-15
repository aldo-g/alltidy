"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString, Point } from "geojson";
import { applyMonochromeStyle } from "@/lib/mapStyle";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

// Absolute color scale by real overlap count — a street cleaned once
// always reads as this dim red/orange, cleaned 4+ times always reads as
// this vivid green, regardless of what else is on screen. Unlike Mapbox's
// heatmap-density (which normalizes relative to the densest thing
// currently visible), this scale never shifts.
const INTENSITY_COLORS = {
  1: "#c2410c",
  2: "#d97706",
  3: "#65a30d",
  4: "#16a34a",
  max: "#047857",
} as const;

interface MapProps {
  routes: FeatureCollection<LineString>;
  overlapPoints: FeatureCollection<Point>;
}

export default function Map({ routes, overlapPoints }: MapProps) {
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

      map.addSource("community-overlap", {
        type: "geojson",
        data: overlapPoints,
      });

      // Thin base line so a street cleaned only once is still clearly
      // visible as a continuous line, colored to match a count of 1.
      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": INTENSITY_COLORS[1],
          "line-width": 2.5,
          "line-opacity": 0.6,
        },
      });

      // Overlap-count circles laid over the line: each grid cell's color
      // and size reflect the real number of distinct activities that
      // covered it — an absolute scale, not relative density, so a single
      // cleanup never gets mistaken for a heavily-cleaned street.
      map.addLayer({
        id: "community-overlap-circles",
        type: "circle",
        source: "community-overlap",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            ["step", ["get", "count"], 3, 2, 4, 3, 5, 4, 6.5],
            17,
            ["step", ["get", "count"], 8, 2, 11, 3, 14, 4, 18],
          ],
          "circle-color": [
            "step",
            ["get", "count"],
            INTENSITY_COLORS[1],
            2,
            INTENSITY_COLORS[2],
            3,
            INTENSITY_COLORS[3],
            4,
            INTENSITY_COLORS[4],
            5,
            INTENSITY_COLORS.max,
          ],
          "circle-opacity": 0.9,
          "circle-blur": 0.3,
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

    const overlapSource = map.getSource("community-overlap") as mapboxgl.GeoJSONSource | undefined;
    overlapSource?.setData(overlapPoints);
  }, [routes, overlapPoints]);

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
        Your browser doesn&apos;t support the map view (WebGL is required).
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
