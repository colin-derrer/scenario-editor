import { useAtom, useSetAtom } from "jotai";
import {
  Map,
  Marker,
  type MapLayerMouseEvent,
  type StyleSpecification,
} from "react-map-gl/maplibre";
import { MapContextMenu, resolveContextTarget } from "@/components/scenario-map/map-context-menu";
import { ScenarioUnit } from "@/components/scenario-map/scenario-unit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import mapStyleJson from "@/lib/map-style.json";
import "maplibre-gl/dist/maplibre-gl.css";
import { contextMenuAtom, unitsFamily, unitsMapAtom } from "@/stores/stores";

export function ScenarioMap() {
  const setCtxMenu = useSetAtom(contextMenuAtom);
  // const [unitsMap] = useAtom(unitsMapAtom);

  const onContextMenuClick = (e: MapLayerMouseEvent) => {
    const contextTarget = resolveContextTarget(e);
    setCtxMenu(contextTarget);
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
    >
      <MapContextMenu />
      {for (const what of unitsFamily.getParams()) {}}
      {unitsFamily.getParams().((unitId) => (
        <ScenarioUnit key={unitId} id={unitId} incomingAtom={unitsFamily({id})!} />
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
