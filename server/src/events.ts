import { ESocketEvents, Events } from "@shared";
import { Server as IOServer } from "socket.io"

export const makeEvents = (io: IOServer): Events => ({
  noteCreated: (note) => io.emit(ESocketEvents["note:created"].toString(), note),
  noteUpdate: (note) => io.emit(ESocketEvents["note:updated"].toString(), note),
  noteDeleted: (note) => io.emit(ESocketEvents["note:deleted"].toString(), note),
});