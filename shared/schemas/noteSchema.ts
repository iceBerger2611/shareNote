import { z } from "zod";

export const noteIdSchema = z.string().min(1);

export const noteSchema = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1).max(120).default("Untitled"),
  content: z.string().max(50000).nullable(),
  updatedAt: z.date(),
  createdAt: z.date(),
  version: z.number().int().nonnegative(),
});
