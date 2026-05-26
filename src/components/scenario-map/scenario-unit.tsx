import { Marker } from "react-map-gl/maplibre";
import { useScenarioStore } from "@/stores/editor-store";

type ScenarioUnitProps = {
  id: string;
};

export function ScenarioUnit({ id }: ScenarioUnitProps) {
  const unit = useScenarioStore((s) => s.units.get(id));
  if (!unit) throw new Error("Expecting ScenarioUnit to have a value");
  const { lngLat } = unit;
  return (
    <Marker longitude={lngLat[0]} latitude={lngLat[1]} anchor="bottom">
      <div className="size-4 bg-green-500" data-map-target="unit" data-unit-id={id}></div>
    </Marker>
  );
}
