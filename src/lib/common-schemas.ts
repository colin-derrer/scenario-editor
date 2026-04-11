import { z } from "zod";

import type { LngLatLike } from "maplibre-gl";

export const lngLatSchema = z.object({
  lng: z.number(),
  lat: z.number(),
}) satisfies z.ZodType<LngLatLike>;
