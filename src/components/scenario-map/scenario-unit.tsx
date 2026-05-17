import { useAtom } from "jotai";
import { Marker } from "react-map-gl/maplibre";

import type { unitAtom } from "@/stores/stores";

type ScenarioUnitProps = {
  incomingAtom: typeof unitAtom;
  id: string;
};
// type ScenarioUnitProps = {
//   lngLat: [number, number];
//   id: string;
// };

export function ScenarioUnit({ id, incomingAtom }: ScenarioUnitProps) {
  const [unit] = useAtom(incomingAtom);
  if (!unit) return null;
  return (
    <Marker longitude={unit.lngLat.lng} latitude={unit.lngLat.lat} anchor="bottom">
      <div className="size-4 bg-green-500" data-map-target="unit" data-unit-id={id}></div>
    </Marker>
  );
}
