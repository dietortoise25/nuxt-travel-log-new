import { z } from "zod";

export const NameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be at most 100 characters");

export const DescriptionSchema = z.string()
  .max(1000, "Description must be at most 1000 characters")
  .optional();

export const LatSchema = z.coerce.number()
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");

export const LongSchema = z.coerce.number()
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

export const DateSchema = z.number({
  message: "Date is required",
});
