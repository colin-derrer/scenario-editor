import {
  Map,
  Marker,
  type MapLayerMouseEvent,
  type StyleSpecification,
} from "react-map-gl/maplibre";
import { MapContextMenu } from "@/components/scenario-map/map-context-menu";
import { ScenarioUnit } from "@/components/scenario-map/scenario-unit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "maplibre-gl/dist/maplibre-gl.css";
import { resolveContextTarget } from "@/lib/map-interactions/event-target-resolution";
import mapStyleJson from "@/lib/map-style.json";
import { useEditorStore, useScenarioStore } from "@/stores/editor-store";

export function ScenarioMap() {
  const units = useScenarioStore((s) => s.units);
  const setCtxMenu = useEditorStore((s) => s.setContextMenu);

  const onContextMenuClick = (e: MapLayerMouseEvent) => {
    const contextTarget = resolveContextTarget(e);
    setCtxMenu({ lngLat: contextTarget.lngLat.toArray() });
    e.originalEvent?.preventDefault();
  };

  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      mapStyle={mapStyleJson as StyleSpecification}
      onContextMenu={onContextMenuClick}
      reuseMaps={true}
    >
      <MapContextMenu />
      {[...units.keys()].map((entityId) => (
        <ScenarioUnit key={entityId} id={entityId} />
      ))}
      <Marker longitude={-122} latitude={37} anchor="bottom">
        <div className="bg-amber-500 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Marker>
    </Map>
  );
}
