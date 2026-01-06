import { z } from "zod";
import { noteSchema } from "@app/shared/schemas/noteSchema";
import { createNoteSchema } from "@app/shared/schemas/createNoteSchema";
import { updateNoteSchema } from "@app/shared/schemas/updateNoteSchema";
export type note = z.infer<typeof noteSchema>;
export type createNote = z.infer<typeof createNoteSchema>;
export type updateNote = z.infer<typeof updateNoteSchema>;
//# sourceMappingURL=note.d.ts.map