import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import { createApp } from "./app";
import { registerSocket } from "./socket";
import { makeEvents } from "./events";
import { makeNotesService } from "./services/note.service";
import { makeNotesRouter } from "./routes/notes.routes";

dotenv.config();

const app = createApp();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  connectionStateRecovery: {},
});

registerSocket(io);

const events = makeEvents(io);

const notesService = makeNotesService({ events });

app.use("/api/notes", makeNotesRouter({ notesService }));

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("chat message", msg);
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });
