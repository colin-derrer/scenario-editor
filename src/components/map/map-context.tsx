import { createContext, useContext } from "react";

import type { Coordinates, MapEntity } from "@/lib/map-types";

// TODO: use jotai/zustand for atomic state management instead

type MapContextType = {
  selection: ReadonlySet<string>;
  selectEntity: (id: string) => void;
  unselectEntity: (id: string) => void;
  clearSelection: () => void;

  entities: MapEntity[];
  createEntity: (item: Omit<MapEntity, "id">) => void;

  clickLocation: Coordinates | null;
};

export const MapplicationContext = createContext<MapContextType | null>(null);

export const useMapplicationContext = () => {
  const context = useContext(MapplicationContext);
  if (!context) throw new Error("useMapContext must be used within a MapContextProvider");
  return context;
};
