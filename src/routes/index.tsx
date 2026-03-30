import { createFileRoute } from "@tanstack/react-router";
import { AppMap } from "@/components/map/app-map";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import "maplibre-gl/dist/maplibre-gl.css";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="flex h-dvh w-dvw">
      <AppSidebar />
      <AppMap />
    </main>
  );
}
