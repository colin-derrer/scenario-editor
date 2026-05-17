import { atom } from "jotai";
import { atomFamily } from "jotai-family";

import type { LngLat } from "react-map-gl/maplibre";

export const contextMenuAtom = atom<{
  lngLat: LngLat;
} | null>();

export const unitAtom = atom<{ id: string; lngLat: { lng: number; lat: number } }>();

export const unitsMapAtom = atom(
  new Map([["123", atom({ id: "123", lngLat: { lng: 1, lat: 2 } })]]),
);

export const unitsFamily = atomFamily(
  ({ id, lngLat }: { id: string; lngLat: [number, number] }) => atom({ id, lngLat }),
  (a, b) => a.id === b.id,
);

export const scenarioEditorAtom = atom({
  units: unitsMapAtom,
  // selected: atom((get) => new Set([...get(unitsMapAtom).keys()])),
});
