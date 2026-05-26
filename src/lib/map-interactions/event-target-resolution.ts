import type { LngLat, MapLayerMouseEvent } from "react-map-gl/maplibre";

export type ContextTarget =
  | {
      kind: "map";
      lngLat: LngLat;
    }
  | {
      kind: "unit";
      unitId: string;
      lngLat: LngLat;
    }
  | {
      kind: "formation";
      formationId: string;
      lngLat: LngLat;
    }
  | {
      kind: "gizmo";
      gizmoType: string;
      targetId: string;
      lngLat: LngLat;
    }
  | {
      kind: "feature";
      source: string;
      featureId: string | number;
      properties: Record<string, unknown>;
      lngLat: LngLat;
    };

export function resolveContextTarget(e: MapLayerMouseEvent): ContextTarget {
  // resolving dom targets first by walking up tree
  let el = e.originalEvent.target as HTMLElement | null;
  while (el) {
    const type = el.dataset.mapTarget;
    if (type === "unit") {
      return {
        kind: "unit",
        lngLat: e.lngLat,
        unitId: el.dataset.unitId as string,
      };
    }
    el = el.parentElement;
  }

  const selectedFeatures = e.target.queryRenderedFeatures(e.point);
  if (selectedFeatures.length > 0) {
    const firstFeature = selectedFeatures[0];
    return {
      kind: "feature",
      featureId: firstFeature.id!,
      lngLat: e.lngLat,
      properties: firstFeature.properties,
      source: firstFeature.source,
    };
  }

  return { kind: "map", lngLat: e.lngLat };
}
