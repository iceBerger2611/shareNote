import { RequestHandler, Router } from "express";
import { prisma } from "../prisma";
import type { createNote, updateNote } from "@app/shared";

type NoteIdParams = { id: string };

const notesRouter = Router();

const getAllNotes: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.send(notes).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const getAllNoteTitles: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({
      select: { id: true, title: true },
    });
    res.send(notes).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const getNoteByIdParams: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const notes = await prisma.note.findFirst({
      where: { id: Number(noteId) },
    });
    res.send(notes).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const addNewNote: RequestHandler<any, any, { noteValues: createNote }> = async (
  req,
  res
) => {
  try {
    const { noteValues: createNoteData } = req.body;
    const newnote = await prisma.note.create({
      data: {
        title: createNoteData.title || "",
        content: createNoteData.content,
      },
    });
    res.send(newnote).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const updateExistingNote: RequestHandler<
  NoteIdParams,
  any,
  { noteValues: updateNote }
> = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const { noteValues: updateNoteData } = req.body;
    const newnote = await prisma.note.update({
      data: { content: updateNoteData.content },
      where: { id: Number(noteId) },
    });
    res.send(newnote).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const deleteNoteById: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const { id: noteId } = req.params;
    const note = await prisma.note.delete({
      where: { id: Number(noteId) },
    });
    res.send(note).status(200);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

notesRouter.get("/", getAllNotes);

notesRouter.get("/allNoteTitles", getAllNoteTitles);

notesRouter.get("/:id", getNoteByIdParams);

notesRouter.post("/", addNewNote);

notesRouter.patch("/:id", updateExistingNote);

notesRouter.delete("/:id", deleteNoteById);

export default notesRouter;
