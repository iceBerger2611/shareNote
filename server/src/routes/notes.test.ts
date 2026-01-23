import request from "supertest";
import express from "express";
import { makeNotesRouter } from "./notes.routes";
import { prisma } from "../prisma";
import { testData } from "./test.data";
import { makeNotesService } from "../services/note.service";

const app = express();
app.use(express.json());
const notesTestService = makeNotesService({
  events: {
    noteCreated: () => {},
    noteDeleted: () => {},
    noteUpdate: () => {},
  },
});
app.use("/notes", makeNotesRouter({ notesService: notesTestService }));

const getNonExistentId = async () => {
  const created = await prisma.note.create({ data: testData[0] });
  await prisma.note.delete({ where: { id: created.id } });
  return created.id;
};

describe("Notes Routes", () => {
  beforeEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.note.deleteMany();
    await prisma.$disconnect();
  });

  describe("GET", () => {
    it("GET/ all Notes", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0], testData[1]],
      });
      const response = await request(app).get("/notes");

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(createdNotes.length);
      expect(response.body[0].id).toEqual(createdNotes[0].id);
    });

    it("GET/ all Notes but Empty DB", async () => {
      const response = await request(app).get("/notes");

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(0);
    });

    it("GET/ all Note Titles", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0], testData[1]],
      });

      const response = await request(app).get("/notes/titles");

      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(createdNotes.length);
      expect(response.body[0].id).toEqual(createdNotes[0].id);
      expect(response.body[0].title).toEqual(createdNotes[0].title);
      expect(response.body[0]).not.toHaveProperty("content");
    });

    it("GET/ Note by Id", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0], testData[1]],
      });

      const response = await request(app).get(`/notes/${createdNotes[0].id}`);

      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdNotes[0].id);
    });

    it("GET/ Note by Non Existent Id", async () => {
      await prisma.note.createManyAndReturn({
        data: [testData[0], testData[1]],
      });

      const nonExistentId = await getNonExistentId();

      const response = await request(app).get(`/notes/${nonExistentId}`);

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual("Not found");
    });

    it("GET/ Note by Invalid Id", async () => {
      await prisma.note.createManyAndReturn({
        data: [testData[0], testData[1]],
      });

      const response = await request(app).get("/notes/abc");

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("invalid id");
    });
  });

  describe("POST", () => {
    it("POST/ New Note", async () => {
      const response = await request(app)
        .post("/notes")
        .set("Accept", "application/json")
        .send({ noteValues: testData[0] });

      expect(response.status).toEqual(201);
      expect(response.body.content).toEqual(testData[0].content);
      expect(response.body.title).toEqual(testData[0].title);
      expect(response.body).toHaveProperty("id");

      const all = await prisma.note.findMany();
      expect(all).toHaveLength(1);
      expect(all[0].content).toBe(testData[0].content);
    });

    it("POST/ Invalid Note Values", async () => {
      const response = await request(app)
        .post("/notes")
        .set("Accept", "application/json")
        .send({ noteValues: { ...testData[0], title: 123 } });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Invalid request");
    });
  });

  describe("PATCH", () => {
    it("PATCH/ Patch Existing Note", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0]],
      });

      const response = await request(app)
        .patch(`/notes/${createdNotes[0].id}`)
        .set("Accept", "application/json")
        .send({ noteValues: { content: "new text" } });

      expect(response.status).toEqual(200);
      expect(response.body.content).toEqual("new text");
    });

    it("PATCH/ Patch Non Existing Note", async () => {
      await prisma.note.createManyAndReturn({
        data: [testData[0]],
      });

      const nonExistentId = await getNonExistentId();

      const response = await request(app)
        .patch(`/notes/${nonExistentId}`)
        .set("Accept", "application/json")
        .send({ noteValues: { content: "new text" } });

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual("Not found");
    });

    it("PATCH/ Patch Invalid Note Values", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0]],
      });

      const response = await request(app)
        .patch(`/notes/${createdNotes[0].id}`)
        .set("Accept", "application/json")
        .send({ noteValues: { content: 123 } });

      expect(response.status).toEqual(400);
      expect(response.body.error).toEqual("Invalid request");
    });
  });

  describe("DELETE", () => {
    it("DELETE/ Delete Existing Note", async () => {
      const createdNotes = await prisma.note.createManyAndReturn({
        data: [testData[0]],
      });

      const response = await request(app).delete(
        `/notes/${createdNotes[0].id}`,
      );

      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(createdNotes[0].id);

      const emptyArrayResponse = await request(app).get("/notes");

      expect(emptyArrayResponse.body).toHaveLength(0);
    });

    it("DELETE/ Delete Non Existing Note", async () => {
      await prisma.note.createManyAndReturn({
        data: [testData[0]],
      });

      const nonExistentId = await getNonExistentId();

      const response = await request(app).delete(`/notes/${nonExistentId}`);

      expect(response.status).toEqual(404);
      expect(response.body.error).toEqual("Not found");

      const oneArrayResponse = await request(app).get("/notes");

      expect(oneArrayResponse.body).toHaveLength(1);
    });
  });
});
