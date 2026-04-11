import { nanoid } from "nanoid";
import { type MapLayerMouseEvent } from "react-map-gl/maplibre";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { entityCollection } from "@/lib/entity-collection";

interface MapContextMenuProps {
  onClose: () => void;
  event: MapLayerMouseEvent;
}

export function MapContextMenu({ onClose, event }: MapContextMenuProps) {
  const handleCreateUnit = () => {
    entityCollection.insert({ id: nanoid(), lngLat: event.lngLat, selected: false });
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
