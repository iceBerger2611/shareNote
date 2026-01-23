import { Note } from "./note"

export type Events = {
  noteCreated: (note: Note) => void;
  noteUpdate: (note: Note) => void;
  noteDeleted: (note: Note) => void;
};