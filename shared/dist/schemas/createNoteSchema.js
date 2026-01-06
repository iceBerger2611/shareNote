import { z } from "zod";
export const createNoteSchema = z.object({
    title: z.string().min(1).max(120).optional(),
    content: z.string().max(50000).optional(),
});
