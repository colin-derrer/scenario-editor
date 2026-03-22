import { createFileRoute } from "@tanstack/react-router";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layer, Map, Source } from "react-map-gl/maplibre";

import type { FeatureCollection } from "geojson";
import type { LayerProps } from "react-map-gl/maplibre";

export const Route = createFileRoute("/")({ component: App });

const geojson: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-122.4, 37.8],
      },
      properties: { title: "915 Front Street, San Francisco, California" },
    },
  ],
};

const layerStyle: LayerProps = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#FF0000",
  },
};

function App() {
  return (
    <main className="">
      <div className="h-screen w-screen">
        <Map
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          initialViewState={{
            longitude: -122.45,
            latitude: 37.78,
            zoom: 14,
          }}
        >
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      </div>
    </main>
  );
}
