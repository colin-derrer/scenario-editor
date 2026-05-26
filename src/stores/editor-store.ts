import { create } from "zustand";

type EntityId = string;

type EditorTool = "pan" | "select" | "measure" | "general";

type EditorState = {
  tool: EditorTool;
  contextMenu: {
    lngLat: [number, number];
  } | null;
};

type EditorActions = {
  setContextMenu: (menu: EditorState["contextMenu"]) => void;
};

export const useEditorStore = create<EditorState & EditorActions>()((set) => ({
  tool: "general",
  contextMenu: null,
  //   setContextMenu: (menu) => set((state) => ({ ...state, contextMenu: menu })),
  setContextMenu: (menu) => set(() => ({ contextMenu: menu })),
}));

// type EditorActions = {};

// type SelectionStore = {
//   selectedIds: Set<EntityId>;
//   hoveredId: string | null;

//   select: (ids: EntityId[]) => void;
//   hover: (id: EntityId | null) => void;
// };

type Entity = {
  id: EntityId;
  name: string;
  lngLat: [number, number];
};

type ScenarioState = {
  units: Map<EntityId, Entity>;
};

type ScenarioActions = {
  addNew: (entity: Entity) => void;
};

export const useScenarioStore = create<ScenarioState & ScenarioActions>()((set) => ({
  units: new Map<EntityId, Entity>(),
  addNew: (entity: Entity) =>
    set((state) => ({ units: new Map(state.units).set(entity.id, entity) })),
}));
