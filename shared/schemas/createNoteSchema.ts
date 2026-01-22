import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().max(120),
  content: z.string().max(50000).optional(),
});
