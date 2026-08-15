"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: AMSTERDAM_CENTER,
      zoom: 13,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("community-routes", {
        type: "geojson",
        data: routes,
      });

      map.addLayer({
        id: "community-routes-line",
        type: "line",
        source: "community-routes",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#22c55e",
          "line-width": 4,
          "line-opacity": 0.85,
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

  return <div ref={containerRef} className="h-full w-full" />;
}
