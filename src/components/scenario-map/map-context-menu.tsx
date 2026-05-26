import { nanoid } from "nanoid";
import { Marker, type LngLat, type MapLayerMouseEvent } from "react-map-gl/maplibre";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore, useScenarioStore } from "@/stores/editor-store";

export function MapContextMenu() {
  const ctxMenu = useEditorStore((s) => s.contextMenu);
  const setCtxMenu = useEditorStore((s) => s.setContextMenu);
  const createUnit = useScenarioStore((s) => s.addNew);

  if (!ctxMenu) return null;

  const handleCreateUnit = () => {
    createUnit({ id: nanoid(), lngLat: ctxMenu.lngLat, name: "Something" });
  };

  const [lng, lat] = ctxMenu.lngLat;

  // DropdownMenuTrigger is used as the portal for DropdownMenuContent
  return (
    <Marker longitude={lng} latitude={lat}>
      <DropdownMenu defaultOpen onOpenChange={(v) => !v && setCtxMenu(null)}>
        <DropdownMenuTrigger className="sr-only" />
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleCreateUnit}>Create Marker</DropdownMenuItem>
          <DropdownMenuItem>Debug this location</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Marker>
  );
}
