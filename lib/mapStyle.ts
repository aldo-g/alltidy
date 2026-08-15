import type mapboxgl from "mapbox-gl";

/**
 * Strips color and clutter from the default Mapbox style so recorded
 * routes are the only saturated thing on the map. Runs after the style
 * has loaded, since it walks the live layer list rather than authoring
 * a custom Mapbox Studio style.
 */
export function applyMonochromeStyle(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;

    // Hide POI icons/labels, transit markers, and other visual clutter —
    // keep only road and settlement (place-name) labels for orientation.
    // Layer IDs verified against the live mapbox/light-v11 style spec.
    if (
      layer.type === "symbol" &&
      !/road-label|street-label|settlement-.*-label|country-label/.test(id)
    ) {
      map.setLayoutProperty(id, "visibility", "none");
      continue;
    }

    if (layer.type === "fill") {
      if (/water/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#e4e4e7");
      } else if (/building/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#ececec");
      } else if (/landuse|land|park|park-national/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#f2f2f0");
      } else if (/background/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#f7f7f5");
      }
    }

    if (layer.type === "line" && /road|bridge|tunnel/.test(id)) {
      map.setPaintProperty(id, "line-color", "#d4d4d8");
    }

    if (layer.type === "background") {
      map.setPaintProperty(id, "background-color", "#f7f7f5");
    }

    if (layer.type === "symbol" && /label/.test(id)) {
      map.setPaintProperty(id, "text-color", "#a1a1aa");
      map.setPaintProperty(id, "text-halo-color", "#f7f7f5");
    }
  }
}
