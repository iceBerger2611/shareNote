import { z } from "zod";
export const noteIdSchema = z.string().min(1);
export const noteSchema = z.object({
    id: noteIdSchema,
    title: z.string().min(1).max(120).default("Untitled"),
    content: z.string().max(50000).default(""),
    updatedAt: z.iso.datetime(),
    version: z.number().int().nonnegative(),
});
