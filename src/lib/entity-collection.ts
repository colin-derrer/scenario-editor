import {
  createCollection,
  localOnlyCollectionOptions,
  localStorageCollectionOptions,
} from "@tanstack/react-db";
import { nanoid } from "nanoid";
import { z, type ZodLiteral } from "zod";
import { lngLatSchema } from "@/lib/common-schemas";
import { MAP_ORIGIN } from "@/lib/constants";

type EntityOrders = "move_to_coordinates" | "move_to_point" | "attack";

export const entityOrdersSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("move_to_coordinates") satisfies ZodLiteral<EntityOrders>,
    destination: lngLatSchema,
  }),
  z.object({
    type: z.literal("move_to_point"),
    endpointId: z.string(),
  }),
  z.object({
    type: z.literal("attack"),
    targetId: z.string(),
  }),
]);

export const persistedEntitySchema = z.object({
  id: z.string(),
  lngLat: lngLatSchema,
});

export const entitySchema = persistedEntitySchema.extend({
  selected: z.boolean(),
});

export const entityCollection = createCollection(
  localStorageCollectionOptions({
    id: "entity-state",
    storageKey: "entity-storage-key",
    getKey: (item) => item.id,
    schema: entitySchema,
    storage: sessionStorage,
  }),
);
