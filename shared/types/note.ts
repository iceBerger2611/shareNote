// shared/types/note.ts

import { z } from "zod";
import { noteSchema } from "../schemas/noteSchema";
import { createNoteSchema } from "../schemas/createNoteSchema";
import { updateNoteSchema } from "../schemas/updateNoteSchema";

export type Note = z.infer<typeof noteSchema>;

export type CreateNote = z.infer<typeof createNoteSchema>;

export type UpdateNote = z.infer<typeof updateNoteSchema>;
