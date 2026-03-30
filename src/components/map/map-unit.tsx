import { CarIcon } from "lucide-react";
import { Marker } from "react-map-gl/maplibre";
import { useMapplicationContext } from "@/components/map/map-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import type { MapEntity } from "@/lib/map-types";
import type React from "react";

type MapUnitProps = {
  entity: MapEntity;
};

export function MapUnit({ entity }: MapUnitProps) {
  const ctx = useMapplicationContext();

  const isSelected = ctx.selection.has(entity.id);
  const { coordinates } = entity;

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      ctx.selectEntity(entity.id);
    } else {
      ctx.unselectEntity(entity.id);
    }
  };

  return (
    <Marker longitude={coordinates.lng} latitude={coordinates.lat}>
      <ContextMenu>
        <ContextMenuTrigger onContextMenu={(e) => e.stopPropagation()}>
          <div
            className={`rounded-full bg-muted-foreground p-1 ring-2 ring-muted-foreground ring-offset-2 transition-colors hover:opacity-80 data-selected:bg-primary data-selected:ring-primary data-selected:hover:bg-primary/80`}
            onClick={handleSelectClick}
            data-selected={isSelected}
            data-entity-id={entity.id}
          >
            <CarIcon />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              Create command...
              <ContextMenuShortcut>⌘T</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>Copy data as JSON</ContextMenuItem>
                <ContextMenuItem>
                  Lng Lat: ({coordinates.lng.toFixed(4)}, {coordinates.lat.toFixed(4)})
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </Marker>
  );
}
