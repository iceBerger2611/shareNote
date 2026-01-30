import { RequestHandler, Router, Response } from "express";
import { z, ZodError } from "zod";
import { parseId } from "../utils";
import {
  createNoteSchema,
  updateNoteSchema,
  type CreateNote,
  type UpdateNote,
} from "@shared";
import { NotesService } from "../services/note.service";

type NoteIdParams = { id: string };

const isPrismaNotFound = (e: unknown): e is { code: string } =>
  typeof e === "object" &&
  e !== null &&
  "code" in e &&
  (e as any).code === "P2025";

const createBodySchema = z.object({ noteValues: createNoteSchema });
const updateBodySchema = z.object({ noteValues: updateNoteSchema });


const catchHandler = (err: unknown, res: Response) => {
  console.log(err);
  if (isPrismaNotFound(err))
    return res.status(404).json({ error: "Not found" });
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

export const makeNotesRouter = (deps: { notesService: NotesService }) => {
  const notesRouter = Router();

  const getAllNotes: RequestHandler<{}> = async (_req, res) => {
    try {
      const notes = await deps.notesService.getNotes();
      res.status(200).json(notes);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  const getAllTitles: RequestHandler<{}> = async (_req, res) => {
    try {
      const notes = await deps.notesService.getTitles();
      res.status(200).json(notes);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  const getNoteByIdParams: RequestHandler<NoteIdParams> = async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const note = await deps.notesService.getNoteById(id);
      if (!note) return res.status(404).json({ error: "Not found" });
      res.status(200).json(note);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  const postNewNote: RequestHandler<
    any,
    any,
    { noteValues: CreateNote }
  > = async (req, res) => {
    try {
      const { noteValues } = createBodySchema.parse(req.body);
      const newNote = await deps.notesService.addNote(noteValues);
      res.status(201).json(newNote);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  const patchExistingNote: RequestHandler<
    NoteIdParams,
    any,
    { noteValues: UpdateNote }
  > = async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const { noteValues: updateNoteData } = updateBodySchema.parse(req.body);
      const updatedNote = await deps.notesService.updateExistingNote(
        id,
        updateNoteData,
      );
      res.status(200).json(updatedNote);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  const deleteNote: RequestHandler<NoteIdParams> = async (req, res) => {
    try {
      const id = parseId(req.params.id);
      const note = await deps.notesService.deleteNoteById(id);
      res.status(200).json(note);
    } catch (error) {
      return catchHandler(error, res);
    }
  };
  
  notesRouter.get("/", getAllNotes);
  
  notesRouter.get("/titles", getAllTitles);
  
  notesRouter.get("/:id", getNoteByIdParams);
  
  notesRouter.post("/", postNewNote);
  
  notesRouter.patch("/:id", patchExistingNote);
  
  notesRouter.delete("/:id", deleteNote);

  return notesRouter
}