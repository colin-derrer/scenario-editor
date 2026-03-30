import { type MapLayerMouseEvent } from "react-map-gl/maplibre";
import { useMapplicationContext } from "./map-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MapContextMenuProps {
  onClose: () => void;
  event: MapLayerMouseEvent;
}

export function MapContextMenu({ onClose, event }: MapContextMenuProps) {
  const mapCtx = useMapplicationContext();

  const handleCreateUnit = () => {
    mapCtx.createEntity({ coordinates: event.lngLat });
  };

  return (
    <DropdownMenu onOpenChange={onClose} defaultOpen>
      <DropdownMenuTrigger>
        <div className="size-2 rounded-full bg-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={handleCreateUnit}>Create Unit</DropdownMenuItem>
        <DropdownMenuItem>Create Marker</DropdownMenuItem>
        <DropdownMenuItem>Debug this location</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
