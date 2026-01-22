import { RequestHandler, Router, Response } from "express";
import { z, ZodError } from "zod";
import { prisma } from "../prisma";
import { parseId } from "../utils";
import { createNoteSchema } from "@app/shared/schemas/createNoteSchema";
import { updateNoteSchema } from "@app/shared/schemas/updateNoteSchema";
import { type createNote, type updateNote } from "@app/shared";

type NoteIdParams = { id: string };

const isPrismaNotFound = (e: unknown): e is { code: string } =>
  typeof e === "object" &&
  e !== null &&
  "code" in e &&
  (e as any).code === "P2025";

const createBodySchema = z.object({ noteValues: createNoteSchema });
const updateBodySchema = z.object({ noteValues: updateNoteSchema });

const notesRouter = Router();

const catchHandler = (err: unknown, res: Response) => {
  console.log(err);
  if (isPrismaNotFound(err)) return res.status(404).json({ error: "Not found" });
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request",
      details: err.flatten(),
    });
  }

  if (
    err instanceof Error &&
    err.message.toLowerCase().includes("invalid id")
  ) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
};

const getAllNotes: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({ orderBy: { id: 'asc' } });
    res.status(200).json(notes);
  } catch (error) {
    return catchHandler(error, res);
  }
};

const getTitles: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({
      select: { id: true, title: true },
      orderBy: { id: "asc" },
    });
    res.status(200).json(notes);
  } catch (error) {
    return catchHandler(error, res);
  }
};

const getNoteByIdParams: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const note = await prisma.note.findUnique({
      where: { id },
    });
    if (!note) return res.status(404).json({ error: "Not found" });
    res.status(200).json(note);
  } catch (error) {
    return catchHandler(error, res);
  }
};

const addNewNote: RequestHandler<any, any, { noteValues: createNote }> = async (
  req,
  res
) => {
  try {
    const { noteValues } = createBodySchema.parse(req.body);
    const newNote = await prisma.note.create({
      data: {
        title: noteValues.title,
        content: noteValues.content,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    return catchHandler(error, res);
  }
};

const updateExistingNote: RequestHandler<
  NoteIdParams,
  any,
  { noteValues: updateNote }
> = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const { noteValues: updateNoteData } = updateBodySchema.parse(req.body);
    const updatedNote = await prisma.note.update({
      data: { content: updateNoteData.content },
      where: { id },
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    return catchHandler(error, res);
  }
};

const deleteNoteById: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const note = await prisma.note.delete({
      where: { id },
    });
    res.status(200).json(note);
  } catch (error) {
    return catchHandler(error, res);
  }
};

notesRouter.get("/", getAllNotes);

notesRouter.get("/titles", getTitles);

notesRouter.get("/:id", getNoteByIdParams);

notesRouter.post("/", addNewNote);

notesRouter.patch("/:id", updateExistingNote);

notesRouter.delete("/:id", deleteNoteById);

export default notesRouter;
