import { z } from "zod";
export const updateNoteSchema = z.object({
    content: z.string().max(50000),
    expectedVersion: z.number().int().nonnegative().optional(),
});
