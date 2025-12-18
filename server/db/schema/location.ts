import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const location = sqliteTable("location", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
  unique().on(t.name, t.userId), // user-specific name
]);

const NameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters");
const DescriptionSchema = z.string()
  .max(1000, "Description must be at most 1000 characters")
  .optional();
const LatSchema = z.coerce.number()
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");
const LongSchema = z.coerce.number()
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

export const locationRelations = relations(location, ({ many }) => ({
  locationLogs: many(locationLog),
}));

export const InsertLocation = createInsertSchema(location, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
}).omit({
  id: true,
  slug: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectLocation = typeof location.$inferSelect;

export type InsertLocation = z.infer<typeof InsertLocation>;
