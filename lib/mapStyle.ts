import type mapboxgl from "mapbox-gl";

/**
 * Strips all text and color from the default Mapbox style so the road/path
 * network and recorded routes are the only things visible. Runs after the
 * style has loaded, since it walks the live layer list rather than
 * authoring a custom Mapbox Studio style.
 */
export function applyMonochromeStyle(map: mapboxgl.Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;

    // No text anywhere — labels, POI icons, place names all hidden.
    if (layer.type === "symbol") {
      map.setLayoutProperty(id, "visibility", "none");
      continue;
    }

    if (layer.type === "fill") {
      if (/water/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#e3ddc9");
      } else if (/building/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#efe9db");
      } else if (/landuse|land|park|park-national/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#f2ecdd");
      } else if (/background/.test(id)) {
        map.setPaintProperty(id, "fill-color", "#f6f0e2");
      }
    }

    // Roads and paths are the secondary highlight beneath the recorded
    // routes — darker than the rest of the basemap for clear structure,
    // but with enough separation from the route colors that cleanups
    // still read as the dominant color on the map.
    if (layer.type === "line" && /road|bridge|tunnel/.test(id)) {
      map.setPaintProperty(id, "line-color", "#a89a7c");
    }

    if (layer.type === "background") {
      map.setPaintProperty(id, "background-color", "#f6f0e2");
    }
  }
}
