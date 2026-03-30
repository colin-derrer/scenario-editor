import maplibregl, { type BoxZoomEndHandler } from "maplibre-gl";
import { useCallback, useState } from "react";
import { Layer, Map as MapLibreMap, Marker, Source } from "react-map-gl/maplibre";
import { MapplicationContext } from "./map-context";
import { MapContextMenu } from "./map-context-menu";
import { MapUnit } from "./map-unit";
import { SidebarTrigger } from "@/components/ui/sidebar";

import type { Coordinates, MapEntity } from "@/lib/map-types";
import type React from "react";
import type { LayerProps, LngLat, MapLayerMouseEvent, ViewState } from "react-map-gl/maplibre";

const MAP_ORIGIN = {
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
} as const satisfies Partial<ViewState>;

const layerStyle: LayerProps = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#FF0000",
  },
};

export function AppMap({ children }: { children?: React.ReactNode }) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [clickLocation, setClickLocation] = useState<Coordinates | null>(null);
  const [entities, setEntities] = useState<MapEntity[]>([]);

  const [dropdownMenu, setDropdownMenu] = useState<{
    lngLat: LngLat;
    event: MapLayerMouseEvent;
  } | null>(null);

  const onMapRightClick = useCallback((e: MapLayerMouseEvent) => {
    setDropdownMenu({ lngLat: e.lngLat, event: e });
  }, []);

  const handleCreateEntity = useCallback((entity: Omit<MapEntity, "id">) => {
    setEntities((curr) => [
      ...curr,
      {
        id: Date.now().toString(),
        coordinates: { lng: entity.coordinates.lng, lat: entity.coordinates.lat },
      },
    ]);
  }, []);

  const handleSelectEntity = useCallback(
    (id: string) => {
      const mapEntity = entities.find((it) => it.id === id);
      if (!mapEntity) {
        throw new Error("Failed to find an entity ID to select");
      }
      setSelected((curr) => new Set(curr).add(id));
    },
    [entities],
  );

  const handleRemoveSelectedEntity = useCallback((id: string) => {
    setSelected((curr) => {
      const newSet = new Set(curr);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const handleDragBoxSelection: BoxZoomEndHandler = useCallback((mapInstance, p0, p1) => {
    // TODO: if not adopting layers for rendering map entities, then find way to get the 4 coordinates (quadrilateral) defined by the box zoom and use coordinates to define membership
    // (selectionBounds: LngLatBounds).contains(entity.LngLat)
    const container = mapInstance._container.getBoundingClientRect();

    const startX = Math.min(p0.x, p1.x) + container.left;
    const endX = Math.max(p0.x, p1.x) + container.left;
    const startY = Math.min(p0.y, p1.y) + container.top;
    const endY = Math.max(p0.y, p1.y) + container.top;

    const itemsInBox: string[] = [...mapInstance._container.querySelectorAll("div[data-entity-id]")]
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

    setSelected(new Set(itemsInBox));
  }, []);

  return (
    <div className="relative size-full">
      <div className="pointer-events-none absolute z-10 size-full *:pointer-events-auto">
        <SidebarTrigger className="absolute top-4 left-4" variant={"default"} size={"icon-lg"} />
      </div>
      <MapplicationContext.Provider
        value={{
          selectEntity: handleSelectEntity,
          clearSelection: () => setSelected(new Set()),
          clickLocation,
          createEntity: handleCreateEntity,
          entities: entities,
          unselectEntity: handleRemoveSelectedEntity,
          selection: selected,
        }}
      >
        <MapLibreMap
          mapStyle="/map-style.json"
          projection={"globe"}
          initialViewState={MAP_ORIGIN}
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
            <MapUnit entity={entity} key={entity.id} />
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
      </MapplicationContext.Provider>
    </div>
  );
}
