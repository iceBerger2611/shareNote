import { RequestHandler, Router } from "express";
import { prisma } from "../prisma";
import type { createNote } from "@app/shared";

type NoteIdParams = { id: string };

export const notesRouter = Router();

const getAllNotes: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.send(notes);
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
    res.send(notes);
  } catch (error) {
    res.send(`an error occured: ${error}`);
  }
};

const AddNewNote: RequestHandler<any, any, { noteValues: createNote }> = async (
  req,
  res
) => {
  const { noteValues: note } = req.body;
};

notesRouter.get("/", getAllNotes);

notesRouter.get("/:id", getNoteByIdParams);

notesRouter.post("/", async (req, res) => {});
