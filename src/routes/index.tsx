import { createFileRoute } from "@tanstack/react-router";
import { MapContextMenu } from "@/components/scenario-map/map-context-menu";
import "maplibre-gl/dist/maplibre-gl.css";
import { ScenarioMap } from "@/components/scenario-map/scenario-map";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex h-dvh w-dvw">
      <ScenarioMap />
    </div>
  );
}
