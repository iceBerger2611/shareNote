import { Events, type CreateNote, type UpdateNote } from "@shared";
import { prisma } from "../prisma";

export const makeNotesService = (deps: { events: Events }) => ({
  getNotes: async () => {
    const notes = await prisma.note.findMany({ orderBy: { id: "asc" } });
    return notes;
  },

  getTitles: async () => {
    const titles = await prisma.note.findMany({
      select: { id: true, title: true },
      orderBy: { id: "asc" },
    });
    return titles;
  },

  getNoteById: async (id: number) => {
    const note = await prisma.note.findUnique({
      where: { id },
    });
    return note;
  },

  addNote: async (createNote: CreateNote) => {
    const newNote = await prisma.note.create({
      data: createNote,
    });
    deps.events.noteCreated(newNote);
    return newNote;
  },

  updateExistingNote: async (id: number, updateNote: UpdateNote) =>{
    const updatedNote = await prisma.note.update({ where: { id }, data: updateNote })
    deps.events.noteUpdate(updatedNote)
    return updatedNote
  },

  deleteNoteById: async (id: number) =>{
    const deletedNote = await prisma.note.delete({
      where: { id },
    })
    deps.events.noteDeleted(deletedNote)
    return deletedNote
  },
});

export type NotesService = ReturnType<typeof makeNotesService>;
