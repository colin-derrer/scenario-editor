import { createLiveQueryCollection, eq, useLiveQuery } from "@tanstack/react-db";
import maplibregl, { type BoxZoomEndHandler } from "maplibre-gl";
import { useCallback, useState } from "react";
import { Layer, Map as MapLibreMap, Marker, Source } from "react-map-gl/maplibre";
import { MapContextMenu } from "./map-context-menu";
import { MapUnit } from "./map-unit";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MAP_ORIGIN } from "@/lib/constants";
import { entityCollection } from "@/lib/entity-collection";

import type { Coordinates } from "@/lib/map-types";
import type React from "react";
import type { LayerProps, LngLat, MapLayerMouseEvent, ViewState } from "react-map-gl/maplibre";

const layerStyle: LayerProps = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#FF0000",
  },
};

export function AppMap({ children }: { children?: React.ReactNode }) {
  const { data: entities } = useLiveQuery((q) => q.from({ item: entityCollection }));
  const { data: selected } = useLiveQuery((q) =>
    q.from({ item: entityCollection }).where(({ item }) => eq(item.selected, true)),
  );

  const [clickLocation, setClickLocation] = useState<Coordinates | null>(null);

  const [dropdownMenu, setDropdownMenu] = useState<{
    lngLat: LngLat;
    event: MapLayerMouseEvent;
  } | null>(null);

  const onMapRightClick = useCallback((e: MapLayerMouseEvent) => {
    setDropdownMenu({ lngLat: e.lngLat, event: e });
  }, []);

  const handleDragBoxSelection: BoxZoomEndHandler = (mapInstance, p0, p1) => {
    // TODO: if not adopting layers for rendering map entities, then find way to get the 4 coordinates (quadrilateral) defined by the box zoom and use coordinates to define membership
    // (selectionBounds: LngLatBounds).contains(entity.LngLat)
    const container = mapInstance._container.getBoundingClientRect();

    const startX = Math.min(p0.x, p1.x) + container.left;
    const endX = Math.max(p0.x, p1.x) + container.left;
    const startY = Math.min(p0.y, p1.y) + container.top;
    const endY = Math.max(p0.y, p1.y) + container.top;

    const entitiesToSelect: string[] = [
      ...mapInstance._container.querySelectorAll("div[data-entity-id]"),
    ]
      .map((entityNode) => {
        const clientRect = entityNode.getBoundingClientRect();
        return clientRect.right > startX &&
          clientRect.left < endX &&
          clientRect.bottom > startY &&
          clientRect.top < endY
          ? entityNode.getAttribute("data-entity-id")
          : null;
      })
      .filter((it) => it !== null);

    const alreadySelected = selected.map((it) => it.id);
    // const alreadySelected = entities.filter((it) => it.selected === true).map((it) => it.id);

    entityCollection.update(alreadySelected, (drafts) => {
      drafts.forEach((draft) => {
        draft.selected = false;
      });
    });

    // entityCollection.update(entitiesToSelect, (drafts) => {
    //   drafts.forEach((draft) => {
    //     draft.selected = true;
    //   });
    // });

    entitiesToSelect.forEach((toSelectId) =>
      entityCollection.update(toSelectId, (draft) => {
        draft.selected = true;
      }),
    );
  };

  return (
    <div className="relative size-full">
      <div className="pointer-events-none absolute z-10 size-full *:pointer-events-auto">
        <SidebarTrigger className="absolute top-4 left-4" variant={"default"} size={"icon-lg"} />
        <div className="absolute bottom-4 left-4 rounded-sm border bg-card p-2">
          Count: {entities.length}; Selected: {entities.filter((it) => it.selected).length}
        </div>
      </div>
      <MapLibreMap
        mapStyle="/map-style.json"
        projection={"globe"}
        initialViewState={{
          longitude: MAP_ORIGIN.lng,
          latitude: MAP_ORIGIN.lat,
          zoom: 14,
        }}
        mapLib={maplibregl}
        onClick={(e: MapLayerMouseEvent) => {
          setClickLocation(e.lngLat);
        }}
        onContextMenu={onMapRightClick}
        boxZoom={{
          boxZoomEnd: handleDragBoxSelection,
        }}
      >
        {entities.map((entity) => (
          <MapUnit entityId={entity.id} key={entity.id} />
        ))}
        {dropdownMenu && (
          <Marker longitude={dropdownMenu.lngLat.lng} latitude={dropdownMenu.lngLat.lat}>
            <MapContextMenu onClose={() => setDropdownMenu(null)} event={dropdownMenu.event} />
          </Marker>
        )}
        <Source id="my-data" type="geojson" data={`./demo-geojson.json`}>
          <Layer {...layerStyle} />
        </Source>
        {children}
      </MapLibreMap>
    </div>
  );
}
