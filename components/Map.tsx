"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, LineString, Point } from "geojson";
import { applyMonochromeStyle } from "@/lib/mapStyle";

const AMSTERDAM_CENTER: [number, number] = [4.9041, 52.3676];

// Freshness fade window — a spot cleaned today reads as vivid moss green
// and fades smoothly back toward the amber uncleaned baseline over this
// many days if it isn't cleaned again.
const FADE_DAYS = 7;
const FRESH_COLOR = "#4d6b4f";
const BASE_COLOR = "#c17f2e";

interface MapProps {
  routes: FeatureCollection<LineString>;
  freshnessPoints: FeatureCollection<Point>;
}

export default function Map({ routes, freshnessPoints }: MapProps) {
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

      map.addSource("community-freshness", {
        type: "geojson",
        data: freshnessPoints,
      });

      // Thin base line so every cleaned street is visible as a continuous
      // line even once its freshness has fully faded.
      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": BASE_COLOR,
          "line-width": 1.5,
          "line-opacity": 0.5,
        },
      });

      // Freshness circles laid over the line: color fades from vivid
      // moss (cleaned today) back to the amber base color over FADE_DAYS
      // days. Each cell holds the most recent cleanup that covered it, so
      // a street re-cleaned today looks freshly green even if it was also
      // cleaned weeks ago. Kept tight to the line width so it hugs the
      // road instead of ballooning over it.
      map.addLayer({
        id: "community-freshness-circles",
        type: "circle",
        source: "community-freshness",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 2, 17, 5],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "daysAgo"],
            0, FRESH_COLOR,
            FADE_DAYS, BASE_COLOR,
          ],
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["get", "daysAgo"],
            0, 0.95,
            FADE_DAYS, 0.5,
          ],
          "circle-blur": 0.15,
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

    const freshnessSource = map.getSource("community-freshness") as
      | mapboxgl.GeoJSONSource
      | undefined;
    freshnessSource?.setData(freshnessPoints);
  }, [routes, freshnessPoints]);

  if (unsupported) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-sm text-[var(--muted)]">
        Your browser doesn&apos;t support the map view (WebGL is required).
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
