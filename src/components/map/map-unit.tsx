import { eq, useLiveQuery } from "@tanstack/react-db";
import { CarIcon } from "lucide-react";
import { Marker } from "react-map-gl/maplibre";
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
import { entityCollection } from "@/lib/entity-collection";

import type React from "react";

export function MapUnit({ entityId }: { entityId: string }) {
  const { data: entity } = useLiveQuery((q) =>
    q
      .from({ it: entityCollection })
      .where(({ it }) => eq(it.id, entityId))
      .findOne(),
  );

  if (!entity) throw new Error("Expecting to have an entity be available");

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    entityCollection.update(entity.id, (draft) => (draft.selected = !draft.selected));
  };

  return (
    <Marker longitude={entity.lngLat.lng} latitude={entity.lngLat.lat}>
      <ContextMenu>
        <ContextMenuTrigger onContextMenu={(e) => e.stopPropagation()}>
          <div
            className={`rounded-full bg-muted-foreground p-1 ring-2 ring-muted-foreground ring-offset-2 transition-colors hover:opacity-80 data-selected:bg-primary data-selected:ring-primary data-selected:hover:bg-primary/80`}
            onClick={handleSelectClick}
            data-selected={entity.selected}
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
            <ContextMenuItem>{entity.id}</ContextMenuItem>
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
                  Lng Lat: ({entity.lngLat.lng.toFixed(4)}, {entity.lngLat.lat.toFixed(4)})
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
