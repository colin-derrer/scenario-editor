export type Unit = {
  id: string;
  name: string;
  faction: "blue" | "red";

  position: {
    lng: number;
    lat: number;
    heading: number;
  };

  formationId?: string;
};

export type EditorState = {
  selectedUnitIds: string[];
  hoveredUnitId?: string;

  activeTool: "select" | "place-unit" | "draw-path" | "formation-builder";

  gizmo:
    | { type: "none" }
    | {
        type: "formation-builder";
        formationId: string;
        draggedHandle?: string;
      };

  currentTime: number;
};
