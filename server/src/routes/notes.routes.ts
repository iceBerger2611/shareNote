import { RequestHandler, Router } from "express";
import { prisma } from "../prisma";
import {
  createNoteSchema,
  updateNoteSchema,
  type createNote,
  type updateNote,
} from "@app/shared";

type NoteIdParams = { id: string };

const verifyReqData = async (reqData: {
  id?: string;
  createNoteData?: createNote;
  updateNoteData?: updateNote;
}) => {
  if (reqData.id) {
    const convertedId = Number.parseInt(reqData.id, 10);
    if (Number.isNaN(convertedId)) throw new Error("invalid id");
  }
  if (reqData.createNoteData) {
    const result = await createNoteSchema.safeParseAsync(
      reqData.createNoteData
    );
    if (!result.success) throw new Error("invalid create note value/s");
  }
  if (reqData.updateNoteData) {
    const result = await updateNoteSchema.safeParseAsync(
      reqData.updateNoteData
    );
    if (!result.success) throw new Error("invalid update note value/s");
  }
};

const notesRouter = Router();

const getAllNotes: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).send(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

const getAllNoteTitles: RequestHandler<{}> = async (_req, res) => {
  try {
    const notes = await prisma.note.findMany({
      select: { id: true, title: true },
    });
    res.status(200).send(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

const getNoteByIdParams: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const id = req.params.id;
    await verifyReqData({ id });
    const note = await prisma.note.findUnique({
      where: { id: Number(id) },
    });
    res.status(!!note ? 200 : 404).send(note || "error: record not found");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

const addNewNote: RequestHandler<any, any, { noteValues: createNote }> = async (
  req,
  res
) => {
  try {
    const { noteValues: createNoteData } = req.body;
    await verifyReqData({ createNoteData });
    const newNote = await prisma.note.create({
      data: {
        title: createNoteData.title,
        content: createNoteData.content,
      },
    });
    res.status(201).send(newNote);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

const updateExistingNote: RequestHandler<
  NoteIdParams,
  any,
  { noteValues: updateNote }
> = async (req, res) => {
  try {
    const id = req.params.id;
    const { noteValues: updateNoteData } = req.body;
    await verifyReqData({ id, updateNoteData });
    const newNote = await prisma.note.update({
      data: { content: updateNoteData.content },
      where: { id: Number(id) },
    });
    res
      .status(!!newNote.id ? 200 : 404)
      .send(newNote.id || "error: record not found");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

const deleteNoteById: RequestHandler<NoteIdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    await verifyReqData({ id });
    const note = await prisma.note.delete({
      where: { id: Number(id) },
    });
    res.status(!!note ? 200 : 404).send(note || "error: record not found");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.error(error)
  }
};

notesRouter.get("/", getAllNotes);

notesRouter.get("/allNoteTitles", getAllNoteTitles);

notesRouter.get("/:id", getNoteByIdParams);

notesRouter.post("/", addNewNote);

notesRouter.patch("/:id", updateExistingNote);

notesRouter.delete("/:id", deleteNoteById);

export default notesRouter;
