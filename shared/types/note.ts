import { z } from "zod";
import { noteSchema } from "@app/shared/schemas/noteSchema";
import { createNoteSchema } from "@app/shared/schemas/createNoteSchema";
import { updateNoteSchema } from "@app/shared/schemas/updateNoteSchema";

export type Note = z.infer<typeof noteSchema>;

export type CreateNote = z.infer<typeof createNoteSchema>;

export type UpdateNote = z.infer<typeof updateNoteSchema>;
